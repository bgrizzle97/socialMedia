# Socially - Modern Social Platform

A modern social platform built with React (frontend) and Node.js/Express/MongoDB (backend). Features include:

- User authentication (sign up, login, JWT-based)
- Global user state with React Context (profile and avatar always up-to-date)
- Post status updates with text, images, or videos
- Drag-and-drop and file picker for attachments
- Video theatre mode for immersive playback
- Responsive, modern UI with Tailwind CSS

## Features

- **Authentication:** Secure registration and login with JWT
- **Feed:** See all posts from all users, including images and videos
- **Create Post:** Share text, images, or videos with drag-and-drop or file picker
- **Theatre Mode:** Click the play overlay on a video to view it in a fullscreen modal
- **UI:** Beautiful, responsive design with Tailwind CSS
- **Password Reset:** Full password reset flow (request link, set new password)
- **Profile Picture Sync:** Profile pictures update everywhere instantly after profile changes (using React Context)

## Getting Started

### Prerequisites
- Node.js (v16+ recommended)
- MongoDB (local or Atlas)

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
- Register a new account or log in
- Create posts with text, images, or videos
- Drag and drop files or use the attach button
- Click the play overlay on videos to enter theatre mode
- Log out or navigate with the custom modal

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