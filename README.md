# PortForge 🛠️

PortForge is an automated, AI-powered developer portfolio generator. Sync your GitHub (and LinkedIn) profile, let AI figure out which of your projects actually belong on a portfolio, pick a themed site, and publish it to a shareable URL — no design or writing required.

## ✨ Features

- **GitHub sync, including collaborator contributions** — pulls in every repo you own *and* repos you've genuinely contributed to as a collaborator (real commit history, not just ownership), while filtering out forks, archived repos, and empty repos.
- **AI-powered portfolio ranking** — a single request per profile sends all your eligible repos (with READMEs intelligently summarized) to an LLM that ranks them *comparatively* — not by stars, but by uniqueness, technical depth, documentation quality, and real-world usefulness — and sorts them into Featured / Recommended / Hidden. Results are cached; re-analysis only costs a new AI call if your repos actually changed.
- **You have final say** — pin up to 3 projects as your explicit "Top Picks" and reorder them by hand. The AI ranking is a starting point, not the final word — pinned order always wins on your public portfolio.
- **Six portfolio themes** — Architect (Brutalist), Luxor (Egyptian), Nebula (Space), Asclepius (Medical), Professional (Editorial), and Sakura Journey (Cinematic, a six-chapter scroll-driven experience). Preview and edit any theme with your real data before publishing.
- **Resume upload & parsing** — drop in a PDF resume and PortForge extracts skills, experience, and education to help fill out your profile.
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

### 2. Configure environment variables

**`server/.env`** (see `server/.env.example`):
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/portforge
CLIENT_URL=http://localhost:5173
JWT_SECRET=a-long-random-string
GEMINI_API_KEY=your_gemini_api_key_here
CLERK_ISSUER=https://your-instance.clerk.accounts.dev
GITHUB_TOKEN=your_github_personal_access_token
```
`CLERK_ISSUER` is the domain segment of your Clerk publishable key (`pk_test_<base64>` — decode the base64 to find it). `GITHUB_TOKEN` needs no special scopes; it's used for both the GitHub REST/GraphQL APIs and GitHub Models AI inference.

**`client/.env`** (see `client/.env.example`):
```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_publishable_key
VITE_API_URL=http://localhost:5000
```

### 3. Run it

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
- **Frontend**: includes `vercel.json` and a `_redirects` file for SPA routing on Vercel/Netlify. Set `VITE_API_URL` to your deployed backend at build time (Vite bakes env vars in at build, not runtime).

## 📄 License

MIT
