// const express = require("express");
// const dbConnect = require("./database/index");
// const { PORT } = require("./config/index");
// const router = require("./routes/index");
// const errorHandler = require("./middleware/errorHandler");
// const cookieParser = require("cookie-parser");
// const cors = require("cors");
// const path = require("path");
// require("./schedular");

// const app = express();

// app.use(cookieParser());

// app.use(
//   cors({
//     origin: function (origin, callback) {
//       return callback(null, true);
//     },
//     optionsSuccessStatus: 200,
//     credentials: true,
//   })
// );

// app.use(express.json());
// app.use(express.static(path.join(__dirname, "public")));

// app.use(router);

// dbConnect();

// app.use("/storage", express.static("storage")); //for access the image in browser

// app.use(errorHandler);

// app.listen(PORT, console.log(`Backend is running on port:${PORT}`));

const express = require("express");
const http = require("http"); // For creating server
const { Server } = require("socket.io"); // Socket.IO server
const dbConnect = require("./database/index");
const { PORT } = require("./config/index");
const router = require("./routes/index");
const errorHandler = require("./middleware/errorHandler");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");
require("./schedular");
const registerSocketHandlers = require("./sockets");

const app = express();
const server = http.createServer(app); // Create HTTP server from Express

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: "*", // Adjust as needed for security
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Make io globally available (optional)
global.io = io;

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

app.use((req, res, next) => {
  req.io = io; // 👈 this adds the Socket.IO instance to every request
  next();
});

// Routes
app.use(router);

// Database connection
dbConnect();

// Error handler
app.use(errorHandler);

// Start server
server.listen(PORT, () =>
  console.log(`Backend is running with Socket.IO on port: ${PORT}`)
);
