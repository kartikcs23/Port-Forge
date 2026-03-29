# PortForge 🔨

**Full-Stack MERN Portfolio Generator**

PortForge connects to a developer's GitHub and LinkedIn, pulls their projects, skills, experience, and profile data, then automatically generates a clean, shareable portfolio website.

## Stack

| Layer      | Technology                              |
| ---------- | --------------------------------------- |
| Frontend   | React (Vite) + Tailwind CSS             |
| Backend    | Node.js + Express.js                    |
| Database   | MongoDB + Mongoose                      |
| Auth       | JWT + bcryptjs + Passport.js (OAuth)    |
| HTTP       | Axios (client ↔ server ↔ external APIs) |

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas account (or local MongoDB)

### Server

```bash
cd server
cp .env.example .env   # fill in your values
npm install
npm run dev
```

### Client (coming in Phase 4)

```bash
cd client
npm install
npm run dev
```

## Environment Variables

Copy `.env.example` and fill in the values. See the file for all required variables.

## License

MIT
