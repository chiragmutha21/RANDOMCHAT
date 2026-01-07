console.log("Frontend JS file loaded ✔🔥");

// Global variables (original, preserved)
let currentUser = null;
let currentRoom = null;
let messages = [];
let users = JSON.parse(localStorage.getItem('users')) || [];
let rooms = JSON.parse(localStorage.getItem('rooms')) || [];

// Coins initialize (original + safety, preserved)
if (!localStorage.getItem('coins')) {
  localStorage.setItem('coins', "0");
}

// Save data util (original, preserved)
function saveData() {
  localStorage.setItem('users', JSON.stringify(users));
  localStorage.setItem('rooms', JSON.stringify(rooms));
}

// Get current user (original, preserved)
function getCurrentUser() {
  const userId = localStorage.getItem('currentUserId');
  return users.find(u => u.id === userId);
}

// Set current user (original, preserved)
function setCurrentUser(user) {
  currentUser = user;
  localStorage.setItem('currentUserId', user.id);
}

// Generate ID util (original, preserved)
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Create user (original, preserved)
function createUser(username, password) {
  const user = {
    id: generateId(),
    username,
    password,
    points: 100,
    karma: 0,
    tier: 'Bronze',
    anonymous: false
  };
  users.push(user);
  saveData();
  return user;
}

// Login (original, preserved)
function loginUser(username, password) {
  const user = users.find(u => u.username === username && u.password === password);
  if (user) {
    setCurrentUser(user);
    localStorage.setItem("coins", "100");
    return true;
  }
  return false;
}

// Skip login (original, preserved)
function skipLoginUser() {
  currentUser = { id: generateId(), username: "Guest", points: 0, karma: 0, tier: "Bronze", anonymous: true };
  localStorage.setItem('currentUserId', currentUser.id);
  localStorage.setItem("coins", "0");
  return true;
}

// UI append message (original, preserved but alignment FIX ADDED ✔)
function appendMessageUI(sender, text) {
  const box = document.getElementById("messages");
  if (!box) {
    console.error("Message box not found ❌");
    return;
  }
  const div = document.createElement("div");

  // ⭐ Alignment Logic added (WP style)
  if (sender === "You") {
    div.className = "message user";  // Right side bubble
    div.style.alignSelf = "flex-end"; // force right
  } else {
    div.className = "message bot";   // Left side bubble
    div.style.alignSelf = "flex-start"; // force left
  }

  div.style.fontFamily = "inherit"; // font inherited from body ✔
  div.style.fontSize = "17px";      // font visible ✔
  div.textContent = sender + ": " + text;
  box.appendChild(div);
  box.scrollTop = box.scrollHeight;
}

// Socket connection initialize (original, preserved)
var socket = io("http://localhost:3000");

// Realtime chat receive logic (FIX ADDED, original echo removed ❌ duplicate echo)
socket.on("chat", (msg) => {
  appendMessageUI("Friend", msg);
});

// 💬 SEND MESSAGE FIX ADDED ✔ (THIS PART WAS MISSING IN YOUR ORIGINAL CODE)
document.addEventListener("DOMContentLoaded", () => {
  const msgInput = document.getElementById("input");
  const sendBtn  = document.getElementById("send");
  const msgBox   = document.getElementById("messages");

  if (sendBtn && msgInput && msgBox) {
    sendBtn.addEventListener("click", () => {
      const msg = msgInput.value.trim();
      if (!msg) return;

      appendMessageUI("You", msg);
      socket.emit("chat", msg);
      msgInput.value = "";
    });
  }
});

// 🎨 Theme picker logic (original, preserved)
document.addEventListener("DOMContentLoaded", () => {
  const themeButtons = document.querySelectorAll("#themePicker button");
  console.log("Theme buttons detected:", themeButtons.length);

  themeButtons.forEach(button => {
    button.addEventListener("click", () => {
      const theme = button.getAttribute("data-theme");
      themeButtons.forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");
      document.body.classList.remove("theme-couples", "theme-kids", "theme-elders");
      if (theme) document.body.classList.add(theme);
      localStorage.setItem("rc_theme", theme);
    });
  });

  const savedTheme = localStorage.getItem("rc_theme");
  if (savedTheme) document.body.classList.add(savedTheme);
});
