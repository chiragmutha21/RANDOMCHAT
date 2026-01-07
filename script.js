console.log("Frontend JS file loaded ✔🔥");

// Global variables (original)
let currentUser = null;
let currentRoom = null;
let messages = [];
let users = JSON.parse(localStorage.getItem('users')) || [];
let rooms = JSON.parse(localStorage.getItem('rooms')) || [];

// Coins initialize (original + safety)
if (!localStorage.getItem('coins')) {
  localStorage.setItem('coins', "0");
}

// Save data util (original)
function saveData() {
  localStorage.setItem('users', JSON.stringify(users));
  localStorage.setItem('rooms', JSON.stringify(rooms));
}

// Get current user (original)
function getCurrentUser() {
  const userId = localStorage.getItem('currentUserId');
  return users.find(u => u.id === userId);
}

// Set current user (original)
function setCurrentUser(user) {
  currentUser = user;
  localStorage.setItem('currentUserId', user.id);
}

// Generate ID util (kept original, but single declaration)
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Create user (original)
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

// Login (original)
function loginUser(username, password) {
  const user = users.find(u => u.username === username && u.password === password);
  if (user) {
    setCurrentUser(user);
    localStorage.setItem("coins", "100");
    return true;
  }
  return false;
}

// Skip login (original)
function skipLoginUser() {
  currentUser = { id: generateId(), username: "Guest", points: 0, karma: 0, tier: "Bronze", anonymous: true };
  localStorage.setItem('currentUserId', currentUser.id);
  localStorage.setItem("coins", "0");
  return true;
}

// Send message + FRONTEND ECHO FIX (ADDED PART)
function sendMessage(roomId, userId, content) {
  const room = rooms.find(r => r.id === roomId);
  if (room) {
    const message = {
      id: generateId(),
      userId,
      content,
      timestamp: new Date().toISOString()
    };
    room.messages.push(message);

    // ⭐ FRONTEND ECHO REPLY (same text return)
    setTimeout(() => {
      appendMessageUI("Echo Reply 🤖", content);
    }, 700);

    saveData();
    return message;
  }
  return null;
}

// UI append message (original, name adjusted for reuse)
function appendMessageUI(sender, text) {
  const box = document.getElementById("messages");
  if (!box) {
    console.error("Message box not found ❌");
    return;
  }
  const div = document.createElement("div");
  div.className = "message " + (sender.includes("Echo") ? "bot" : "user");
  div.textContent = sender + ": " + text;
  box.appendChild(div);
  box.scrollTop = box.scrollHeight;
}

// Chat send listener (frontend echo proof)
document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("input");
  const sendBtn = document.getElementById("send");

  if (input && sendBtn) {
    sendBtn.addEventListener("click", () => {
      const msg = input.value.trim();
      if (!msg) return;

      appendMessageUI("You", msg);

      

      input.value = "";
    });
  }
});

// 🎨 THEME PICKER FIX (original logic rakha but undefined variable bug fix kiya)
document.addEventListener("DOMContentLoaded", () => {
  const themeButtons = document.querySelectorAll("#themePicker button");
  console.log("Theme buttons detected:", themeButtons.length);

  themeButtons.forEach(button => {
    button.addEventListener("click", () => {
      themeButtons.forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");

      document.body.classList.remove("theme-couples", "theme-kids", "theme-elders");

      const theme = button.getAttribute("data-theme");
      if (theme) document.body.classList.add(theme);
      localStorage.setItem("rc_theme", theme);

      console.log("Theme applied on body:", document.body.classList);
    });
  });

  const savedTheme = localStorage.getItem("rc_theme");
  if (savedTheme) {
    document.body.classList.add(savedTheme);
    console.log("Auto-loaded saved theme:", savedTheme);
  }
});
