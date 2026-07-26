# Port-Forge 🛠️

Port-Forge is an automated, AI-powered developer portfolio generator. It instantly syncs with your GitHub and LinkedIn profiles to fetch, analyze, and beautifully display your projects, giving you a complete, shareable portfolio in seconds.

## ✨ Features

- **GitHub Integration**: Automatically fetches your public repositories, including stars, forks, and programming languages.
- **AI-Powered Project Scoring**: Uses **Google Gemini 1.5 Flash AI** to read through your repository READMEs and dynamically score your projects based on documentation quality, detailed features, and formatting.
- **LinkedIn Overview**: Pulls your basic professional bio and display name directly from your LinkedIn profile URL.
- **Customizable Dashboard**: Pin your top projects, hide the ones you don't want to show, and publish your portfolio to a custom URL slug.
- **Secure Authentication**: Seamless login and user management powered by **Clerk**.

## 🛠️ Skills & Tech Stack

- **Frontend**: React (Vite), Tailwind CSS, Axios, Clerk React
- **Backend**: Node.js, Express.js, Mongoose
- **Database**: MongoDB
- **AI & API Integrations**: Google Gemini API, GitHub REST API, External Profile Fetching

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas account (or local MongoDB)

### 1. Clone & Install Dependencies

**Install frontend dependencies:**
```bash
cd client
npm install
```

**Install backend dependencies:**
```bash
cd ../server
npm install
```

### 2. Environment Setup

Create a `.env` file in the `server/` directory and add the following keys (see `server/.env.example` for details):
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/portforge
JWT_SECRET=your_jwt_secret_here
GEMINI_API_KEY=your_gemini_api_key_here
CLERK_ISSUER=https://your-instance.clerk.accounts.dev
GITHUB_TOKEN=your_github_token_here
```

### 3. Run the Application

You will need two terminal windows to run both the frontend and backend simultaneously.

**Terminal 1 (Backend):**
```bash
cd server
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd client
npm run dev
```

## 🧠 How the AI Scoring Works

When you sync your GitHub account, Port-Forge fetches your repository `README.md` files and sends them to Gemini AI. The AI evaluates the repository based on:
1. Length and detail heuristics.
2. Presence of core documentation (Features, Installation, Usage).
3. Inclusion of screenshots or media.

Projects are then given a combined score out of 100 (factoring in GitHub stats and the AI rating) and sorted automatically so your absolute best work appears first!

## 📄 License

MIT
