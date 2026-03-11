let currentHidingSpot = 'tree';

const heardWordEl = document.getElementById('heard-word');
const mouse = document.getElementById('mouse');

const groups = {
    'box': document.getElementById('grp-box'),
    'tree': document.getElementById('grp-tree'),
    'bed': document.getElementById('grp-bed'),
    'couch': document.getElementById('grp-couch'),
    'chair': document.getElementById('grp-chair')
};

// Start by hiding the mouse randomly
function hideMouse() {
    mouse.classList.remove('revealed');
    mouse.style.opacity = '0';

    setTimeout(() => {
        const spots = ['box', 'tree', 'bed', 'couch', 'chair'];
        currentHidingSpot = spots[Math.floor(Math.random() * spots.length)];

        // Move mouse behind the target
        const target = groups[currentHidingSpot];
        const sceneRect = document.getElementById('scene').getBoundingClientRect();
        const targetRect = target.getBoundingClientRect();

        // Position relative to scene
        const left = targetRect.left - sceneRect.left + (targetRect.width / 2) - 15;
        mouse.style.left = `${left}px`;
        mouse.style.bottom = '60px';
    }, 500);
}

function processSpeech(cleanWords, rawTranscript) {
    heardWordEl.textContent = cleanWords.join(' ');

    // Check if they said the right object
    if (cleanWords.includes(currentHidingSpot)) {
        // Did they use a preposition? Kids will probably just guess the noun but if they use 'under', 'on', 'behind' that's great
        mouse.style.opacity = '1';
        mouse.classList.add('revealed');
        audioUtils.playDing();

        heardWordEl.style.color = 'var(--secondary)';
        setTimeout(() => { heardWordEl.style.color = 'var(--dark)'; }, 1000);

        ProgressionSystem.addStars(1);

        // Hide again after 3 seconds
        setTimeout(hideMouse, 3000);
    } else if (cleanWords.includes('box') || cleanWords.includes('tree') || cleanWords.includes('bed') || cleanWords.includes('couch') || cleanWords.includes('chair')) {
        // Wrong guess
        audioUtils.playBoing();
        heardWordEl.style.color = 'var(--accent)';
        setTimeout(() => { heardWordEl.style.color = 'var(--dark)'; }, 1000);
    }
}

// Initial hide
hideMouse();

// Initialize Game
GameController.init(processSpeech);
