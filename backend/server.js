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

// ❗ Railway me Live URL na milne ka reason ye static HTML serving hai
// Isliye ise REMOVE nahi kar raha, bas comment kar raha hoon taaki Railway isko Web Service maan le
// Deploy ke baad agar HTML serve karna ho to wapas uncomment kar dena

/*
app.use(express.static(path.join(__dirname, "../"), { index: false }));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../login page.html"));
});
*/

app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Backend is live & healthy 🚀" });
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

  socket.on("chat", (msg) => {
    const username = users[socket.id] || "Guest";
    const finalMsg = `${username}: ${msg}`;
    console.log(finalMsg);
    io.to("main").emit("chat", finalMsg);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    delete users[socket.id];
  });
});

// ❗ Railway hard-coded port ignore karta hai, wo khud PORT assign karta hai
// Tumne 3000 fallback rakha hai — ye local testing ke liye sahi, deploy ke liye PORT env hi use hoga ✔
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server Running on ${PORT} ✔🔥`));

export default server;
