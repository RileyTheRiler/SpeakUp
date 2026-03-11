const heardWordEl = document.getElementById('heard-word');

const drum = document.getElementById('inst-drum');
const bell = document.getElementById('inst-bell');
const guitar = document.getElementById('inst-guitar');
const trumpet = document.getElementById('inst-trumpet');
const keyboard = document.getElementById('inst-keyboard');

function processSpeech(cleanWords, rawTranscript) {
    heardWordEl.textContent = cleanWords.join(' ');
    let matched = false;

    if (cleanWords.includes('drum') || cleanWords.includes('bang') || cleanWords.includes('boom')) {
        uiUtils.triggerAnimation(drum, 'anim-shake', 500);
        audioUtils.playRoar(); // deep bass sound
        matched = true;
    }
    else if (cleanWords.includes('bell') || cleanWords.includes('ding') || cleanWords.includes('ring')) {
        uiUtils.triggerAnimation(bell, 'anim-wiggle', 500);
        audioUtils.playSparkle(); // bright sound
        matched = true;
    }
    else if (cleanWords.includes('guitar') || cleanWords.includes('strum') || cleanWords.includes('twang')) {
        uiUtils.triggerAnimation(guitar, 'anim-stretch', 500);
        audioUtils.playBoing(); // twangy sound
        matched = true;
    }
    else if (cleanWords.includes('trumpet') || cleanWords.includes('toot') || cleanWords.includes('horn')) {
        uiUtils.triggerAnimation(trumpet, 'anim-slither', 800);
        audioUtils.playBuzz(); // brassy sound
        matched = true;
    }
    else if (cleanWords.includes('keyboard') || cleanWords.includes('piano') || cleanWords.includes('type')) {
        uiUtils.triggerAnimation(keyboard, 'anim-vibrate', 400);
        audioUtils.playDing(); // plinky sound
        matched = true;
    }

    if (matched) {
        ProgressionSystem.addStars(1);
        heardWordEl.style.color = 'var(--primary)';
        setTimeout(() => { heardWordEl.style.color = 'var(--dark)'; }, 1000);
    }
}

// Initialize Game
GameController.init(processSpeech);
