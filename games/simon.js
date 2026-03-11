const instructions = [
    { text: "Simon says touch your nose", target: "nose" },
    { text: "Simon says clap your hands", target: "clap" },
    { text: "Simon says touch your toes", target: "toes" },
    { text: "Simon says jump up high", target: "jump" },
    { text: "Simon says pat your head", target: "head" },
    { text: "Simon says rub your belly", target: "belly" },
    { text: "Simon says wiggle your fingers", target: "wiggle" },
    { text: "Simon says close your eyes", target: "eyes" },
    { text: "Simon says say hello", target: "hello" },
    { text: "Simon says wave goodbye", target: "wave" }
];

let currentInstruction = null;

const simonInstructionEl = document.getElementById('simon-instruction');
const targetWordEl = document.getElementById('target-word');
const heardWordEl = document.getElementById('heard-word');
const nextBtn = document.getElementById('next-btn');

function pickNewInstruction() {
    // Pick a random instruction that isn't the current one
    let newInstruction;
    do {
        newInstruction = instructions[Math.floor(Math.random() * instructions.length)];
    } while (currentInstruction && newInstruction.text === currentInstruction.text);

    currentInstruction = newInstruction;

    // Update UI
    simonInstructionEl.textContent = currentInstruction.text;
    targetWordEl.textContent = currentInstruction.target;
    heardWordEl.textContent = "...";

    // Animate
    uiUtils.triggerAnimation(simonInstructionEl, 'anim-stretch', 500);
}

function processSpeech(cleanWords, transcript) {
    if (!currentInstruction) return;

    // Display what was heard
    heardWordEl.textContent = transcript || "...";

    if (cleanWords.length === 0) return;

    // The logic here: we are practicing receptive language. The app says "Simon says touch your nose,"
    // the child touches their nose, and to register success, they must say the target keyword aloud.

    const isCorrect = cleanWords.includes(currentInstruction.target.toLowerCase());

    if (typeof SessionData !== 'undefined') {
        SessionData.logAttempt('simon', currentInstruction.target.toLowerCase(), transcript, isCorrect);
    }

    if (isCorrect) {
        ProgressionSystem.addStars(2); // Bonus stars for following directions
        audioUtils.playDing();
        uiUtils.triggerAnimation(simonInstructionEl, 'anim-hop', 600);

        // Visual feedback
        const originalText = simonInstructionEl.textContent;
        simonInstructionEl.textContent = "Great job!";
        simonInstructionEl.style.color = "#2ED573"; // Success green

        setTimeout(() => {
            simonInstructionEl.textContent = originalText;
            simonInstructionEl.style.color = ""; // Reset
            pickNewInstruction();
        }, 2000);
    } else {
        audioUtils.playBoing();
        uiUtils.triggerAnimation(simonInstructionEl, 'anim-shake', 500);
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    GameController.init(processSpeech);

    nextBtn.addEventListener('click', pickNewInstruction);

    // Start with the first one
    pickNewInstruction();
});
