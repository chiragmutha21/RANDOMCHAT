console.log("Frontend JS file loaded ✔🔥");

// Global variables
let currentUser = null;
let currentRoom = null;
let messages = [];
let users = JSON.parse(localStorage.getItem('users')) || [];
let rooms = JSON.parse(localStorage.getItem('rooms')) || [];

// Coins initialize
if (!localStorage.getItem('coins')) {
  localStorage.setItem('coins', "0");
}

// Save data util
function saveData() {
  localStorage.setItem('users', JSON.stringify(users));
  localStorage.setItem('rooms', JSON.stringify(rooms));
}

// Get current user
function getCurrentUser() {
  const userId = localStorage.getItem('currentUserId');
  return users.find(u => u.id === userId);
}

// Set current user
function setCurrentUser(user) {
  currentUser = user;
  localStorage.setItem('currentUserId', user.id);
}

// Generate ID util
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Create user
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

// Login
function loginUser(username, password) {
  const user = users.find(u => u.username === username && u.password === password);
  if (user) {
    setCurrentUser(user);
    localStorage.setItem("coins", "100");
    return true;
  }
  return false;
}

// Skip login
function skipLoginUser() {
  currentUser = { id: generateId(), username: "Guest", points: 0, karma: 0, tier: "Bronze", anonymous: true };
  localStorage.setItem('currentUserId', currentUser.id);
  localStorage.setItem("coins", "0");
  return true;
}

// NOTE: UI Logic has been moved to index.html inline script to support the new Premium Layout.
// The old sendMessage and appendMessageUI functions were removed to prevent conflicts.

