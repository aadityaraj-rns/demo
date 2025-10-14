// firedesk-backend/server.js
const express = require("express");
const http = require("http"); // For creating server
const { Server } = require("socket.io"); // Socket.IO server
const { dbConnect, sequelize } = require("./database/index"); // ADD sequelize import here
const { PORT } = require("./config/index");
const router = require("./routes/index");
const errorHandler = require("./middleware/errorHandler");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");
require("./schedular");
const registerSocketHandlers = require("./sockets");
const createDefaultRoles = require("./scripts/seedRoles"); // ADD this import

const app = express();
const server = http.createServer(app); // Create HTTP server from Express

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: "*", // TODO: restrict in production
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Make io globally available (optional)
global.io = io;

// Register Socket.IO handlers
registerSocketHandlers(io);

// Middleware setup
app.use(cookieParser());

app.use(
  cors({
    origin: function (origin, callback) {
      return callback(null, true);
    },
    optionsSuccessStatus: 200,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use("/storage", express.static("storage")); // Static file serving

// Attach io to requests
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Healthcheck endpoint for Docker
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'firedesk-backend' });
});

// Routes
app.use(router);

// Database connection and server start
const startServer = async () => {
  try {
    await dbConnect();
    
    // Create default roles after database connection
    await createDefaultRoles();
    
    // Error handler
    app.use(errorHandler);
    
    // Start server
    server.listen(PORT, () =>
      console.log(`🚀 Backend is running with Socket.IO on port: ${PORT}`)
    );
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();