// ==========================================
// CASE 404: MISSING TRUTH
// COMPLETE GAME JAVASCRIPT
// TIMELINE: JANUARY - JULY 10, 2026
// AUTOMATIC GAME OVER SYSTEM
// ==========================================


// ==========================================
// GAME DATA
// ==========================================

let investigator = "";
let score = 100;
let seconds = 0;
let timerInterval = null;
let timerRunning = false;
let hintCount = 0;
let unlocked = false;
let gameOver = false;
let gameOverTimeout = null;
let notificationTimeout = null;

let musicMuted = false;

const correctPassword = "0907";


// ==========================================
// BACKGROUND MUSIC LOOP & MUTE CONTROL
// ==========================================

function setupBackgroundMusic() {
    const audio = document.getElementById("bgMusic");
    if (!audio) return;

    audio.loop = true;
    audio.volume = 0.35;
    audio.muted = musicMuted;

    audio.addEventListener("ended", () => {
        if (!musicMuted) {
            audio.currentTime = 0;
            audio.play().catch(() => {});
        }
    });

    updateMusicButton();
}

function startBackgroundMusic() {
    const audio = document.getElementById("bgMusic");
    if (!audio) return;

    audio.loop = true;
    audio.volume = 0.35;
    audio.muted = musicMuted;

    if (!musicMuted && audio.paused) {
        audio.play().catch(() => {});
    }

    updateMusicButton();
}

function toggleMusic() {
    const audio = document.getElementById("bgMusic");
    if (!audio) return;

    musicMuted = !musicMuted;
    audio.loop = true;
    audio.volume = 0.35;
    audio.muted = musicMuted;

    if (!musicMuted) {
        audio.play().catch(() => {});
    }

    updateMusicButton();
    showNotification(musicMuted ? "Background music muted." : "Background music unmuted.");
}

function updateMusicButton() {
    const icon = document.getElementById("musicIcon");
    const label = document.getElementById("musicLabel");
    const btn = document.getElementById("musicToggleBtn");

    if (icon) {
        icon.textContent = musicMuted ? "🔇" : "🔊";
    }

    if (label) {
        label.textContent = musicMuted ? "MUSIC: MUTED" : "MUSIC: ON";
    }

    if (btn) {
        btn.classList.toggle("muted", musicMuted);
    }
}


// ==========================================
// SCREEN NAVIGATION
// ==========================================

function showScreen(screenId) {

    document.querySelectorAll(".screen").forEach(screen => {
        screen.classList.remove("active");
    });

    const target = document.getElementById(screenId);

    if (target) {
        target.classList.add("active");
    }

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


// ==========================================
// BACK BUTTON NAVIGATION
// ==========================================

function backToStart() {
    showScreen("startScreen");
}

function backToInstructions() {
    showScreen("instructionsScreen");
}

function backToRegistration() {
    showScreen("registrationScreen");
}

function backToBriefing() {
    showScreen("briefingScreen");
}

function backToMission() {
    showScreen("missionScreen");
}

function backToInvestigation() {

    if (gameOver) return;

    closeApp();
    showScreen("passwordScreen");

    showNotification("Returned to Password Investigation.");
}


// ==========================================
// INVESTIGATOR REGISTRATION
// ==========================================

function registerInvestigator() {

    if (gameOver) return;

    const nameInput = document.getElementById("investigatorName");
    const error = document.getElementById("registrationError");

    const name = nameInput.value.trim();

    if (name === "") {

        error.textContent = "Please enter your investigator name.";
        nameInput.focus();

        return;
    }

    investigator = name;
    error.textContent = "";

    showNotification(
        "Investigator identity confirmed: " + investigator
    );

    showScreen("briefingScreen");
}


// ==========================================
// TIMER SYSTEM
// ==========================================

function startInvestigation() {

    if (gameOver) return;

    startBackgroundMusic();

    if (!timerRunning && !unlocked) {

        if (timerInterval) {
            clearInterval(timerInterval);
        }

        seconds = 0;
        timerRunning = true;

        updateTimer();

        timerInterval = setInterval(() => {

            if (!timerRunning || gameOver) return;

            seconds++;
            updateTimer();

        }, 1000);

        showNotification("Investigation timer started.");
    }

    showScreen("passwordScreen");
}


function updateTimer() {

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    const formattedTime =
        String(minutes).padStart(2, "0") +
        ":" +
        String(remainingSeconds).padStart(2, "0");

    const timer = document.getElementById("timer");
    const desktopClock = document.getElementById("desktopClock");

    if (timer) {
        timer.textContent = formattedTime;
    }

    if (desktopClock) {
        desktopClock.textContent = formattedTime;
    }
}


function stopTimer() {

    timerRunning = false;

    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}


// ==========================================
// AUTOMATIC GAME OVER SYSTEM
// ==========================================

function triggerGameOver() {

    if (gameOver || score > 0) return;

    gameOver = true;
    score = 0;

    stopTimer();
    closeClue();
    closeApp();

    const notification = document.getElementById("notification");

    if (notification) {
        notification.classList.remove("show");
    }

    const currentScore = document.getElementById("currentScore");

    if (currentScore) {
        currentScore.textContent = "0";
    }

    const oldOverlay = document.getElementById("gameOverOverlay");

    if (oldOverlay) {
        oldOverlay.remove();
    }

    const overlay = document.createElement("div");

    overlay.id = "gameOverOverlay";

    overlay.innerHTML = `
        <div class="game-over-content">
            <p class="game-over-label">
                CASE 404 / INVESTIGATION TERMINATED
            </p>

            <h1>GAME OVER</h1>

            <p class="game-over-message">
                You have run out of investigation points.
            </p>

            <p class="game-over-subtitle">
                RETURNING TO INVESTIGATION GUIDELINES...
            </p>
        </div>
    `;

    document.body.appendChild(overlay);

    gameOverTimeout = setTimeout(() => {

        overlay.remove();

        resetAfterGameOver();

        showScreen("instructionsScreen");

    }, 3000);
}


// ==========================================
// RESET AFTER GAME OVER
// ==========================================

function resetAfterGameOver() {

    gameOver = false;

    investigator = "";
    score = 100;
    seconds = 0;
    hintCount = 0;
    unlocked = false;

    stopTimer();

    const investigatorName =
        document.getElementById("investigatorName");

    const registrationError =
        document.getElementById("registrationError");

    const passwordInput =
        document.getElementById("passwordInput");

    const passwordFeedback =
        document.getElementById("passwordFeedback");

    const currentScore =
        document.getElementById("currentScore");

    if (investigatorName) {
        investigatorName.value = "";
    }

    if (registrationError) {
        registrationError.textContent = "";
    }

    if (passwordInput) {
        passwordInput.value = "";
    }

    if (passwordFeedback) {
        passwordFeedback.textContent = "";
        passwordFeedback.style.color = "";
    }

    if (currentScore) {
        currentScore.textContent = "100";
    }

    updateTimer();

    closeClue();
    closeApp();

    const notification = document.getElementById("notification");

    if (notification) {
        notification.classList.remove("show");
    }

    clearTimeout(notificationTimeout);
}


// ==========================================
// PASSWORD CLUES
// ==========================================

const clues = [

    {
        title: "PERSONAL NOTE",

        text: `"July has become an important month to me. July 9 is a date I never want to forget. I wish I could go back to that day."`
    },

    {
        title: "CALENDAR ENTRY",

        text: `"JULY 9 — A day I will always remember. No matter what happens, this date will stay with me."`
    },

    {
        title: "OLD REMINDER",

        text: `"If I ever forget my computer password, remember this: Enter the day first, followed by the month. Four digits only."`
    },

    {
        title: "DESK STICKY NOTE",

        text: `"Format reminder: DDMM — day first, then month. Always keep leading zeros so it's four digits."`
    },

    {
        title: "TORN RECEIPT",

        text: `"09/07/2026 • 4:15 PM. Scrawled on the back: 'The day everything changed. Don't forget this date.'"`
    }

];


function openClue(index) {

    if (gameOver) return;

    const clue = clues[index];

    if (!clue) return;

    document.getElementById("clueTitle").textContent = clue.title;

    document.getElementById("clueText").textContent = clue.text;

    document.getElementById("clueModal").classList.add("show");
}


function closeClue() {

    const modal = document.getElementById("clueModal");

    if (modal) {
        modal.classList.remove("show");
    }
}


// ==========================================
// PASSWORD HINTS
// ==========================================

const hints = [

    "HINT 1: The password is connected to an important date in Elena's life.",

    "HINT 2: Look closely at the Personal Note and Calendar Entry.",

    "HINT 3: The password contains four digits. Enter the day first, followed by the month.",

    "HINT 4: The date is July 9. Remember the required order."

];


function useHint() {

    if (unlocked || gameOver) return;

    score = Math.max(0, score - 5);

    const currentScore = document.getElementById("currentScore");

    if (currentScore) {
        currentScore.textContent = score;
    }

    if (score <= 0) {
        triggerGameOver();
        return;
    }

    const hintIndex = Math.min(
        hintCount,
        hints.length - 1
    );

    showNotification(hints[hintIndex]);

    hintCount++;
}


// ==========================================
// CHECK COMPUTER PASSWORD
// ==========================================

function checkPassword() {

    if (gameOver) return;

    const input = document.getElementById("passwordInput");
    const feedback = document.getElementById("passwordFeedback");

    if (!input || !feedback) return;

    const enteredPassword = input.value.trim();

    if (unlocked) return;

    if (enteredPassword === "") {

        feedback.textContent = "Please enter a password.";
        input.focus();

        return;
    }

    if (
        enteredPassword.length !== 4 ||
        !/^\d{4}$/.test(enteredPassword)
    ) {

        feedback.textContent =
            "Password must contain exactly 4 digits.";

        input.value = "";
        input.focus();

        return;
    }


    // CORRECT PASSWORD

    if (enteredPassword === correctPassword) {

        unlocked = true;

        stopTimer();

        feedback.style.color = "#72b58b";

        feedback.textContent =
            "ACCESS GRANTED. COMPUTER UNLOCKED.";

        showNotification(
            "Password correct! Computer unlocked."
        );

        setTimeout(() => {

            if (gameOver) return;

            closeApp();

            showScreen("computerScreen");

            showNotification(
                "Welcome to Elena's personal computer."
            );

        }, 1000);

    }


    // INCORRECT PASSWORD

    else {

        score = Math.max(0, score - 10);

        const currentScore =
            document.getElementById("currentScore");

        if (currentScore) {
            currentScore.textContent = score;
        }

        feedback.style.color = "#e16c72";

        feedback.textContent =
            "ACCESS DENIED. Incorrect password. -10 POINTS.";

        input.value = "";

        if (score <= 0) {
            triggerGameOver();
            return;
        }

        input.focus();
    }
}


// ==========================================
// COMPUTER APPLICATIONS
// ==========================================

const appData = {

    // --------------------------------------
    // FILES
    // --------------------------------------

    files: {

        title: "MY FILES",

        content: `

            <h3>ELENA'S PERSONAL FILES</h3>

            <div class="app-item">
                📄 <strong>Personal Information.txt</strong>
                <small>Last modified: June 12, 2026</small>
                <p>A document containing Elena's personal details.</p>
            </div>

            <div class="app-item">
                📄 <strong>Journal Entry.doc</strong>
                <small>Last modified: July 9, 2026</small>
                <p>A personal journal entry saved one day before her death.</p>
            </div>

            <div class="app-item">
                📄 <strong>Important Documents.pdf</strong>
                <small>Last modified: June 28, 2026</small>
                <p>Some documents about an unknown individual.</p>
            </div>

            <div class="app-item">
                🔒 <strong>hidden_404.dat</strong>
                <small>FILE STATUS: RESTRICTED</small>
                <p>A suspicious file that may contain important information.</p>
            </div>

            <div class="app-notice">
                SYSTEM NOTE: Some files may contain important evidence.
            </div>

        `
    },


    // --------------------------------------
    // PHOTOS - 11 PERSONAL PHOTOS
    // --------------------------------------

    photos: {

        title: "PHOTO GALLERY",

        content: `

            <h3>ELENA'S PERSONAL PHOTOS</h3>

            <div class="photo-gallery">

                <div class="photo-item">
                    <img
                        src="assets/images/bedroom.png"
                        alt="Elena's bedroom"
                    >
                    <p class="photo-caption">MAY 6, 2026</p>
                </div>

                <div class="photo-item">
                    <img
                        src="assets/images/dog.png"
                        alt="Elena's dog"
                    >
                    <p class="photo-caption">JUNE 14, 2026</p>
                </div>

                <div class="photo-item">
                    <img
                        src="assets/images/elenapic.png"
                        alt="Elena's personal photo"
                    >
                    <p class="photo-caption">JUNE 22, 2026</p>
                </div>

                <div class="photo-item">
                    <img
                        src="assets/images/friends.png"
                        alt="Elena with her friends"
                    >
                    <p class="photo-caption">JUNE 30, 2026</p>
                </div>

                <div class="photo-item">
                    <img
                        src="assets/images/stalker.png"
                        alt="A suspicious figure"
                    >
                    <p class="photo-caption">JULY 1, 2026</p>
                </div>

                <!-- NOTE IMAGE -->

                <div class="photo-item">
                    <img
                        src="assets/images/note.png"
                        alt="A handwritten message"
                    >
                    <p class="photo-caption">JULY 1, 2026</p>
                </div>

                <div class="photo-item">
                    <img
                        src="assets/images/friends1.png"
                        alt="Elena with her friends"
                    >
                    <p class="photo-caption">JULY 5, 2026</p>
                </div>

                <div class="photo-item">
                    <img
                        src="assets/images/hallway.png"
                        alt="A dark hallway"
                    >
                    <p class="photo-caption">JULY 7, 2026</p>
                </div>

                <div class="photo-item">
                    <img
                        src="assets/images/guy.png"
                        alt="A mysterious man"
                    >
                    <p class="photo-caption">JULY 8, 2026</p>
                </div>

                <div class="photo-item">
                    <img
                        src="assets/images/photos.png"
                        alt="A personal photo"
                    >
                    <p class="photo-caption">JULY 9, 2026</p>
                </div>

                <div class="photo-item">
                    <img
                        src="assets/images/friends2.png"
                        alt="Elena with her friends"
                    >
                    <p class="photo-caption">JANUARY 7, 2026</p>
                </div>

            </div>

            <div class="app-notice">
                PHOTO ARCHIVE: JANUARY - JULY 2026.
                LAST PHOTO SAVED: JULY 9, 2026.
                BODY DISCOVERED: JULY 10, 2026.
            </div>

        `
    },


    // --------------------------------------
    // MESSAGES
    // --------------------------------------

    messages: {

        title: "MESSAGES",

        content: `

            <h3>PRIVATE CONVERSATIONS</h3>

            <div class="app-notice">
                WARNING: Some conversations contain disturbing messages.
                Sender identity could not be verified.
            </div>

            <div class="app-item">
                <strong>UNKNOWN NUMBER</strong>
                <small>July 7 • 8:41 PM</small>
                <p>
                    "You should stop asking questions, Elena.
                    Some things are better left buried.
                    You have no idea what you're getting yourself into."
                </p>
            </div>

            <div class="app-item">
                <strong>Elena</strong>
                <small>July 7 • 8:46 PM</small>
                <p>
                    "Who is this? How do you know what I've been doing?
                    I've already told you that I won't stay quiet.
                    People deserve to know the truth."
                </p>
            </div>

            <div class="app-item">
                <strong>UNKNOWN NUMBER</strong>
                <small>July 7 • 8:49 PM</small>
                <p>
                    "You really think someone will believe you?
                    I've been watching you for a long time.
                    I know where you go, who you meet,
                    and when you come home."
                </p>
            </div>

            <div class="app-item">
                <strong>Elena</strong>
                <small>July 8 • 10:12 PM</small>
                <p>
                    "I saw you again today.
                    You were standing across the street,
                    just watching me.
                    Why are you doing this? What do you want from me?"
                </p>
            </div>

            <div class="app-item">
                <strong>UNKNOWN NUMBER</strong>
                <small>July 8 • 10:19 PM</small>
                <p>
                    "You shouldn't have noticed me.
                    I warned you to forget what you found.
                    Delete the pictures, erase the files,
                    and pretend none of this ever happened."
                </p>
            </div>

            <div class="app-item">
                <strong>Elena</strong>
                <small>July 9 • 9:14 PM</small>
                <p>
                    "I know what happened.
                    I have the evidence, and I've made copies of everything.
                    You can't keep hiding the truth forever.
                    If anything happens to me, someone will find out."
                </p>
            </div>

            <div class="app-item">
                <strong>UNKNOWN NUMBER</strong>
                <small>July 9 • 9:18 PM</small>
                <p>
                    "You have no idea how much trouble you've caused.
                    I gave you enough chances to walk away.
                    This is your last opportunity to fix your mistake.
                    Delete everything. Now."
                </p>
            </div>

            <div class="app-item">
                <strong>Elena</strong>
                <small>July 9 • 11:36 PM</small>
                <p>
                    "I'm scared. I can hear someone outside my apartment.
                    I've checked the door twice, but there's nobody there.
                    I don't know if I'm imagining things anymore.
                    I just want this to end."
                </p>
            </div>

            <div class="app-item">
                <strong>UNKNOWN NUMBER</strong>
                <small>July 9 • 11:48 PM</small>
                <p>
                    "You should have listened.
                    Check your door, Elena.
                    You forgot to lock it."
                </p>
            </div>

            <div class="app-item">
                <strong>Elena</strong>
                <small>July 9 • 11:51 PM</small>
                <p>
                    "HOW DO YOU KNOW THAT?
                    Who are you?!
                    Please, just leave me alone.
                    I haven't told anyone where I live..."
                </p>
            </div>

            <div class="app-notice">
                SYSTEM WARNING: No further messages were recovered
                after July 9, 2026.
                The sender's identity remains unknown.
            </div>

        `
    },


    // --------------------------------------
    // NOTES
    // --------------------------------------

    notes: {

        title: "PERSONAL NOTES",

        content: `

            <h3>ELENA'S PRIVATE NOTES</h3>

            <div class="app-item">
                <strong>January 15, 2026</strong>
                <p>
                    Someone has been following me lately.
                    I don't know who I can trust anymore.
                </p>
            </div>

            <div class="app-item">
                <strong>May 12, 2026</strong>
                <p>
                    I found something that could change everything.
                    I need to keep it somewhere safe.
                </p>
            </div>

            <div class="app-item">
                <strong>July 9, 2026</strong>
                <p>
                    If something happens to me, I hope someone
                    finds the truth hidden in this computer.
                </p>
            </div>

            <div class="app-notice">
                PRIVATE NOTE: Last entry saved on July 9, 2026.
            </div>

        `
    },


    // --------------------------------------
    // BROWSER HISTORY
    // --------------------------------------

    history: {

        title: "BROWSER HISTORY",

        content: `

            <h3>RECENT SEARCH HISTORY</h3>

            <div class="app-item">
                🌐 <strong>How to recover deleted files</strong>
                <small>January 15 • 9:20 PM</small>
            </div>

            <div class="app-item">
                🌐 <strong>Unknown phone number lookup</strong>
                <small>March 3 • 7:45 PM</small>
            </div>

            <div class="app-item">
                🌐 <strong>How to protect private information</strong>
                <small>May 12 • 10:10 PM</small>
            </div>

            <div class="app-item">
                🌐 <strong>What to do if someone is threatening you</strong>
                <small>July 9 • 11:48 PM</small>
            </div>

            <div class="app-notice">
                BROWSER ACTIVITY: Several searches suggest that Elena
                may have been experiencing a serious problem and
                trying to protect herself from someone.
            </div>

        `
    }

};


// ==========================================
// OPEN COMPUTER APPLICATION
// ==========================================

function openApp(appName) {

    if (!unlocked || gameOver) return;

    const app = appData[appName];

    if (!app) return;

    const appTitle = document.getElementById("appTitle");
    const appContent = document.getElementById("appContent");
    const appWindow = document.getElementById("appWindow");

    if (!appTitle || !appContent || !appWindow) return;

    appTitle.textContent = app.title;
    appContent.innerHTML = app.content;

    appWindow.classList.add("show");

    showNotification(app.title + " opened.");
}


// ==========================================
// CLOSE COMPUTER APPLICATION
// ==========================================

function closeApp() {

    const appWindow = document.getElementById("appWindow");

    if (appWindow) {
        appWindow.classList.remove("show");
    }
}


// ==========================================
// NOTIFICATION SYSTEM
// ==========================================

function showNotification(message) {

    if (gameOver) return;

    const notification = document.getElementById("notification");

    if (!notification) return;

    notification.textContent = message;
    notification.classList.add("show");

    clearTimeout(notificationTimeout);

    notificationTimeout = setTimeout(() => {
        notification.classList.remove("show");
    }, 3000);
}


// ==========================================
// RETURN TO MAIN MENU
// ==========================================

function returnToMainMenu() {

    if (gameOver) return;

    const confirmReturn = confirm(
        "Are you sure you want to return to the Main Menu? Your current investigation progress will be reset."
    );

    if (!confirmReturn) return;

    stopTimer();

    investigator = "";
    score = 100;
    seconds = 0;
    hintCount = 0;
    unlocked = false;

    const currentScore =
        document.getElementById("currentScore");

    const passwordInput =
        document.getElementById("passwordInput");

    const passwordFeedback =
        document.getElementById("passwordFeedback");

    const investigatorName =
        document.getElementById("investigatorName");

    const registrationError =
        document.getElementById("registrationError");

    if (currentScore) {
        currentScore.textContent = score;
    }

    if (passwordInput) {
        passwordInput.value = "";
    }

    if (passwordFeedback) {
        passwordFeedback.textContent = "";
        passwordFeedback.style.color = "";
    }

    if (investigatorName) {
        investigatorName.value = "";
    }

    if (registrationError) {
        registrationError.textContent = "";
    }

    closeApp();
    closeClue();

    updateTimer();

    showScreen("startScreen");

    showNotification(
        "Returned to Main Menu. New investigation ready."
    );
}


// ==========================================
// KEYBOARD SHORTCUTS
// ==========================================

document.addEventListener("keydown", function(event) {

    if (gameOver) {
        event.preventDefault();
        return;
    }

    if (event.key === "Escape") {
        closeClue();
        closeApp();
    }

    if (
        event.key === "Enter" &&
        document.getElementById("passwordScreen")?.classList.contains("active") &&
        document.activeElement.id === "passwordInput"
    ) {
        checkPassword();
    }

});


// ==========================================
// INITIAL GAME DISPLAY
// ==========================================

document.addEventListener("DOMContentLoaded", function() {

    setupBackgroundMusic();

    const currentScore =
        document.getElementById("currentScore");

    if (currentScore) {
        currentScore.textContent = score;
    }

    updateTimer();

    showScreen("startScreen");

    console.log("CASE 404: MISSING TRUTH");
    console.log("Game initialized successfully.");

});
