// State
let selectedImage = 'house';
let isColored = false;

// DOM
const btns = document.querySelectorAll('.char-btn');
const canvasImg = document.getElementById('coloring-canvas');
const heardWordEl = document.getElementById('heard-word');

// Data 
const colorMap = {
    'house': { target: ['blue', 'house'], coloredSrc: '../assets/house_blue.png', outlineSrc: '../assets/house_outline.png' },
    'car': { target: ['red', 'car'], coloredSrc: '../assets/car_red.png', outlineSrc: '../assets/car_outline.png' },
    'tree': { target: ['green', 'tree'], coloredSrc: '../assets/tree_green.png', outlineSrc: '../assets/tree_outline.png' }
};

// Logic
function processSpeech(cleanWords, rawTranscript) {
    heardWordEl.textContent = cleanWords.join(' ');

    // Check for eraser commands
    if (isColored && (cleanWords.includes('erase') || cleanWords.includes('clear') || cleanWords.includes('undo'))) {
        audioUtils.playBoing(); // playful removal sound
        canvasImg.style.transform = 'scale(0.9) rotate(-5deg)';
        canvasImg.style.opacity = '0';

        setTimeout(() => {
            canvasImg.src = colorMap[selectedImage].outlineSrc;
            canvasImg.style.opacity = '1';
            canvasImg.style.transform = 'scale(1) rotate(0deg)';
        }, 300);

        heardWordEl.style.color = 'var(--accent)';
        isColored = false;
        return;
    }

    if (isColored) return; // already painted

    const targetWords = colorMap[selectedImage].target;

    // Check if the user said the exact color-object combo
    let hasColor = cleanWords.includes(targetWords[0]);
    let hasObject = cleanWords.includes(targetWords[1]);

    if (hasColor && hasObject) {
        // SUCCESS
        audioUtils.playSparkle();
        canvasImg.style.transform = 'scale(1.1) rotate(5deg)';
        canvasImg.style.opacity = '0';

        setTimeout(() => {
            canvasImg.src = colorMap[selectedImage].coloredSrc;
            canvasImg.style.opacity = '1';
            canvasImg.style.transform = 'scale(1) rotate(0deg)';
        }, 500);

        heardWordEl.style.color = 'var(--primary)';
        isColored = true;
        ProgressionSystem.addStars(1);
    }
}

// Sub events
btns.forEach(btn => {
    btn.addEventListener('click', () => {
        btns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        selectedImage = btn.dataset.img;
        isColored = false;

        // reset canvas
        canvasImg.style.opacity = '0';
        setTimeout(() => {
            canvasImg.src = colorMap[selectedImage].outlineSrc;
            canvasImg.style.opacity = '1';
        }, 300);

        audioUtils.playDing();
    });
});

// Initialize Game
GameController.init(processSpeech);
