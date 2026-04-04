# Port-Forge LinkedIn + ML (Add-On)

This folder is an optional, add-only module that works without official LinkedIn APIs.
It uses LinkedIn data export files and simple ML-lite heuristics to generate:
- Project difficulty scoring (Easy/Normal/Hard)
- Badges based on GitHub activity
- Timeline events from repo + commit history
- Similar developer matching (feature-based cosine similarity)

No changes are required to the existing server or client. You can wire this output later.

## Why no official LinkedIn API
LinkedIn's official API requires partner access. This module uses the LinkedIn data export instead.

## Inputs
### LinkedIn export folder (CSV files)
Export from LinkedIn settings -> data export. Use the extracted folder path.
Expected files (if present):
- Profile.csv
- Positions.csv
- Education.csv
- Skills.csv

### GitHub data JSON
A local JSON file with the structure described below.

## Quick Start
From this folder:

```
node src/index.js --linkedin-export "C:\path\to\LinkedIn-Export" --github "examples\github.sample.json" --out "out.json"
```

## Output
A single JSON file with:
- linkedin: normalized LinkedIn data
- features: computed features
- projectScores: per-repo difficulty and score
- badges: derived badges
- timeline: merged timeline events
- similarity: list of similar devs (if candidates provided)

## GitHub JSON schema (minimal)
```
{
  "profile": {
    "username": "jane",
    "name": "Jane Doe",
    "bio": "Full stack dev",
    "createdAt": "2020-06-01"
  },
  "repos": [
    {
      "name": "portfolio",
      "description": "Personal site",
      "primaryLanguage": "JavaScript",
      "stars": 4,
      "forks": 1,
      "openIssues": 0,
      "totalIssuesClosed": 3,
      "totalCommits": 35,
      "isFork": false,
      "isEmpty": false,
      "createdAt": "2022-01-01",
      "updatedAt": "2024-11-10",
      "readmeLength": 1200,
      "topics": ["web", "react"],
      "languages": {"JavaScript": 8500, "CSS": 1200}
    }
  ],
  "commits": [
    {"date": "2024-10-01T23:40:00Z"},
    {"date": "2024-10-02T12:10:00Z"}
  ],
  "issues": [
    {"state": "closed"},
    {"state": "closed"},
    {"state": "open"}
  ]
}
```

## Candidate dataset for similarity (optional)
Provide a JSON file with an array of the above GitHub schema. The CLI will compute a similarity list.

## Notes
- All ML is explainable heuristic scoring so you can use it without training data.
- You can later swap these heuristics for a real model without changing the output schema.
