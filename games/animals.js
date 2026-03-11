// State
let selectedAnimal = 'bee';

// DOM Elements
const charBtns = document.querySelectorAll('.char-btn');
const activeCharImg = document.getElementById('active-character');
const heardWordEl = document.getElementById('heard-word');

// Game Logic Controller
function processSpeech(cleanWords, rawTranscript) {
    console.log("Heard phrase:", rawTranscript);
    let matched = false;
    heardWordEl.textContent = cleanWords.join(' ');

    if (selectedAnimal === 'bee') {
        if (cleanWords.includes('buzz')) {
            uiUtils.triggerAnimation(activeCharImg, 'anim-buzz_fly', 1000);
            audioUtils.playBuzz();
            matched = true;
        } else if (cleanWords.includes('bee')) {
            uiUtils.triggerAnimation(activeCharImg, 'anim-wiggle', 500);
            audioUtils.playDing();
            matched = true;
        }
    } else if (selectedAnimal === 'bunny') {
        if (cleanWords.includes('hop')) {
            uiUtils.triggerAnimation(activeCharImg, 'anim-hop', 600);
            audioUtils.playBoing();
            matched = true;
        } else if (cleanWords.includes('bunny') || cleanWords.includes('rabbit')) {
            uiUtils.triggerAnimation(activeCharImg, 'anim-wiggle', 500);
            audioUtils.playDing();
            matched = true;
        }
    } else if (selectedAnimal === 'snake') {
        if (cleanWords.includes('hiss')) {
            uiUtils.triggerAnimation(activeCharImg, 'anim-slither', 1500);
            audioUtils.playHiss();
            matched = true;
        } else if (cleanWords.includes('snake')) {
            uiUtils.triggerAnimation(activeCharImg, 'anim-wiggle', 500);
            audioUtils.playDing();
            matched = true;
        }
    } else if (selectedAnimal === 'lion') {
        if (cleanWords.includes('roar')) {
            uiUtils.triggerAnimation(activeCharImg, 'anim-shake', 1000);
            audioUtils.playRoar();
            matched = true;
        } else if (cleanWords.includes('lion')) {
            uiUtils.triggerAnimation(activeCharImg, 'anim-wiggle', 500);
            audioUtils.playDing();
            matched = true;
        }
    } else if (selectedAnimal === 'kitten') {
        if (cleanWords.includes('meow')) {
            uiUtils.triggerAnimation(activeCharImg, 'anim-stretch', 1200);
            audioUtils.playMeow();
            matched = true;
        } else if (cleanWords.includes('purr')) {
            uiUtils.triggerAnimation(activeCharImg, 'anim-vibrate', 2500);
            audioUtils.playPurr();
            matched = true;
        } else if (cleanWords.includes('kitten') || cleanWords.includes('kitty') || cleanWords.includes('cat')) {
            uiUtils.triggerAnimation(activeCharImg, 'anim-wiggle', 500);
            audioUtils.playDing();
            matched = true;
        }
    } else if (selectedAnimal === 'dog') {
        if (cleanWords.includes('run')) {
            uiUtils.triggerAnimation(activeCharImg, 'anim-run', 2000);
            setTimeout(audioUtils.playBark, 0);
            setTimeout(audioUtils.playBark, 500);
            setTimeout(audioUtils.playBark, 1000);
            matched = true;
        } else if (cleanWords.includes('bark') || cleanWords.includes('woof')) {
            uiUtils.triggerAnimation(activeCharImg, 'anim-hop', 600);
            audioUtils.playBark();
            matched = true;
        } else if (cleanWords.includes('dog') || cleanWords.includes('puppy')) {
            uiUtils.triggerAnimation(activeCharImg, 'anim-wiggle', 500);
            audioUtils.playDing();
            matched = true;
        }
    }

    if (typeof SessionData !== 'undefined') {
        SessionData.logAttempt('animals', selectedAnimal, rawTranscript, matched);
    }

    if (matched) {
        ProgressionSystem.addStars(1);
        heardWordEl.style.color = 'var(--secondary)';
        setTimeout(() => { heardWordEl.style.color = 'var(--dark)'; }, 1000);
    }
}

// Event Listeners
charBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        charBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedAnimal = btn.dataset.char;
        activeCharImg.src = `../assets/${selectedAnimal}.png`;
        activeCharImg.alt = selectedAnimal;
        audioUtils.playDing();
        uiUtils.triggerAnimation(activeCharImg, 'anim-wiggle', 500);
    });
});

// Initialize Game
GameController.init(processSpeech);
