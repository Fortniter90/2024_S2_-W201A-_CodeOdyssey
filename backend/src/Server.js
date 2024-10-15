import express from "express";
import { Server } from "socket.io";
import http from "http";
import { handleCodeSubmission } from "./controller/Compiler.js"; // Import the function to handle code submissions
import router from "./routes/AuthRoutes.js";
import cors from 'cors';
import fetchRouter from "./routes/DataFetchingRoutes.js";

const app = express(); // Initialize an Express application
const server = http.createServer(app); // Create an HTTP server using the Express app

// Allow JSON request bodies
app.use(express.json());

// CORS configuration
const corsOptions = {
  origin: 'http://localhost:3000', // Allow the frontend to connect from this origin
  methods: ['GET', 'POST'], // Accept only GET and POST requests from the client
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow only requests with this header
  credentials: true // Include credentials (cookies, authorization headers, etc.)
};

// Use CORS middleware
app.use(cors(corsOptions));

// Initialize a Socket.IO server instance
const io = new Server(server, {
  cors: corsOptions // Use the same CORS options for Socket.IO
});

// Event listener for new socket connections
io.on("connection", (socket) => {
  console.log("A user connected"); // Log when a user connects

  // Listen for the "submitCode" event
  socket.on("submitCode", async (data) => {
    await handleCodeSubmission(data, socket); // Call the function to handle code execution, passing data and the socket
  });

  // Listen for the "disconnect" event
  socket.on("disconnect", () => {
    console.log("User disconnected"); // Log when a user disconnects
  });
});

// Set up the authentication routes
app.use("/auth", router);

app.use("/", fetchRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start the server
server.listen(8080, () => {
  console.log("HTTP server running on port 8080"); // Log when the HTTP server is up and running
});

