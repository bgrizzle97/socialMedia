# Socially - Modern Social Platform

A modern social platform built with React (frontend) and Node.js/Express/MongoDB (backend). Features include:

- User authentication (sign up, login, JWT-based)
- Social login: Google, GitHub, Discord (secure OAuth with JWT handoff)
- Global user state with Redux Toolkit (profile and avatar always up-to-date)
- Post status updates with text, images, or videos
- Drag-and-drop and file picker for attachments
- Video theatre mode for immersive playback
- Responsive, modern UI with Tailwind CSS
- **AI Agent Experiment:** Try agent-to-agent tasks, including OpenAI integration (bring your own API key)
- **Profile Settings:** Update avatar, manage posts, and connect socials
- **Delete Posts:** Remove your posts with a confirmation modal

## Features

- **Authentication:** Secure registration, login, and social login (Google, GitHub, Discord)
- **Feed:** See all posts from all users, including images and videos
- **Create Post:** Share text, images, or videos with drag-and-drop or file picker
- **Theatre Mode:** Click the play overlay on a video to view it in a fullscreen modal
- **AI Agent Experiment:** Test agent-to-agent tasks, including OpenAI (ChatGPT) integration
- **Profile Settings:** Update your avatar, change info, manage posts, and connect socials
- **Delete Posts:** Delete your posts with a modern confirmation popup
- **UI:** Beautiful, responsive design with Tailwind CSS and glassmorphism
- **Password Reset:** Full password reset flow (request link, set new password)
- **Redux State Management:** User state is managed globally with Redux Toolkit for scalability and maintainability

## Getting Started

### Prerequisites
- Node.js (v16+ recommended)
- MongoDB (local or Atlas)
- (Optional) Google, GitHub, Discord OAuth credentials for social login

### Setup

#### 1. Clone the repository
```bash
git clone <your-repo-url>
cd svelte
```

#### 2. Install dependencies
```bash
# Frontend
yarn install # or npm install

# Backend
cd backend
yarn install # or npm install
cd ..
```

#### 3. Configure environment variables
Create a `.env` file in the `backend/` directory:
```
MONGODB_URI=mongodb://localhost:27017/social-media-app
JWT_SECRET=your-secret-key
SESSION_SECRET=your-session-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
DISCORD_CLIENT_ID=your-discord-client-id
DISCORD_CLIENT_SECRET=your-discord-client-secret
FRONTEND_URL=http://localhost:5173
```

#### 4. Start the backend
```bash
cd backend
node server.js
```

#### 5. Start the frontend
```bash
cd ..
yarn dev # or npm run dev
```

#### 6. Open in your browser
Go to [http://localhost:5173](http://localhost:5173) (or the port shown in your terminal)

## Usage
- Register a new account, log in, or use social login
- Create posts with text, images, or videos
- Drag and drop files or use the attach button
- Click the play overlay on videos to enter theatre mode
- Try the AI Agent Experiment tab for agent-to-agent and OpenAI tasks
- Go to Profile Settings to update your avatar, manage posts, and connect socials
- Delete your posts with a confirmation modal

## Folder Structure
```
svelte/
  backend/         # Express/MongoDB backend
    models/
    routes/
    server.js
  src/             # React frontend
    components/
    App.jsx
    Dashboard.jsx
    ...
```

## License
MIT

---

### Share & Connect
Share your project and join the conversation on Discord! 