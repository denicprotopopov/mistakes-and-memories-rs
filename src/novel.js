import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, set, remove, onDisconnect } from 'firebase/database';
import * as Tone from 'tone';
import { getSceneOne, getSceneTwo, getSceneArmory, getSceneCity, getSceneMetro, getSceneTerrain, getSceneControlRoom, getSceneDog, getSceneDrone, getSceneBrownstone, getSceneTerrain2 } from "./script";

let $textbox, $textboxContent, $optionsbox, $namebox;
let json, to;
let pageNum = 0;
let currentPage = null;
let isTyping = false;
let fullText = '';
let hasOptions = false;

const firebaseConfig = {
  apiKey: "AIzaSyAHhZY2UBh7M1qEpwQ-dNFYfs8ltPvoxjk",
  authDomain: "mistakes-and-memories.firebaseapp.com",
  databaseURL: "https://mistakes-and-memories-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "mistakes-and-memories",
  storageBucket: "mistakes-and-memories.appspot.com",
  messagingSenderId: "976384581905",
  appId: "1:976384581905:web:c21d614849cc97ac95acb0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Firebase Realtime Database reference
const playersRef = ref(database, 'players');

// Function to add a new player
function addPlayer(playerId) {
  const playerRef = ref(database, 'players/' + playerId);
  set(playerRef, {
    joinedAt: Date.now()
  });

  // Ensure player is removed when they disconnect
  onDisconnect(playerRef).remove();
}

// Function to remove a player
function removePlayer(playerId) {
  remove(ref(database, 'players/' + playerId));
}

// Generate a unique player ID (for simplicity)
const playerId = 'player_' + Math.floor(Math.random() * 100000);

// Add player when they enter the game
addPlayer(playerId);

// Remove player when they leave the game
window.addEventListener('beforeunload', () => {
  removePlayer(playerId);
});

// Tone.js setup
let players = {};
const soundUrl = '/mm_voice.wav'; // replace with your actual sound file URL
const backgroundSoundUrl = '/mm_drone.wav'; // replace with your actual background sound file URL

// Setup background sound
let backgroundVolume = new Tone.Volume(-15).toDestination(); // Control background sound volume
async function setupBackgroundSound() {
  await Tone.start();
  const backgroundPlayer = new Tone.Player({
    url: backgroundSoundUrl,
    autostart: true,
    loop: true
  }).connect(backgroundVolume);
}
setupBackgroundSound();

async function setupPlayerSound() {
  await Tone.start();
  const player = new Tone.Player({
    url: soundUrl,
    autostart: false
  });
  player.loop = true;

  // Add spatial panner for rotation effect
  const panner = new Tone.Panner3D().toDestination();
  player.connect(panner);

  // Set random rotation for the panner
  const randomAzimuth = Math.random() * 360 - 180; // Random value between -180 and 180 degrees
  const randomElevation = Math.random() * 180 - 90; // Random value between -90 and 90 degrees
  panner.positionX.setValueAtTime(Math.cos(randomAzimuth * (Math.PI / 180)), Tone.now());
  panner.positionY.setValueAtTime(Math.sin(randomAzimuth * (Math.PI / 180)), Tone.now());
  panner.positionZ.setValueAtTime(Math.sin(randomElevation * (Math.PI / 180)), Tone.now());

  // Add pitch shift effect
  const pitchShift = new Tone.PitchShift({
    pitch: Math.floor(Math.random() * 25) - 12 // Random value between -12 and 12
  });
  player.connect(pitchShift);
  pitchShift.connect(panner);

  // Delay playback by 10 seconds using setTimeout
  setTimeout(() => {
    player.start();
  }, 10000);

  return player;
}

// Monitor the number of players and manage sounds accordingly
onValue(playersRef, async (snapshot) => {
  const playerData = snapshot.val();
  const playerCount = playerData ? Object.keys(playerData).length : 0;

  // Limit to a maximum of 20 sounds
  const activeCount = Math.min(playerCount, 20);

  // Add new players
  for (let i = 0; i < activeCount; i++) {
    if (!players[i]) {
      players[i] = await setupPlayerSound();
    }
  }

  // Remove extra players
  for (let i = activeCount; i < Object.keys(players).length; i++) {
    if (players[i]) {
      players[i].stop();
      delete players[i];
    }
  }
});

// Ensure Tone.js audio context is properly started after user interaction
document.body.addEventListener('click', async () => {
  if (Tone.context.state !== 'running') {
    await Tone.start();
    console.log('Audio context started');
  }
});

// Initialize the visual novel
async function initializeNovel(textboxSelector, optionsboxSelector, nameboxSelector, dataUrl) {
  $textbox = document.querySelector(textboxSelector);
  $textboxContent = $textbox.querySelector('p');
  $optionsbox = document.querySelector(optionsboxSelector);
  $namebox = document.querySelector(nameboxSelector);

  await grabData(dataUrl);
  attachEventListeners();
  updatePage();
}

// Fetch data from JSON file
async function grabData(dataUrl) {
  const resp = await fetch(dataUrl);
  json = await resp.json();
  currentPage = Object.keys(json.Scene1.PAGES)[pageNum];
}

// Update the page content
function updatePage() {
  clearContent();
  updateName();
  fullText = json.Scene1.PAGES[currentPage].PageText;
  typeWriter(fullText);
  handleOptions();
}

// Clear the content of textbox and namebox
function clearContent() {
  $namebox.innerText = '';
  $textboxContent.innerText = '';
}

// Update the character name
function updateName() {
  $namebox.innerText = json.Scene1.PAGES[currentPage].Character;
}

// Typewriter effect for text
function typeWriter(txt, i = 0) {
  isTyping = true;
  if (i === 0) {
    $textboxContent.innerHTML = '';
    clearTimeout(to);
  }
  const speed = 30;
  if (i < txt.length) {
    const c = txt.charAt(i) === ' ' ? '&nbsp;' : txt.charAt(i);
    $textboxContent.innerHTML += c;
    to = setTimeout(() => typeWriter(txt, i + 1), speed);
  } else {
    isTyping = false;
  }
}

// Skip typewriter effect
function skipTypewriter() {
  clearTimeout(to);
  $textboxContent.innerHTML = fullText;
  isTyping = false;
}

// Handle options display and selection
function handleOptions() {
  $optionsbox.innerHTML = "";
  const options = json.Scene1.PAGES[currentPage].Options;
  hasOptions = !!options;
  if (options) {
    Object.keys(options).forEach(k => {
      const row = document.createElement('div');
      row.innerHTML = k;
      row.addEventListener('click', (e) => {
        e.stopPropagation();
        selectOption(options[k]);
      });
      row.addEventListener('touchend', (e) => {
        e.preventDefault();
        e.stopPropagation();
        selectOption(options[k]);
      });
      $optionsbox.appendChild(row);
    });
  }
}

// Select an option and move to the next page
function selectOption(nextPage) {
  currentPage = nextPage;
  pageNum = Object.keys(json.Scene1.PAGES).indexOf(currentPage);
  updatePage();
}

// Check if the current page allows moving to the next
function checkPage() {
  const currentPageData = json.Scene1.PAGES[currentPage];
  if (currentPageData.Options) return false;
  if (currentPageData.NextPage === "End") return false;
  return true;
}

// Move to the next page
function nextPage() {
  if (!checkPage()) return;
  
  const currentPageData = json.Scene1.PAGES[currentPage];
  if (currentPageData.NextPage) {
    currentPage = currentPageData.NextPage;
  } else {
    pageNum++;
    currentPage = Object.keys(json.Scene1.PAGES)[pageNum];
  }

  updatePage();

  if (json.Scene1.PAGES[currentPage].hasOwnProperty('Back')) {
    switch (json.Scene1.PAGES[currentPage].Back) {
      case "Armory":
        getSceneArmory();
        break;
      case "City":
        getSceneCity();
        break;
      case "Metro":
        getSceneMetro();
        break;
      case "Terrain":
        getSceneTerrain();
        break;
      case "Terrain2":
        getSceneTerrain2();
        break;
      case "Control":
        getSceneControlRoom();
        break;
      case "Dog":
        getSceneDrone();
        break;
      case "Drone":
        getSceneDrone();
        break;
      case "Brownstone":
        getSceneBrownstone();
        break;
      case "Empty":
        getSceneOne();
        break;
      default:
        return;
    }
  } else return;
}

// Handle user interaction (click, tap, or key press)
function handleInteraction() {
  if (isTyping) {
    skipTypewriter();
  } else if (!hasOptions) {
    nextPage();
  }
}

// Attach event listeners
function attachEventListeners() {
  document.addEventListener('keydown', (e) => {
    if (e.code === "Enter") {
      handleInteraction();
    }
  });

  $textbox.addEventListener('touchend', (e) => {
    e.preventDefault();
    if (!hasOptions) {
      handleInteraction();
    }
  });

  $textbox.addEventListener('click', () => {
    if (!hasOptions) {
      handleInteraction();
    }
  });
}

// Usage
const novel = '/Novel.json';
initializeNovel("#textbox", '#optionsbox', "#namebox span", novel);