# NexCall

NexCall is a lightweight video-conferencing web app built with React (frontend), Node.js + Express (backend), Socket.IO for signaling, and WebRTC for peer-to-peer media. It supports guest join, chat, screen sharing and a simple meeting history.

---

## Table of Contents

-   [Demo / Features](#demo--features)
-   [Tech Stack](#tech-stack)
-   [Project structure](#project-structure)
-   [Prerequisites](#prerequisites)
-   [Local setup (Windows)](#local-setup-windows)
    -   [Backend (dev)](#backend-dev)
    -   [Frontend (dev)](#frontend-dev)
-   [Environment / config](#environment--config)
-   [Build & Deploy (Render)](#build--deploy-render)
    -   [Static site on Render (frontend)](#static-site-on-render-frontend)
    -   [Backend service on Render](#backend-service-on-render)
-   [Socket.IO & WebRTC notes](#socketio--webrtc-notes)
-   [Troubleshooting — common issues & fixes](#troubleshooting—common-issues--fixes)
-   [Contributing](#contributing)

---

## Demo / Features

-   Create / join meetings via short URL
-   Guest join (enter a name and enable camera)
-   Real-time video/audio using WebRTC
-   Signaling + messaging via Socket.IO
-   Simple meeting history per user
-   Responsive layout for mobile / desktop

---

## Tech stack

-   Frontend: React, React Router, Material UI
-   Backend: Node.js, Express, MongoDB (mongoose)
-   Realtime: socket.io (server + client)
-   Peer: WebRTC (getUserMedia, RTCPeerConnection)
-   Deployment examples: Render, ngrok for local HTTPS testing

---

## Project structure (high-level)

c:\Users\ASUS\OneDrive\Desktop\NexCall

-   backend/ — Express API, socket manager, MongoDB
-   frontend/ — React app, pages (landing, authentication, videoMeet, history), styles
-   README.md

---

## Prerequisites

-   Node.js (v16+ recommended) and npm
-   MongoDB URI (Atlas or local)
-   Windows: PowerShell or cmd for commands

---

## Local setup (Windows)

Open two terminals: one for backend and one for frontend.

### Backend (dev)

1. Open backend folder:
    ```
    cd c:\Users\ASUS\OneDrive\Desktop\NexCall\backend
    ```
2. Install deps:
    ```
    npm install
    ```
3. Create `.env` (example below) and then run:
    ```
    npm run dev
    ```
    or
    ```
    nodemon src/app.js
    ```

### Frontend (dev)

1. Open frontend folder:
    ```
    cd c:\Users\ASUS\OneDrive\Desktop\NexCall\frontend
    ```
2. Install deps:
    ```
    npm install
    ```
3. Start dev server:
    ```
    npm start
    ```
4. Open browser: `http://localhost:3000`

---

## Environment / config

Example backend `.env` (backend/.env):

```
PORT=8000
MONGODB_URI=your_mongo_connection_string
JWT_SECRET=some_secret
```

Example frontend environment (frontend/src/environment.js or .env):

-   If you use a small file like `environment.js` export a constant:

```js
export const server = "http://localhost:8000"; // or https://your-backend.example.com
```

-   Or use `.env` and reference process.env in build time (CRA requires `REACT_APP_*`):

```
REACT_APP_BACKEND_URL=http://localhost:8000
```

Important:

-   For WebRTC getUserMedia to work on mobile/secure contexts, use HTTPS (ngrok or deploy to HTTPS host).

---

## Build & Deploy (Render)

### Static site on Render (frontend)

-   Build locally or let Render build: `npm run build`
-   Deploy `frontend` as a Static Site.
-   Important: add a Rewrite rule so client-side routing works:
    -   Source: `/*`
    -   Destination: `/index.html`
    -   Status: `200`
        This ensures refresh on deep routes does not 404.

### Backend service on Render

-   Deploy `backend` as a Web Service.
-   Configure environment variables on Render (MONGODB_URI, PORT, JWT_SECRET).
-   If frontend is served by backend, serve `frontend/build` from backend (see notes below).

Serving frontend from backend (optional)

-   Build frontend and put `frontend/build` in predictable location relative to backend.
-   In `backend/src/app.js` (Express) add:

```js
import path from "path";
app.use(express.static(path.join(__dirname, "../frontend/build")));
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/build/index.html"));
});
```

Place this after your API routes so API calls are not caught by the wildcard.

---

## Socket.IO & WebRTC notes

-   Signaling server (Socket.IO) runs on backend; frontend must connect to the correct URL:
    ```js
    import { io } from "socket.io-client";
    const socket = io("https://your-backend.example.com"); // production
    ```
-   WebRTC restrictions:
    -   getUserMedia and getDisplayMedia generally require secure context (HTTPS) on mobile and many browsers.
    -   Use ngrok during development to get https tunneling:
        ```
        npm i -g ngrok
        ngrok http 3000
        ```
-   STUN/TURN:
    -   A public STUN server is included (Google STUN). For reliable connectivity across networks you may need a TURN server.

---

## Troubleshooting — common issues & fixes

-   White screen on localhost:

    -   Check browser console for React errors.
    -   Common: wrong import path or case mismatch (Windows vs tooling). Ensure import matches filename exactly (case sensitive in many toolchains).
    -   Check dev server logs and restart dev server.

-   "Cannot read properties of null (reading 'username')":

    -   Validate `req.body` on server; ensure `express.json()` is enabled and body contains expected fields.
    -   Add defensive checks before accessing nested properties.

-   404 on refresh (Render):

    -   Add rewrite `/* -> /index.html` (Status 200) for static site or configure backend to serve index.html.

-   Socket messages not logged:

    -   Ensure backend `connectToSocket(server)` is called with the created HTTP server and server is listening.
    -   Make sure frontend `io()` connects to correct backend URL and CORS is allowed in Socket.IO server.

-   getUserMedia undefined on mobile:

    -   Ensure browser supports getUserMedia (modern Chrome or Safari).
    -   Serve over HTTPS (ngrok / production).
    -   Add feature detection before calling:
        ```js
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            // handle unsupported
        }
        ```

-   Video elements overflowing on mobile:

    -   Use CSS `object-fit: cover; width:100%; height:100%; max-width` and responsive containers (`aspect-ratio:16/9`) to prevent overflow.

-   CSS / images not loading:
    -   For assets in `public`, reference them as `/AssetName.png` (do not use `/public/AssetName.png`).

---

## Recommended fixes you might need while developing

-   If you rename filenames (VideoMeet.jsx vs videoMeet.jsx) and tooling still errors: stop the dev server, clear caches, or rename to a different temporary name then back.
-   If socket server crashes on disconnect with a ReferenceError, inspect the disconnect handler for undefined variables (e.g., using `key` without declaration). Remove or declare variables properly.

---

## File naming & conventions

-   Keep component filenames and imports exact in case (some bundlers enforce case sensitivity).
-   Group CSS in `src/styles` — prefer module CSS for page-specific styles (e.g., `videoComponent.module.css`).

---

## Contributing

1. Fork the repo
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Commit changes: `git commit -m "feat: add ..."`
4. Push and open a PR

Please add tests or manual verification steps for features that affect WebRTC or socket logic.
