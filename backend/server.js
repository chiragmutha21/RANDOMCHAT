import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.static(path.join(__dirname, "../"), { index: false }));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../login page.html"));
});

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// Demo users
const demoUsers = [
  { username: "chirag", password: "123456" },
  { username: "admin", password: "00000" }
];

const users = {};

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);
  socket.join("main");

  socket.on("joinRoom", (room) => {
    socket.join(room);
    io.to(room).emit("chat", "System: A user joined ✔");
  });

  socket.on("login_check", ({ username, password }) => {
    const found = demoUsers.find(u => u.username === username && u.password === password);
    if (found) {
      users[socket.id] = username;
      socket.emit("login_valid");
      io.to("main").emit("chat", `${username} joined 👋`);
    } else {
      socket.emit("login_invalid");
    }
  });

  // 💬 REALTIME CHAT BROADCAST
  socket.on("chat", (msg) => {
    const sender = socket.id === Object.keys(users).find(id => users[id] === "chirag") ? "You" : "user1";
    const finalMsg = sender + ": " + msg;
    console.log(finalMsg);
    io.to("main").emit("chat", finalMsg);
  });

  // ❗ disconnect listener ko ANDAR rakha, bahar nahi
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    delete users[socket.id];
  });

});

server.listen(3000, () => console.log("Server Running on 3000 ✔🔥"));

export default server;
import express from "express";
import path from "path";

const App = express();

// Static frontend serve karo
app.use(express.static(path.join(process.cwd(), "frontend")));

app.get("/", (req, res) => {
  res.sendFile(path.join(process.cwd(), "frontend", "index.html"));
});

app.listen(3000, () => console.log("Server running"));
