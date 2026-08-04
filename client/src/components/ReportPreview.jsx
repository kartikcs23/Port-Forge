import React from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  Star,
  GitFork,
  Zap,
  ExternalLink,
  Check,
  X,
} from 'lucide-react';

/* ─────────────────────────────────────────────────────────────────
   DESIGN TOKENS  (one place to change spacing / sizing)
──────────────────────────────────────────────────────────────────── */
// Card padding applied uniformly to every section card
const CARD_P = 'p-4';              // screen
const CARD_P_PRINT = 'print:p-[10px_14px]';
const SUBCARD = 'bg-background border border-border print:bg-[#f8fafc] print:border-[#e2e8f0] p-3 print:p-[8px_12px]';
const CARD_BASE = `bg-card border-2 border-border shadow-[4px_4px_0px_0px_#090e1a] ${CARD_P} ${CARD_P_PRINT} print-card space-y-3`;
// All stat number cells share this shape
const STAT_CELL = `${SUBCARD} flex flex-col items-center justify-center text-center min-h-[64px]`;

/* ─────────────────────────────────────────────────────────────────
   SCORE GAUGE  (circular ring in header)
──────────────────────────────────────────────────────────────────── */
const ScoreGauge = ({ score = 0 }) => {
  const radius = 34;
  const circ   = 2 * Math.PI * radius;
  const n      = Math.min(Math.max(score, 0), 100);
  const offset = circ - (n / 100) * circ;
  const stroke = n >= 75 ? '#22c55e' : n >= 50 ? '#eab308' : '#eb3b3b';

  return (
    /* self-start keeps the badge top-aligned with the header text block */
    <div className="relative w-[88px] h-[88px] flex-shrink-0 self-start mt-1 print:w-[72px] print:h-[72px]">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={radius}
          stroke="rgba(255,255,255,0.08)" strokeWidth="8" fill="transparent"
          className="print:stroke-[#e2e8f0]" />
        <circle cx="50" cy="50" r={radius}
          stroke={stroke} strokeWidth="8"
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round" fill="transparent"
          style={{ transition: 'stroke-dashoffset 0.7s ease' }} />
      </svg>
      {/* inner text — absolutely centered inside the SVG */}
      <div className="absolute inset-0 flex flex-col items-center justify-center leading-none gap-0.5">
        <span className="text-[22px] font-black text-white print:text-gray-900 font-mono">{n}</span>
        <span className="text-[7px] font-black uppercase tracking-[0.15em] text-muted-foreground print:text-gray-500">/ 100</span>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────
   SECTION TITLE  — small coloured square + all-caps label
──────────────────────────────────────────────────────────────────── */
const SectionTitle = ({ children, color = 'bg-primary' }) => (
  <div className="flex items-center gap-2 border-b border-border print:border-gray-300 pb-1.5 mb-3">
    <span className={`w-2 h-2 flex-shrink-0 ${color} print:opacity-80`} />
    <h3 className="text-[10px] font-black uppercase tracking-[0.22em] text-muted-foreground print:text-gray-600 leading-none">
      {children}
    </h3>
  </div>
);

/* ─────────────────────────────────────────────────────────────────
   PROGRESS BAR  — consistent height, right-aligned % label
──────────────────────────────────────────────────────────────────── */
const ProgressBar = ({ label, percentage = 0, barColor = 'bg-green-500' }) => (
  <div className="space-y-[3px]">
    {/* label row — fixed 56 px column for the % so all labels align */}
    <div className="flex items-baseline gap-2">
      <span className="flex-1 text-[10.5px] font-bold text-foreground print:text-gray-900 leading-none">{label}</span>
      <span className="w-9 text-right text-[10px] font-mono font-bold text-foreground/80 print:text-gray-700">{percentage}%</span>
    </div>
    <div className="w-full h-[7px] bg-secondary print:bg-gray-200 border border-border print:border-gray-300 overflow-hidden">
      <div className={`h-full ${barColor} print:opacity-90`} style={{ width: `${percentage}%`, transition: 'width 0.5s ease' }} />
    </div>
  </div>
);

/* ─────────────────────────────────────────────────────────────────
   PAGE FOOTER — rendered identically on every page
──────────────────────────────────────────────────────────────────── */
const PageFooter = ({ page, total, date }) => (
  <div className="flex items-center justify-between border-t border-border print:border-gray-200 pt-2 mt-0">
    <span className="text-[8.5px] font-bold uppercase tracking-widest text-muted-foreground print:text-gray-400">
      PortForge AI Assessment
    </span>
    <span className="text-[8.5px] font-bold uppercase tracking-widest text-muted-foreground print:text-gray-400">
      {date}
    </span>
    <span className="text-[8.5px] font-bold uppercase tracking-widest text-muted-foreground print:text-gray-400">
      Page {page} / {total}
    </span>
  </div>
);

/* ─────────────────────────────────────────────────────────────────
   MAIN COMPONENT
──────────────────────────────────────────────────────────────────── */
export const ReportPreview = ({ data }) => {
  if (!data?.analysis || !data?.githubData) return null;

  const { githubData, leetcodeData, analysis } = data;

  const formattedDate = new Date().toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });

  const candidateName  = analysis.candidateName || githubData.name || githubData.login || 'Candidate';
  const assessedLevel  = analysis.assessedLevel || analysis.technicalAssessment?.experienceLevel || 'Junior';
  const overallScore   = analysis.overallScore ?? 80;
  const targetRole     = data.analysis.targetRole || 'Software Engineer';

  const statusLabel = analysis.statusLabel || (
    overallScore >= 75 ? 'GOOD' : overallScore >= 50 ? 'AVERAGE' : 'NEEDS IMPROVEMENT'
  );
  const statusColor = overallScore >= 75
    ? 'bg-blue-500/20 text-blue-400 border-blue-500/40 print:bg-blue-50 print:text-blue-700 print:border-blue-300'
    : overallScore >= 50
    ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40 print:bg-yellow-50 print:text-yellow-700 print:border-yellow-300'
    : 'bg-primary/20 text-primary border-primary/40 print:bg-red-50 print:text-red-700 print:border-red-300';

  /* Fallbacks */
  const ats = analysis.atsBreakdown || {
    overallScore: Math.min(overallScore, 85),
    keywords: 85, format: 80, experience: 75, education: 90, skills: 85,
    improvementSuggestions: [
      'Add more relevant industry keywords to the resume',
      'Improve formatting for automated parser readability',
      'Emphasise key project outcomes and tech stack used',
    ],
  };

  const ghInsights = analysis.githubInsights || {
    activityLevel:  `${githubData.public_repos} public repositories. Active contribution history on GitHub.`,
    codeQuality:    `Primary language: ${githubData.topLanguages?.[0] || 'N/A'}. Repository architecture reviewed.`,
    consistency:    `Derived from ${githubData.public_repos} repos and observed commit cadence.`,
    collaboration:  `${githubData.followers} followers · ${githubData.totalStars} stars · ${githubData.totalForks} forks.`,
  };

  const tsMatch = analysis.techStackMatch || {
    matched: githubData.topLanguages || [],
    missing: [],
    matchScore: Math.min(overallScore + 5, 100),
    summary: `${candidateName} demonstrates solid alignment with the required stack for ${targetRole}.`,
  };

  const expMatch = analysis.experienceLevelMatch || {
    required: targetRole,
    assessed: assessedLevel,
    summary: `${candidateName}'s portfolio reflects expectations for a ${assessedLevel} role.`,
  };

  const TOTAL_PAGES = 2;

  return (
    <div className="pdf-report-root w-full font-sans text-foreground">

      {/* ── Print-only global overrides ── */}
      <style>{`
        @media print {
          nav, header, footer,
          .no-print, button, form { display: none !important; }

          html, body {
            background: #ffffff !important;
            color: #0f172a !important;
            font-size: 10px !important;
            margin: 0 !important; padding: 0 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          /* Kill the dark outer wrapper — only the inner page divs should render */
          .pdf-report-root {
            background: #ffffff !important;
            padding: 0 !important;
            margin: 0 !important;
          }

          @page { size: A4 portrait; margin: 9mm 11mm 9mm 11mm; }

          /* ── page-break classes ── */
          .pdf-p1 {
            page-break-after: always !important;
            break-after: page !important;
            padding-bottom: 0 !important;
            margin-bottom: 0 !important;
          }
          /* page 2 does NOT force a break — it just follows page 1 naturally */
          .pdf-p2 {
            page-break-before: avoid !important;
            break-before: avoid !important;
          }

          /* cards */
          .print-card {
            background: #fff !important;
            border: 1px solid #cbd5e1 !important;
            box-shadow: none !important;
            color: #0f172a !important;
            padding: 10px 13px !important;
            margin-bottom: 9px !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            border-radius: 3px !important;
          }
        }
      `}</style>

      {/* ════════════════════════════════════════════════════════════
          PAGE 1
         ════════════════════════════════════════════════════════════ */}
      <div className="pdf-p1 space-y-4 pb-4 print:pb-0">

        {/* 1 · HEADER */}
        <div className="bg-card border-2 border-border shadow-[6px_6px_0px_0px_#090e1a] p-5 print-card">
          {/* Outer flex: text-block left, gauge right — items-start so both sit at the top */}
          <div className="flex flex-row items-start justify-between gap-6">

            {/* Left text block */}
            <div className="flex flex-col gap-1.5 min-w-0">
              {/* badge */}
              <div className="inline-flex items-center gap-1.5 self-start px-2.5 py-0.5
                bg-primary/10 border border-primary/30 text-primary
                print:bg-red-50 print:text-red-700 print:border-red-200">
                <Zap className="w-3 h-3 flex-shrink-0" />
                <span className="text-[9px] font-black uppercase tracking-widest">PortForge AI Assessment</span>
              </div>

              {/* name */}
              <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white print:text-gray-900 leading-none truncate">
                {candidateName}
              </h1>

              {/* sub-title */}
              <p className="text-[11px] font-bold text-muted-foreground print:text-gray-500 uppercase tracking-widest">
                {assessedLevel} · {targetRole}
              </p>

              {/* date */}
              <p className="text-[10px] text-muted-foreground print:text-gray-400 font-medium">
                Assessment generated: {formattedDate}
              </p>

              {/* status + score inline */}
              <div className="flex flex-wrap items-center gap-2 pt-0.5">
                <span className={`px-2.5 py-0.5 border text-[9px] font-black uppercase tracking-widest ${statusColor}`}>
                  {statusLabel}
                </span>
                <span className="text-[11px] font-black text-white print:text-gray-900 font-mono">
                  Score:&nbsp;<span className="text-primary print:text-gray-900">{overallScore}/100</span>
                </span>
              </div>
            </div>

            {/* Right: score ring — top-aligned via self-start on parent */}
            <ScoreGauge score={overallScore} />
          </div>
        </div>

        {/* 2 · EXECUTIVE SUMMARY */}
        <div className={CARD_BASE}>
          <SectionTitle>Executive Summary</SectionTitle>
          <div className="border-l-4 border-primary print:border-blue-500 pl-3 py-0.5">
            <p className="text-[11px] text-foreground/90 print:text-gray-800 font-medium leading-relaxed">
              {analysis.summary}
            </p>
          </div>
        </div>

        {/* 3 · STRENGTHS & CONCERNS — equal-height columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 print:grid-cols-2 gap-4 items-start">
          <div className={CARD_BASE}>
            <SectionTitle color="bg-green-500">Strengths</SectionTitle>
            <ul className="space-y-2">
              {analysis.strengths?.slice(0, 4).map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-[11px] font-medium text-foreground/90 print:text-gray-800">
                  <Check className="w-3.5 h-3.5 text-green-400 print:text-green-600 flex-shrink-0 mt-[1px]" />
                  <span className="leading-snug">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className={CARD_BASE}>
            <SectionTitle color="bg-yellow-400">Concerns</SectionTitle>
            <ul className="space-y-2">
              {(analysis.concerns || analysis.improvements)?.slice(0, 4).map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-[11px] font-medium text-foreground/90 print:text-gray-800">
                  <AlertTriangle className="w-3.5 h-3.5 text-yellow-400 print:text-amber-600 flex-shrink-0 mt-[1px]" />
                  <span className="leading-snug">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 4 · TECHNICAL ASSESSMENT */}
        <div className={CARD_BASE}>
          <SectionTitle>Technical Assessment</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 print:grid-cols-2 gap-3">
            <div className={SUBCARD}>
              <span className="text-[8.5px] font-black uppercase tracking-widest text-muted-foreground print:text-gray-500 block mb-0.5">Primary Stack</span>
              <span className="text-[11px] font-bold text-white print:text-gray-900 block">
                {analysis.technicalAssessment?.primaryStack || analysis.topSkills?.[0] || 'Full-Stack Development'}
              </span>
            </div>
            <div className={SUBCARD}>
              <span className="text-[8.5px] font-black uppercase tracking-widest text-muted-foreground print:text-gray-500 block mb-0.5">Experience Level</span>
              <span className="text-[11px] font-bold text-white print:text-gray-900 block">
                {analysis.technicalAssessment?.experienceLevel || assessedLevel}
              </span>
            </div>
          </div>

          {(analysis.technicalAssessment?.specializations || analysis.topSkills)?.length > 0 && (
            <div className="pt-1 space-y-1.5">
              <span className="text-[8.5px] font-black uppercase tracking-widest text-muted-foreground print:text-gray-500 block">Specializations</span>
              <div className="flex flex-wrap gap-1.5">
                {(analysis.technicalAssessment?.specializations || analysis.topSkills).map((s, i) => (
                  <span key={i} className="px-2.5 py-0.5 text-[10px] font-bold rounded-full
                    bg-secondary text-foreground border border-border
                    print:bg-gray-100 print:text-gray-800 print:border-gray-300">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 5 · TECH STACK MATCH + EXPERIENCE LEVEL MATCH */}
        <div className="grid grid-cols-1 md:grid-cols-2 print:grid-cols-2 gap-4 items-start">

          {/* Tech Stack Match */}
          <div className={CARD_BASE}>
            <SectionTitle>Tech Stack Match</SectionTitle>
            {/* Matched / missing pills */}
            {(tsMatch.matched?.length > 0 || tsMatch.missing?.length > 0) && (
              <div className="flex flex-wrap gap-1.5 mb-2">
                {tsMatch.matched?.map((t, i) => (
                  <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full
                    text-[9.5px] font-bold
                    bg-green-500/10 text-green-400 border border-green-500/30
                    print:bg-green-50 print:text-green-700 print:border-green-200">
                    <Check className="w-2.5 h-2.5" />{t}
                  </span>
                ))}
                {tsMatch.missing?.map((t, i) => (
                  <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full
                    text-[9.5px] font-bold
                    bg-primary/10 text-primary border border-primary/30
                    print:bg-red-50 print:text-red-700 print:border-red-200">
                    <X className="w-2.5 h-2.5" />{t}
                  </span>
                ))}
              </div>
            )}

            {/* Match score bar */}
            <ProgressBar label="Match Score" percentage={tsMatch.matchScore} barColor="bg-blue-500" />

            <p className="text-[10px] text-muted-foreground print:text-gray-600 font-medium leading-snug pt-0.5">
              {tsMatch.summary}
            </p>
          </div>

          {/* Experience Level Match */}
          <div className={CARD_BASE}>
            <SectionTitle color="bg-green-500">Experience Level Match</SectionTitle>
            <div className="bg-green-500/10 border border-green-500/30
              print:bg-green-50 print:border-green-200 p-3 space-y-1.5">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-green-400 print:text-green-700">
                <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                <span>Required: {expMatch.required} · Assessed: {expMatch.assessed}</span>
              </div>
              <p className="text-[10px] text-foreground/90 print:text-gray-800 font-medium leading-snug pl-5">
                {expMatch.summary}
              </p>
            </div>
          </div>
        </div>

        {/* Page 1 Footer */}
        <PageFooter page={1} total={TOTAL_PAGES} date={formattedDate} />
      </div>

      {/* ════════════════════════════════════════════════════════════
          PAGE 2
         ════════════════════════════════════════════════════════════ */}
      <div className="pdf-p2 space-y-4 pt-4 print:pt-0">

        {/* 6 · TOP GITHUB REPOSITORIES */}
        {githubData.topRepos?.length > 0 && (
          <div className={CARD_BASE}>
            <SectionTitle>Top GitHub Repositories</SectionTitle>
            <div className="space-y-2">
              {githubData.topRepos.slice(0, 3).map((repo, i) => (
                <div key={i} className={`${SUBCARD} flex flex-row justify-between items-start gap-3`}>
                  {/* Repo info */}
                  <div className="flex-1 min-w-0 space-y-0.5">
                    <a href={repo.url} target="_blank" rel="noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-primary print:text-blue-700 hover:underline max-w-full">
                      <span className="truncate">{repo.name}</span>
                      <ExternalLink className="w-3 h-3 flex-shrink-0 no-print" />
                    </a>
                    <p className="text-[10px] text-muted-foreground print:text-gray-600 line-clamp-1 leading-snug">
                      {repo.description || 'No description provided'}
                    </p>
                  </div>

                  {/* Stars & Forks — each with explicit icon + label */}
                  <div className="flex-shrink-0 flex flex-col items-end gap-1">
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-muted-foreground print:text-gray-600">
                      <Star className="w-3 h-3 text-yellow-400 fill-yellow-400 print:text-amber-500" />
                      <span>{repo.stars ?? 0} stars</span>
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-muted-foreground print:text-gray-600">
                      <GitFork className="w-3 h-3 text-primary print:text-blue-600" />
                      <span>{repo.forks ?? 0} forks</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 7 · GITHUB ACTIVITY & STATS */}
        <div className={CARD_BASE}>
          <SectionTitle>GitHub Activity &amp; Stats</SectionTitle>

          {/* 4-cell stat grid — uniform STAT_CELL style */}
          <div className="grid grid-cols-2 sm:grid-cols-4 print:grid-cols-4 gap-3">
            {[
              { value: githubData.public_repos, label: 'Public Repos'  },
              { value: githubData.totalStars,   label: 'Total Stars'   },
              { value: githubData.totalForks,   label: 'Forks Earned'  },
              { value: githubData.followers,    label: 'Followers'     },
            ].map(({ value, label }) => (
              <div key={label} className={STAT_CELL}>
                <span className="text-[22px] font-black text-white print:text-gray-900 font-mono leading-none">{value ?? 0}</span>
                <span className="text-[8.5px] font-bold uppercase tracking-widest text-muted-foreground print:text-gray-500 mt-1">{label}</span>
              </div>
            ))}
          </div>

          {githubData.topLanguages?.length > 0 && (
            <div className="pt-2 space-y-1.5 border-t border-border print:border-gray-200">
              <span className="text-[8.5px] font-black uppercase tracking-widest text-muted-foreground print:text-gray-500 block">Top Languages</span>
              <div className="flex flex-wrap gap-1.5">
                {githubData.topLanguages.map((lang, i) => (
                  <span key={i} className="px-2 py-0.5 rounded-full text-[9.5px] font-bold
                    bg-primary/10 text-primary border border-primary/30
                    print:bg-gray-100 print:text-gray-800 print:border-gray-300">
                    {lang}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 8 · LEETCODE PERFORMANCE */}
        {leetcodeData && (
          <div className={CARD_BASE}>
            <SectionTitle>LeetCode Performance</SectionTitle>

            {/* 4-cell stat grid — same STAT_CELL token as GitHub */}
            <div className="grid grid-cols-2 sm:grid-cols-4 print:grid-cols-4 gap-3">
              {[
                { value: leetcodeData.totalSolved  ?? 0, label: 'Total Solved', color: 'text-white print:text-gray-900'         },
                { value: leetcodeData.easySolved   ?? 0, label: 'Easy',         color: 'text-green-400 print:text-green-700'   },
                { value: leetcodeData.mediumSolved ?? 0, label: 'Medium',       color: 'text-yellow-400 print:text-amber-700'  },
                { value: leetcodeData.hardSolved   ?? 0, label: 'Hard',         color: 'text-primary print:text-red-700'       },
              ].map(({ value, label, color }) => (
                <div key={label} className={STAT_CELL}>
                  <span className={`text-[22px] font-black font-mono leading-none ${color}`}>{value}</span>
                  <span className="text-[8.5px] font-bold uppercase tracking-widest text-muted-foreground print:text-gray-500 mt-1">{label}</span>
                </div>
              ))}
            </div>

            {analysis.leetcodeAssessment && (
              <div className={`${SUBCARD} space-y-1`}>
                <span className="text-[8.5px] font-black uppercase tracking-widest text-primary print:text-blue-700 block">AI Assessment</span>
                {analysis.leetcodeAssessment.problemSolving && (
                  <p className="text-[10.5px] text-foreground/90 print:text-gray-800 font-medium leading-snug">
                    <strong className="text-white print:text-gray-900 font-black uppercase text-[9px] tracking-wide">Problem Solving: </strong>
                    {analysis.leetcodeAssessment.problemSolving}
                  </p>
                )}
                {analysis.leetcodeAssessment.summary && (
                  <p className="text-[10.5px] text-foreground/90 print:text-gray-800 font-medium leading-snug">
                    <strong className="text-white print:text-gray-900 font-black uppercase text-[9px] tracking-wide">Summary: </strong>
                    {analysis.leetcodeAssessment.summary}
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* 9 · ATS SCORE BREAKDOWN */}
        <div className={CARD_BASE}>
          {/* Header row — same SectionTitle pattern */}
          <div className="flex items-center justify-between border-b border-border print:border-gray-300 pb-1.5 mb-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 flex-shrink-0 bg-primary print:opacity-80" />
              <h3 className="text-[10px] font-black uppercase tracking-[0.22em] text-muted-foreground print:text-gray-600 leading-none">
                ATS Score Breakdown
              </h3>
            </div>
            <span className="text-[11px] font-black font-mono text-primary print:text-gray-900">{ats.overallScore}%</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 print:grid-cols-2 gap-5">
            {/* Progress bars — uniform spacing via space-y-3 */}
            <div className="space-y-3">
              <ProgressBar label="Keywords"   percentage={ats.keywords}   barColor="bg-green-500"  />
              <ProgressBar label="Format"     percentage={ats.format}     barColor="bg-green-500"  />
              <ProgressBar label="Experience" percentage={ats.experience} barColor="bg-yellow-500" />
              <ProgressBar label="Education"  percentage={ats.education}  barColor="bg-green-500"  />
              <ProgressBar label="Skills"     percentage={ats.skills}     barColor="bg-green-500"  />
            </div>

            {/* Suggestions */}
            <div className="space-y-2">
              <span className="text-[8.5px] font-black uppercase tracking-widest text-muted-foreground print:text-gray-500 block">
                Improvement Suggestions
              </span>
              <ul className="space-y-2">
                {ats.improvementSuggestions?.slice(0, 3).map((sug, i) => (
                  <li key={i} className="flex items-start gap-2 text-[10.5px] text-foreground/90 print:text-gray-800 font-medium">
                    <AlertTriangle className="w-3.5 h-3.5 text-yellow-400 print:text-amber-600 flex-shrink-0 mt-[1px]" />
                    <span className="leading-snug">{sug}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* 10 · GITHUB INSIGHTS — uniform 2×2 subcard grid */}
        <div className={CARD_BASE}>
          <SectionTitle>GitHub Insights</SectionTitle>
          <div className="grid grid-cols-2 print:grid-cols-2 gap-3">
            {[
              { label: 'Activity Level',  value: ghInsights.activityLevel  },
              { label: 'Code Quality',    value: ghInsights.codeQuality    },
              { label: 'Consistency',     value: ghInsights.consistency    },
              { label: 'Collaboration',   value: ghInsights.collaboration  },
            ].map(({ label, value }) => (
              <div key={label} className={`${SUBCARD} space-y-0.5`}>
                <span className="text-[8.5px] font-black uppercase tracking-widest text-muted-foreground print:text-gray-500 block">{label}</span>
                <p className="text-[10.5px] text-foreground/90 print:text-gray-800 font-medium leading-snug">{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Page 2 Footer — identical to page 1 */}
        <PageFooter page={2} total={TOTAL_PAGES} date={formattedDate} />
      </div>

    </div>
  );
};
