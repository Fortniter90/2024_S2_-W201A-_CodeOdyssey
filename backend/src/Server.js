import express from "express";
import { Server } from "socket.io";
import http from "http";
import { handleCodeSubmission } from "./controller/Compiler.js"; // Import the function to handle code submissions

const app = express(); // Initialize an Express application
const server = http.createServer(app); // Create an HTTP server using the Express app

// Initialize a Socket.IO server instance, allowing real-time communication
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Allow the frontend to connect from this origin
    methods: ["GET", "POST"], // Accept only GET and POST requests from the client
    allowedHeaders: ["Content-Type"], // Allow only requests with this header
    credentials: true // Include credentials (cookies, authorization headers, etc.)
  }
});

// Event listener for new socket connections
io.on("connection", (socket) => {
  console.log("A user connected"); // Log when a user connects

  // Listen for the "submitCode" event, which sends code from the client to the server
  socket.on("submitCode", async (data) => {
    await handleCodeSubmission(data, socket); // Call the function to handle code execution, passing data and the socket
  });

  // Listen for the "disconnect" event when the user disconnects
  socket.on("disconnect", () => {
    console.log("User disconnected"); // Log when a user disconnects
  });
});

// Start the server, listening on port 8080
server.listen(8080, () => {
  console.log("Server running on port 8080"); // Log when the server is up and running
});

