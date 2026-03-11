const storyTemplates = [
    {
        parts: [
            { type: "subject", target: "dog", img: "../assets/dog.png" },
            { type: "action", target: "eats", img: "../assets/apple.png" }, // Reusing an asset conceptually
            { type: "object", target: "apple", img: "../assets/apple.png" }
        ]
    },
    {
        parts: [
            { type: "subject", target: "bunny", img: "../assets/bunny.png" },
            { type: "action", target: "paints", img: "../assets/brush.png" }, // Assuming a generic brush icon from fontawesome or similar
            { type: "object", target: "canvas", img: "../assets/canvas.png" } // Or just abstract it 
        ]
    },
    {
        parts: [
            { type: "subject", target: "lion", img: "../assets/lion.png" },
            { type: "action", target: "drives", img: "../assets/racecar.png" },
            { type: "object", target: "car", img: "../assets/racecar.png" }
        ]
    }
];

let currentStory = null;
let currentPartIndex = 0;

const storyParts = [
    { container: document.getElementById('part-1'), img: document.getElementById('img-1'), text: document.getElementById('text-1') },
    { container: document.getElementById('part-2'), img: document.getElementById('img-2'), text: document.getElementById('text-2') },
    { container: document.getElementById('part-3'), img: document.getElementById('img-3'), text: document.getElementById('text-3') }
];

const wordOptionsEl = document.getElementById('word-options');
const heardWordEl = document.getElementById('heard-word');
const nextBtn = document.getElementById('next-btn');
const fullSentenceEl = document.getElementById('full-sentence');

function initStory() {
    currentStory = storyTemplates[Math.floor(Math.random() * storyTemplates.length)];
    currentPartIndex = 0;

    // Reset UI
    storyParts.forEach((part, index) => {
        part.container.classList.remove('filled');
        part.img.src = "";

        switch (index) {
            case 0: part.text.textContent = "Who?"; break;
            case 1: part.text.textContent = "Doing What?"; break;
            case 2: part.text.textContent = "To/With What?"; break;
        }
    });

    heardWordEl.textContent = "...";
    fullSentenceEl.textContent = "";
    updateTargetHints();
}

function updateTargetHints() {
    if (currentPartIndex >= storyParts.length) {
        wordOptionsEl.innerHTML = "";
        return;
    }

    const currentTarget = currentStory.parts[currentPartIndex].target;

    // Add some random distractors
    const distractors = ["cat", "runs", "fast", "sleeps", "tree"].sort(() => 0.5 - Math.random()).slice(0, 2);
    const options = [currentTarget, ...distractors].sort(() => 0.5 - Math.random());

    wordOptionsEl.innerHTML = options.map(opt => `<span class="option-badge ${opt === currentTarget ? 'target' : ''}">"${opt}"</span>`).join('');
}


function processSpeech(cleanWords, transcript) {
    heardWordEl.textContent = transcript || "...";

    if (currentPartIndex >= storyParts.length || cleanWords.length === 0) return;

    const targetData = currentStory.parts[currentPartIndex];
    const isCorrect = cleanWords.includes(targetData.target.toLowerCase());

    if (isCorrect) {
        audioUtils.playSparkle(); // Pleasant success sound

        // Fill the box
        const uiPart = storyParts[currentPartIndex];
        uiPart.container.classList.add('filled');

        // Since we are reusing assets, fallback to text if image isn't perfect for the action, 
        // but try to load it anyway. 
        uiPart.img.src = targetData.img;
        uiPart.img.onerror = () => { uiPart.img.style.display = 'none'; }; // Hide broken images dynamically

        uiPart.text.textContent = targetData.target;

        uiUtils.triggerAnimation(uiPart.container, 'anim-hop', 600);

        currentPartIndex++;

        if (currentPartIndex >= storyParts.length) {
            // Story complete!
            ProgressionSystem.addStars(4); // Big reward for a phrase
            audioUtils.playDing();

            const sentence = currentStory.parts.map(p => p.target).join(" ");
            fullSentenceEl.textContent = `The ${currentStory.parts[0].target} ${currentStory.parts[1].target} the ${currentStory.parts[2].target}!`;
            uiUtils.triggerAnimation(fullSentenceEl, 'anim-stretch', 1000);
            wordOptionsEl.innerHTML = "<span class='option-badge' style='background: var(--primary); color: white;'>Story Complete!</span>";
        } else {
            updateTargetHints();
        }
    } else {
        audioUtils.playBoing();
        uiUtils.triggerAnimation(storyParts[currentPartIndex].container, 'anim-shake', 500);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    GameController.init(processSpeech);
    nextBtn.addEventListener('click', initStory);
    initStory();
});
