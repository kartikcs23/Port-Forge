<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:0d1527,100:eb3b3b&height=200&section=header&text=PortForge&fontSize=70&fontColor=ffffff&animation=fadeIn&fontAlignY=38&desc=Forge%20a%20portfolio%20from%20your%20real%20code&descAlignY=58&descSize=18&descColor=e6e6e6" width="100%" alt="PortForge" />

<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=18&pause=1200&color=EB3B3B&center=true&vCenter=true&width=680&lines=AI-ranked+GitHub+portfolios+in+seconds;Six+themes.+One+link.+Zero+design+skills.;You+pin+the+top+picks%2C+not+the+algorithm." alt="Typing SVG" />

[![React](https://img.shields.io/badge/React_19-0d1527?style=for-the-badge&logo=react&logoColor=eb3b3b)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-0d1527?style=for-the-badge&logo=node.js&logoColor=eb3b3b)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-0d1527?style=for-the-badge&logo=mongodb&logoColor=eb3b3b)](https://www.mongodb.com)
[![Clerk](https://img.shields.io/badge/Clerk_Auth-0d1527?style=for-the-badge&logo=clerk&logoColor=eb3b3b)](https://clerk.com)

</div>

PortForge is an automated, AI-powered developer portfolio generator. Sync your GitHub (and LinkedIn) profile, let AI figure out which of your projects actually belong on a portfolio, pick a themed site, and publish it to a shareable URL — no design or writing required.

<div align="center">
  <img src="docs/assets/demo.gif" width="100%" alt="PortForge demo — AI-ranked dashboard and the Luxor theme" />
  <sub>Real recording — AI-ranked repo dashboard, then the Luxor (Egyptian) portfolio theme.</sub>
</div>

## ✨ Features

- **GitHub sync, including collaborator contributions** — pulls in every repo you own *and* repos you've genuinely contributed to as a collaborator (real commit history, not just ownership), while filtering out forks, archived repos, and empty repos.
- **AI-powered portfolio ranking** — a single request per profile sends all your eligible repos (with READMEs intelligently summarized) to an LLM that ranks them *comparatively* — not by stars, but by uniqueness, technical depth, documentation quality, and real-world usefulness — and sorts them into Featured / Recommended / Hidden. Results are cached; re-analysis only costs a new AI call if your repos actually changed. If the AI provider is temporarily unavailable, your repos still show up unranked instead of erroring out.
- **You have final say** — pin up to 3 projects as your explicit "Top Picks" and reorder them by hand. The AI ranking is a starting point, not the final word — pinned order always wins on your public portfolio.
- **Six portfolio themes** — Architect (Brutalist), Luxor (Egyptian), Nebula (Space), Asclepius (Medical), Professional (Editorial), and Sakura Journey (Cinematic, a six-chapter scroll-driven experience). Preview and edit any theme with your real data before publishing, mobile included.
- **Full profile editor** — bio, timeline, skills, and a dedicated **Achievements** section (hackathons, certifications, honors) that surfaces across every theme and resume template, not just one.
- **Resume Creator** — generate a print-ready resume straight from your synced projects and profile, in Classic, Modern, or Compact layouts, with inline editing before you export.
- **Resume upload & parsing** — drop in a PDF resume and PortForge extracts skills, experience, and education to help fill out your profile.
- **Candidate Analysis** — a standalone tool for the other side of the table: point it at a GitHub username, a target role, and a tech stack, and it produces a skill-match report against real repo activity.
- **Secure authentication** — Clerk-based sign-in, with server-side JWT verification against Clerk's JWKS (no session bypass).
- **Admin dashboard & insights** — usage stats, user/portfolio management, and GitHub/LinkedIn activity insights.

## 🛠️ Tech Stack

- **Frontend**: React 19 (Vite), Tailwind CSS, Framer Motion, GSAP (for the Cinematic theme), Clerk React, React Router
- **Backend**: Node.js, Express, Mongoose
- **Database**: MongoDB
- **AI**: GitHub Models (`meta/Llama-4-Scout-17B-16E-Instruct`) for comparative portfolio ranking; Google Gemini for per-repo README quality scoring
- **Data sources**: GitHub REST API + GraphQL (for collaborator contribution data)

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- MongoDB (local or Atlas)
- A [Clerk](https://clerk.com) application (for auth)
- A GitHub [personal access token](https://github.com/settings/tokens) (raises API rate limits and is required for AI ranking)

### 1. Install dependencies

```bash
cd server && npm install
cd ../client && npm install
```

### 2. Run it

**Terminal 1 — backend:**
```bash
cd server
npm run dev
```

**Terminal 2 — frontend:**
```bash
cd client
npm run dev
```

Visit `http://localhost:5173`.

## 🧠 How the AI ranking works

1. On sync, PortForge fetches your owned repos (REST) and repos you've collaborated on (GraphQL contribution data), excluding forks, archived, and empty repos.
2. When you rank with AI (or automatically, the first time you visit your dashboard/profile), every eligible repo — with its README intelligently truncated to the sections that matter (overview, features, tech stack, architecture) — is sent to the model in a **single request**.
3. The model compares every repo against every other repo in your profile and returns three buckets: `featured_projects`, `recommended_projects`, and `hidden_projects`, each with a relative score, category, and a portfolio-ready one-line description.
4. The result is cached against your latest repo's update timestamp — nothing changed since your last analysis means an instant cached response, no repeat AI call.
5. You can override anything: pin your actual top 3 picks and reorder them — that always takes priority over the AI's suggestion on your public portfolio.

## 📦 Deployment

- **Backend**: includes a `Procfile` (`web: node server.js`) and a pinned Node engine — deploys cleanly to Render, Railway, Heroku, or similar. Set `CLIENT_URL` to your deployed frontend's origin.
- **Frontend**: includes `vercel.json` and a `_redirects` file for SPA routing on Vercel/Netlify. Set `VITE_API_URL` to your deployed backend at build time (Vite bakes env vars in at build, not runtime). Your live portfolio's public link is served straight off your deployed domain (e.g. `port-forge.vercel.app/your-github-username`) — no extra configuration needed.

<div align="center">
<img src="https://capsule-render.vercel.app/api?type=waving&color=0:eb3b3b,100:0d1527&height=100&section=footer" width="100%" alt="" />
</div>
