const axios = require('axios');
const { getGithubToken } = require('./githubService');

/* ═══════════════════════════════════════════════════════
   GITHUB MODELS SERVICE
   Wraps a single call to the GitHub Models inference endpoint
   (OpenAI-compatible chat completions). Exactly one request per
   profile analysis — the caller is responsible for batching every
   candidate repo into one prompt rather than looping per-repo.
 ═══════════════════════════════════════════════════════ */

const ENDPOINT = 'https://models.github.ai/inference/chat/completions';
const MODEL = 'meta/Llama-4-Scout-17B-16E-Instruct';

const SYSTEM_PROMPT = `You are ranking a developer's GitHub repositories to decide which ones belong in their portfolio.

Your goal is NOT to judge the developer for hiring. Your goal is to determine, relative to each other, which of THIS developer's own repositories are the strongest candidates to feature.

Compare every repository against every other repository provided. Rank them from strongest to weakest for portfolio inclusion. Do not score repositories independently — the ranking must be relative to the set you were given.

Judge on:
- Project uniqueness
- Technical complexity
- Feature completeness
- Technology stack
- Real-world usefulness
- Documentation quality
- Professional presentation
- Architecture described in the README
- Deployment information
- Overall portfolio value

Some repositories are ones the developer contributed to as a collaborator
rather than owning outright (marked "contribution_role": "collaborator",
with a "collaborator_commits" count). Treat real, substantial collaborator
contributions as legitimate portfolio material — contributing meaningfully
to a serious project (e.g. a well-known open-source library) can be more
impressive than a small solo side project. Weigh the actual commit count
and the project's substance, not just ownership — a handful of trivial
commits to a huge repo shouldn't outrank a smaller project the developer
built and owns end-to-end.

Do NOT judge based on popularity. Do NOT prefer stars over quality — a well-documented, technically interesting project with zero stars can outrank a popular but shallow one.

Scoring is relative to the set provided:
- The strongest repo(s) should generally score 95-100.
- Average repos should fall between 60-85.
- Weak repos score below 60.
- Never give every repository nearly identical scores — the ranking must clearly separate outstanding projects from average ones.

Sort repositories into exactly three buckets:
- "featured_projects": the strongest repos, ranked #1 downward.
- "recommended_projects": solid but not standout repos, still ranked.
- "hidden_projects": repos that do not belong in a portfolio (too thin, unclear purpose, low effort, etc). These do not need a score — just a short reason.

For every featured project, write a "portfolio_description": a concise, professional, portfolio-ready description, maximum 60 words.

Return ONLY valid JSON matching this exact schema, no markdown fences, no commentary, no extra text before or after the JSON:

{
  "featured_projects": [
    { "rank": 1, "repository": "string", "score": 96, "confidence": 98, "category": "string", "reason": "string", "portfolio_description": "string" }
  ],
  "recommended_projects": [
    { "rank": 4, "repository": "string", "score": 78, "confidence": 85, "category": "string", "reason": "string", "portfolio_description": "string" }
  ],
  "hidden_projects": [
    { "repository": "string", "reason": "string" }
  ]
}`;

const buildUserPrompt = (repos) => {
  const payload = repos.map((r) => ({
    repository: r.name,
    description: r.description,
    primary_language: r.language,
    languages_used: r.languages,
    stars: r.stars,
    forks: r.forks,
    last_updated: r.updatedAt,
    topics: r.topics,
    repository_size_kb: r.sizeKb,
    contribution_role: r.isCollaboration ? 'collaborator' : 'owner',
    ...(r.isCollaboration ? { collaborator_commits: r.contributionCommits } : {}),
    readme: r.readme,
  }));

  return `Here are ${repos.length} repositories from a single GitHub profile. Compare them against each other and return the ranking JSON described in your instructions.\n\n${JSON.stringify(payload, null, 2)}`;
};

/**
 * extractJson — Defensive parse: strips markdown fences if the model added
 * them despite instructions, then parses the first {...} block found.
 */
const extractJson = (content) => {
  let text = content.trim();
  const fenceMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenceMatch) text = fenceMatch[1].trim();

  try {
    return JSON.parse(text);
  } catch (err) {
    const braceMatch = text.match(/\{[\s\S]*\}/);
    if (braceMatch) {
      return JSON.parse(braceMatch[0]);
    }
    throw new Error('AI response was not valid JSON');
  }
};

const requestRanking = async (repos, token) => {
  let response;
  try {
    response = await axios.post(
      ENDPOINT,
      {
        model: MODEL,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: buildUserPrompt(repos) },
        ],
        temperature: 0.3,
        top_p: 1.0,
        max_tokens: 4000,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        timeout: 60000,
      }
    );
  } catch (err) {
    const status = err.response?.status;
    if (status === 401 || status === 403) {
      throw new Error('GitHub Models request rejected — check that GITHUB_TOKEN has model inference access.');
    }
    if (status === 429) {
      throw new Error('GitHub Models rate limit hit. Try again later.');
    }
    const upstreamMessage = err.response?.data?.error?.message || err.message || 'GitHub Models request failed';
    // GitHub runs scheduled "brownouts" (temporary planned outages) as an
    // advance-warning period before retiring a Models API — this is not a
    // bug in our request, and it isn't worth retrying immediately. Mark it
    // so the caller can degrade gracefully (unranked repos) instead of
    // surfacing a scary error for something outside our control.
    if (status === 503 || status === 502 || status === 504 || /brownout|temporarily unavailable/i.test(upstreamMessage)) {
      const transientError = new Error(upstreamMessage);
      transientError.transient = true;
      throw transientError;
    }
    throw new Error(upstreamMessage);
  }

  const content = response.data?.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error('GitHub Models returned an empty response');
  }

  const parsed = extractJson(content);

  if (
    !Array.isArray(parsed.featured_projects) ||
    !Array.isArray(parsed.recommended_projects) ||
    !Array.isArray(parsed.hidden_projects)
  ) {
    throw new Error('AI response did not match the expected ranking schema');
  }

  return parsed;
};

// LLMs occasionally emit a JSON response with a small syntax slip (an
// unescaped quote, a stray token) that no amount of defensive parsing can
// recover. A same-request retry almost always succeeds since generation is
// non-deterministic — cheaper and simpler than trying to hand-repair broken
// JSON. Auth/rate-limit failures are not retried; retrying won't fix them.
const MAX_PARSE_RETRIES = 2;

/**
 * rankRepositoriesWithAI — The single AI request for a whole profile
 * (retried up to MAX_PARSE_RETRIES times only if the model's output fails
 * to parse as valid JSON — never retried for auth/rate-limit errors).
 * @param {Array} repos — candidate repos from repoRankingService
 * @returns {Promise<Object>} parsed { featured_projects, recommended_projects, hidden_projects }
 */
const rankRepositoriesWithAI = async (repos) => {
  const token = getGithubToken();
  if (!token) {
    throw new Error('GITHUB_TOKEN is not configured — required for GitHub Models AI ranking.');
  }

  let lastParseError;
  for (let attempt = 1; attempt <= MAX_PARSE_RETRIES; attempt += 1) {
    try {
      return await requestRanking(repos, token);
    } catch (err) {
      const isParseFailure = /JSON|ranking schema/i.test(err.message);
      if (!isParseFailure || attempt === MAX_PARSE_RETRIES) throw err;
      lastParseError = err;
      console.warn(`AI ranking response failed to parse (attempt ${attempt}/${MAX_PARSE_RETRIES}), retrying:`, err.message);
    }
  }
  throw lastParseError;
};

module.exports = { rankRepositoriesWithAI, buildUserPrompt, extractJson, MODEL };
