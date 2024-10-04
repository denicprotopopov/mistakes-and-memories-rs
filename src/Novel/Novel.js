
import { getSceneOne, getSceneTwo, getSceneArmory, getSceneCity } from "../script";

let $textbox, $textboxContent, $optionsbox, $namebox;
let json, to;
let pageNum = 0;
let currentPage = null;
let isTyping = false;
let fullText = '';
let hasOptions = false;

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
            case "One":
                getSceneOne();
                break;
            case "Two":
                getSceneTwo();
                break;
            case "Armory":
                getSceneArmory();
                break;
            case "City":
                getSceneCity();
                break;
            case "Empty":
                getEmptyScene();
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
const novel = './novel/Novel.json'
initializeNovel("#textbox", '#optionsbox', "#namebox span", novel);
