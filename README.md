Lumora is a beautifully designed, gamified learning platform that teaches **prompt engineering** and advanced AI interaction through an immersive fantasy-themed experience.

Users progress through four themed Realms, practice live prompting in **The Crucible**, receive AI-powered evaluation, consult a wise **Oracle** mentor, and build a personal **Codex** of their best work.

---

## ✨ Features

- **Four Progressive Realms**
  - **The Loom** — Tokenization, Zero-Shot & Few-Shot prompting
  - **The Thread** — Chain-of-Thought, Self-Consistency & Reasoning
  - **The Pattern** — Agents, ReAct, Tool Use & Prompt Chaining
  - **The Mirror** — Evaluation, Rubrics & LLM-as-a-Judge

- **The Crucible** — Live prompting environment with:
  - Streaming responses from Gemini
  - Adjustable parameters (Temperature, Top-P, Max Tokens)
  - **Echo Mode** (reveals model’s chain of thought)
  - Automatic multi-dimensional scoring

- **The Oracle** — An always-available Socratic AI mentor that gives challenges, explanations, and personalized feedback.

- **The Codex** — Personal archive to save, organize, annotate, and revisit your best prompts and outputs.

- **Progression System**
  - XP & Leveling
  - Realm completion tracking
  - Collectible **Relics** (achievements)

- **Elegant Dark Fantasy UI** with smooth animations and a cohesive mystical aesthetic.

---

## 🛠 Tech Stack

| Layer       | Technology                          |
|-------------|-------------------------------------|
| Frontend    | React 19 + TypeScript + Vite        |
| Styling     | Tailwind CSS + Custom Design System |
| Backend     | Express + Node.js                   |
| AI          | Google Gemini 2.5 Flash (`@google/genai`) |
| State       | Zustand + Local Persistence         |
| Routing     | React Router v7                     |
| Animation   | Framer Motion                       |

---

## 🚀 Getting Started

### Prerequisites

- Node.js ≥ 20
- A Gemini API key

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd lumora

# Install dependencies
npm install

# Create environment file
cp .env.example .env
Add your Gemini API key in .env:
envGEMINI_API_KEY=your_gemini_api_key_here
Development
Bashnpm run dev
The app will start at http://localhost:3000
Production Build
Bashnpm run build
npm start

📁 Project Structure
textlumora/
├── src/
│   ├── components/       # Reusable UI components (Button, Card, Oracle)
│   ├── pages/            # Landing, Hub, Realm, Crucible, Codex, Onboarding
│   ├── store.ts          # Zustand state management
│   ├── types.ts          # TypeScript interfaces
│   └── lib/              # Utilities
├── server.ts             # Express backend + Gemini API routes
├── vite.config.ts
├── package.json
└── README.md

🔌 API Endpoints
Method,Endpoint,Description
POST,/api/crucible,Stream prompt responses from Gemini
POST,/api/oracle,Get guidance from the Oracle mentor
POST,/api/evaluate,Score a prompt + output (LLM-as-Judge)

🎮 How to Use

Start at the Landing Page and complete the short onboarding.
Go to the Hub and explore the four Realms.
Enter a Realm to read the lore and objectives.
Click Begin Practice to enter The Crucible.
Write prompts, tweak parameters, and hit Weave Reality.
Review your scores and save strong attempts to the Codex.
Use the Oracle anytime for help or new challenges.
