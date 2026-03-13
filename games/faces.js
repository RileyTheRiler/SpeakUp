// State
let currentEmotion = 'neutral';
let promptMode = false;
let targetPrompt = null;
const emotions = ['happy', 'sad', 'angry', 'neutral'];

// DOM
const canvasImg = document.getElementById('robot-canvas');
const heardWordEl = document.getElementById('heard-word');
const promptToggle = document.getElementById('prompt-mode-toggle');
const promptContainer = document.getElementById('prompt-container');
const targetEmotionEl = document.getElementById('target-emotion');

function setNextPrompt() {
    targetPrompt = emotions[Math.floor(Math.random() * emotions.length)];
    targetEmotionEl.textContent = targetPrompt;
    canvasImg.src = '../assets/robot_neutral.png'; // Reset face
}

if (promptToggle) {
    promptToggle.addEventListener('change', (e) => {
        promptMode = e.target.checked;
        if (promptMode) {
            promptContainer.style.display = 'block';
            setNextPrompt();
        } else {
            promptContainer.style.display = 'none';
            targetPrompt = null;
            canvasImg.src = '../assets/robot_neutral.png';
        }
    });
}

// Logic
function processSpeech(cleanWords, rawTranscript) {
    heardWordEl.textContent = cleanWords.join(' ');

    let matched = false;
    let detectedEmotion = null;

    if (cleanWords.includes('happy') || cleanWords.includes('glad')) {
        detectedEmotion = 'happy';
        canvasImg.src = '../assets/robot_happy.png';
        uiUtils.triggerAnimation(canvasImg, 'anim-hop', 600);
        audioUtils.playDing();
    } else if (cleanWords.includes('sad') || cleanWords.includes('crying')) {
        detectedEmotion = 'sad';
        canvasImg.src = '../assets/robot_sad.png';
        uiUtils.triggerAnimation(canvasImg, 'anim-stretch', 1200);
        audioUtils.playBoing();
    } else if (cleanWords.includes('angry') || cleanWords.includes('mad')) {
        detectedEmotion = 'angry';
        canvasImg.src = '../assets/robot_angry.png';
        uiUtils.triggerAnimation(canvasImg, 'anim-shake', 1000);
        audioUtils.playBuzz();
    } else if (cleanWords.includes('neutral') || cleanWords.includes('calm')) {
        detectedEmotion = 'neutral';
        canvasImg.src = '../assets/robot_neutral.png';
        uiUtils.triggerAnimation(canvasImg, 'anim-wiggle', 500);
        audioUtils.playDing();
    }

    // Determine scoring based on mode
    if (detectedEmotion) {
        currentEmotion = detectedEmotion;
        if (!promptMode || (promptMode && detectedEmotion === targetPrompt)) {
            matched = true;
        } else if (promptMode && detectedEmotion !== targetPrompt) {
            // Wrong face for the prompt
            audioUtils.playBoing();
            uiUtils.triggerAnimation(canvasImg, 'anim-shake', 500);
        }
    }

    if (matched) {
        ProgressionSystem.addStars(promptMode ? 2 : 1); // Bonus stars for prompt mode
        heardWordEl.style.color = 'var(--primary)';
        setTimeout(() => { heardWordEl.style.color = 'var(--dark)'; }, 1000);

        if (promptMode) {
            // Give them a moment to see their success, then next prompt
            setTimeout(() => {
                setNextPrompt();
            }, 2500);
        } else {
            // Return to neutral after 5 seconds in free play
            setTimeout(() => {
                canvasImg.src = '../assets/robot_neutral.png';
            }, 5000);
        }
    }
}

// Initialize Game
GameController.init(processSpeech);
