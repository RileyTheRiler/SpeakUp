const heardWordEl = document.getElementById('heard-word');
const monster = document.getElementById('monster');

const foodElements = {
    'apple': document.getElementById('food-apple'),
    'lemon': document.getElementById('food-lemon'),
    'cookie': document.getElementById('food-cookie'),
    'carrot': document.getElementById('food-carrot')
};

function processSpeech(cleanWords, rawTranscript) {
    heardWordEl.textContent = cleanWords.join(' ');

    let fed = false;
    for (const [foodName, element] of Object.entries(foodElements)) {
        if (cleanWords.includes(foodName) && !element.classList.contains('eaten')) {
            // Animate food to center
            const mrct = monster.getBoundingClientRect();
            const frct = element.getBoundingClientRect();
            const dx = (mrct.left + mrct.width / 2) - (frct.left + frct.width / 2);
            const dy = (mrct.top + mrct.height / 2) - (frct.top + frct.height / 2);

            element.style.transform = `translate(${dx}px, ${dy}px) scale(0)`;
            element.classList.add('eaten');

            // Monster reaction
            setTimeout(() => {
                audioUtils.playCrunch();
                uiUtils.triggerAnimation(monster, 'anim-stretch', 500);
            }, 500);

            fed = true;
            break; // only feed one at a time
        }
    }

    if (fed) {
        ProgressionSystem.awardForGame('feeding', 1);
        heardWordEl.style.color = 'var(--primary)';
        setTimeout(() => { heardWordEl.style.color = 'var(--dark)'; }, 1000);
    }
}

// Initialize Game
GameController.init(processSpeech);

// Listen to mic-btn clicks to reset the eaten foods if starting a new listen session
document.getElementById('mic-btn').addEventListener('click', () => {
    // We already let GameController handle the real toggle, but we just want to reset UI locally
    if (GameController.isListening) {
        Object.values(foodElements).forEach(el => {
            el.style.transform = 'none';
            el.classList.remove('eaten');
        });
    }
});
