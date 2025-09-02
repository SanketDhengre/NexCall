import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";

import mongoose from "mongoose";
import { connectToSocket } from "./controllers/socketManager.js";

import cors from "cors";
import path from "path"; // Import path module
import userRoutes from "./routes/users.routes.js";

const app = express();
const server = createServer(app);
const io = connectToSocket(server);

app.set("port", process.env.PORT || 8000);
app.use(cors());
app.use(express.json({ limit: "40kb" }));
app.use(express.urlencoded({ extended: true, limit: "40kb" }));

// API routes
app.use("/api/v1/users", userRoutes);

// Serve static files from the React app's build folder
const __dirname = path.resolve(); // Get the current directory
app.use(express.static(path.join(__dirname, "../frontend/build")));

// Catch-all route to serve React's index.html for non-API routes
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/build", "index.html"));
});

const start = async () => {
    const connectionDb = await mongoose.connect(
        "mongodb+srv://dhengresanket:Pqy2HserYVjpbdUh@cluster0.hy2e8eu.mongodb.net/"
    );

    console.log(`Connected to MongoDB: ${connectionDb.connection.host}`);

    server.listen(app.get("port"), () => {
        console.log("Server is running on port 8000");
    });
};

start();
