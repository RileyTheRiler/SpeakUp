// Shared Audio Context
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

// Shared Audio Synthesizers
const audioUtils = {
    isMuted: () => localStorage.getItem('speakup_muted') === 'true',

    playDing: () => {
        if (audioUtils.isMuted()) return;
        if (audioCtx.state === 'suspended') audioCtx.resume();
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.1);
        gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.5, audioCtx.currentTime + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.3);
    },

    playBuzz: () => {
        if (audioUtils.isMuted()) return;
        if (audioCtx.state === 'suspended') audioCtx.resume();
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(100, audioCtx.currentTime);
        const lfo = audioCtx.createOscillator();
        lfo.type = 'sine';
        lfo.frequency.value = 20;
        const lfoGain = audioCtx.createGain();
        lfoGain.gain.value = 10;
        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency);
        lfo.start();
        gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.3, audioCtx.currentTime + 0.1);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 1.0);
        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 1.0);
        lfo.stop(audioCtx.currentTime + 1.0);
    },

    playBoing: () => {
        if (audioUtils.isMuted()) return;
        if (audioCtx.state === 'suspended') audioCtx.resume();
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(300, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 0.3);
        gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.6, audioCtx.currentTime + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.4);
    },

    playHiss: () => {
        if (audioUtils.isMuted()) return;
        if (audioCtx.state === 'suspended') audioCtx.resume();
        const bufferSize = audioCtx.sampleRate * 2;
        const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
        const noise = audioCtx.createBufferSource();
        noise.buffer = buffer;
        const filter = audioCtx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.value = 4000;
        const gainNode = audioCtx.createGain();
        gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.5, audioCtx.currentTime + 0.1);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 1.5);
        noise.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        noise.start();
        noise.stop(audioCtx.currentTime + 1.5);
    },

    playRoar: () => {
        if (audioUtils.isMuted()) return;
        if (audioCtx.state === 'suspended') audioCtx.resume();
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(50, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(20, audioCtx.currentTime + 1.0);
        const filter = audioCtx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800, audioCtx.currentTime);
        filter.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 1.0);
        gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.8, audioCtx.currentTime + 0.1);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 1.2);
        osc.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 1.2);
    },

    playMeow: () => {
        if (audioUtils.isMuted()) return;
        if (audioCtx.state === 'suspended') audioCtx.resume();
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(600, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 0.2);
        osc.frequency.exponentialRampToValueAtTime(400, audioCtx.currentTime + 0.8);
        gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.4, audioCtx.currentTime + 0.2);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.8);
        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.8);
    },

    playPurr: () => {
        if (audioUtils.isMuted()) return;
        if (audioCtx.state === 'suspended') audioCtx.resume();
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(30, audioCtx.currentTime);
        const lfo = audioCtx.createOscillator();
        lfo.type = 'sine';
        lfo.frequency.value = 25;
        const lfoGain = audioCtx.createGain();
        lfoGain.gain.value = 50;
        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency);
        lfo.start();
        gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.3, audioCtx.currentTime + 0.1);
        gainNode.gain.linearRampToValueAtTime(0.3, audioCtx.currentTime + 2.0);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 2.5);
        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 2.5);
        lfo.stop(audioCtx.currentTime + 2.5);
    },

    playBark: () => {
        if (audioUtils.isMuted()) return;
        if (audioCtx.state === 'suspended') audioCtx.resume();
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(300, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.1);
        const filter = audioCtx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 1000;
        gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.8, audioCtx.currentTime + 0.02);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
        osc.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.2);
    },

    playSparkle: () => {
        if (audioUtils.isMuted()) return;
        if (audioCtx.state === 'suspended') audioCtx.resume();
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1200, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(2000, audioCtx.currentTime + 0.2);
        osc.frequency.exponentialRampToValueAtTime(1000, audioCtx.currentTime + 0.4);
        gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.3, audioCtx.currentTime + 0.1);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.4);
    },

    playCrunch: () => {
        if (audioUtils.isMuted()) return;
        if (audioCtx.state === 'suspended') audioCtx.resume();
        const bufferSize = audioCtx.sampleRate * 0.5;
        const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (audioCtx.sampleRate * 0.1));
        const noise = audioCtx.createBufferSource();
        noise.buffer = buffer;
        const filter = audioCtx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 2000;
        const gainNode = audioCtx.createGain();
        gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.6, audioCtx.currentTime + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
        noise.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        noise.start();
        noise.stop(audioCtx.currentTime + 0.5);
    }
};

// Shared Speech Setup function
const speechUtils = {
    setupRecognition: (onResultCallback, onStartCallback, onEndCallback, onErrorCallback) => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert("Sorry, your browser doesn't support the Web Speech API. Please try Chrome or Edge.");
            return null;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = localStorage.getItem('speakup_recognition_lang') || 'en-US';

        if (onStartCallback) recognition.onstart = onStartCallback;
        if (onEndCallback) recognition.onend = onEndCallback;
        if (onErrorCallback) recognition.onerror = onErrorCallback;

        recognition.onresult = function (event) {
            const results = event.results;
            const latestResult = results[results.length - 1];
            const transcript = latestResult[0].transcript.trim().toLowerCase();
            const cleanWords = transcript.split(/\s+/).map(w => w.replace(/[^a-z]/gi, ''));
            onResultCallback(cleanWords, transcript);
        };

        return recognition;
    }
};

// Utility to apply animations and auto-remove them
const uiUtils = {
    triggerAnimation: (element, animClass, durationMs) => {
        if (!element) return;
        element.classList.remove('anim-wiggle', 'anim-buzz_fly', 'anim-hop', 'anim-slither', 'anim-shake', 'anim-vibrate', 'anim-stretch', 'anim-run');
        void element.offsetWidth; // Force reflow
        element.classList.add(animClass);
        setTimeout(() => {
            element.classList.remove(animClass);
        }, durationMs);
    },

    applyThemeToDocument: () => {
        const theme = localStorage.getItem('speakup_active_theme') || 'default';
        document.body.className = theme === 'default' ? '' : theme;
    },

    notify: (message, variant = 'info') => {
        const existing = document.getElementById('speakup-toast');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.id = 'speakup-toast';
        toast.className = `speakup-toast speakup-toast--${variant}`;
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => toast.classList.add('visible'), 10);
        setTimeout(() => {
            toast.classList.remove('visible');
            setTimeout(() => toast.remove(), 250);
        }, 3000);
    }
};

// Initialize theme on page load
uiUtils.applyThemeToDocument();

/* =========================================================================
   Phase 3: Gamification & Architecture Upgrades
   ========================================================================= */

// Speech Targets & Categories
const SpeechTargets = {
    categories: {
        core: ['go', 'stop', 'more', 'help', 'yes', 'no', 'up', 'down'],
        bilabials: ['pig', 'bear', 'mouse', 'boy', 'pie', 'ball', 'map', 'tub'],
        early_sounds: ['dog', 'cat', 'sun', 'nose', 'toe', 'hat', 'run', 'sit'],
        default: ['apple', 'car', 'blue', 'happy', 'sad', 'big', 'small', 'fast']
    },

    getActiveTargets: () => {
        try {
            const saved = localStorage.getItem('speakup_targets');
            if (saved) {
                const parsed = JSON.parse(saved);
                if (parsed.length > 0) return parsed;
            }
        } catch (e) { }
        return [...SpeechTargets.categories.default];
    },

    setActiveTargets: (targetArray) => {
        localStorage.setItem('speakup_targets', JSON.stringify(targetArray));
    },

    resolveForGame: (gameDefaults) => {
        const active = SpeechTargets.getActiveTargets();
        if (!Array.isArray(active) || active.length === 0) return gameDefaults;
        return gameDefaults.map(item => {
            if (!item || typeof item === 'string') return item;
            if (item.target && active.includes(item.target)) {
                return { ...item, priority: 'high' };
            }
            return item;
        });
    }
};

// SLP Session Data Tracker
const SessionData = {
    init: () => {
        if (!localStorage.getItem('speakup_session')) {
            SessionData.clear();
        }
    },

    clear: () => {
        localStorage.setItem('speakup_session', JSON.stringify({
            attempts: 0,
            successes: 0,
            logs: []
        }));
    },

    get: () => {
        try {
            return JSON.parse(localStorage.getItem('speakup_session')) || { attempts: 0, successes: 0, logs: [] };
        } catch (e) {
            return { attempts: 0, successes: 0, logs: [] };
        }
    },

    logAttempt: (game, targetWord, recognizedTranscript, success) => {
        const data = SessionData.get();
        data.attempts++;
        if (success) data.successes++;

        data.logs.push({
            timestamp: new Date().toISOString(),
            game: game,
            target: targetWord,
            transcript: recognizedTranscript,
            success: success
        });

        localStorage.setItem('speakup_session', JSON.stringify(data));
    }
};

// Initialize SessionData
SessionData.init();

// Progression System (Star Bank)
const ProgressionSystem = {
    getStars: () => {
        return parseInt(localStorage.getItem('speakup_stars')) || 0;
    },

    addStars: (amount) => {
        const current = ProgressionSystem.getStars();
        const newTotal = current + amount;
        localStorage.setItem('speakup_stars', newTotal);
        ProgressionSystem.updateUI();

        // Play celebratory sound if we just earned a star
        if (amount > 0) {
            audioUtils.playDing();
        }
    },

    awardForGame: (gameKey, baseAmount = 1) => {
        const now = Date.now();
        let state = {};
        try {
            state = JSON.parse(localStorage.getItem('speakup_reward_state') || '{}');
        } catch (e) { }

        const gameState = state[gameKey] || { streak: 0, lastWinTs: 0 };
        const rapidRepeat = now - gameState.lastWinTs < 10000;
        gameState.streak = rapidRepeat ? gameState.streak + 1 : 1;
        gameState.lastWinTs = now;

        let finalAmount = baseAmount;
        if (gameState.streak >= 5) {
            finalAmount = 0;
            uiUtils.notify('Keep going! More stars unlock after a short break.', 'info');
        } else if (gameState.streak >= 3) {
            finalAmount = Math.max(1, Math.floor(baseAmount / 2));
        }

        state[gameKey] = gameState;
        localStorage.setItem('speakup_reward_state', JSON.stringify(state));

        if (finalAmount > 0) ProgressionSystem.addStars(finalAmount);
        return finalAmount;
    },

    updateUI: () => {
        const starCountEl = document.getElementById('star-count');
        if (starCountEl) {
            starCountEl.textContent = ProgressionSystem.getStars();
            // Trigger a little pop animation on the star container
            uiUtils.triggerAnimation(starCountEl.parentElement, 'anim-hop', 500);
        }
    },

    // Inject the Star Bank UI into the header area automatically
    injectUI: () => {
        const header = document.querySelector('header');
        if (!header) return;

        // Don't inject twice
        if (document.getElementById('star-bank')) return;

        const starBank = document.createElement('div');
        starBank.id = 'star-bank';
        starBank.className = 'star-bank';
        starBank.innerHTML = `
            <i class="fa-solid fa-star" style="color: #f1c40f;"></i>
            <span id="star-count">${ProgressionSystem.getStars()}</span>
        `;

        header.appendChild(starBank);
    }
};

// Global Game Controller (Centralized Speech State)
const GameController = {
    isListening: false,
    recognition: null,
    processSpeechCallback: null,

    init: (processCallback) => {
        GameController.processSpeechCallback = processCallback;

        // Setup UI Injection
        ProgressionSystem.injectUI();

        const micBtn = document.getElementById('mic-btn');
        if (micBtn) {
            micBtn.addEventListener('click', GameController.toggleListening);
        }
    },

    toggleListening: () => {
        const micBtn = document.getElementById('mic-btn');
        const micStatus = document.getElementById('mic-status');
        const heardWordEl = document.getElementById('heard-word');

        if (!GameController.recognition) {
            GameController.recognition = speechUtils.setupRecognition(
                GameController.processSpeechCallback,
                () => { // onStart
                    if (micStatus) micStatus.textContent = "Listening...";
                    if (micBtn) micBtn.classList.add('listening');
                    if (heardWordEl) heardWordEl.textContent = "...";
                },
                () => { // onEnd
                    if (GameController.isListening) {
                        try { GameController.recognition.start(); } catch (e) { }
                    } else {
                        if (micStatus) micStatus.textContent = "Tap to Start";
                        if (micBtn) micBtn.classList.remove('listening');
                    }
                },
                (event) => { // onError
                    if (event.error === 'not-allowed') {
                        GameController.isListening = false;
                        if (micStatus) micStatus.textContent = "Tap to Start";
                        if (micBtn) micBtn.classList.remove('listening');
                        uiUtils.notify("Microphone access was denied. Enable mic permission in browser settings.", 'warning');
                    }
                }
            );
        }

        if (!GameController.isListening) {
            if (audioCtx.state === 'suspended') audioCtx.resume();
            GameController.isListening = true;
            try { GameController.recognition.start(); } catch (e) { }
        } else {
            GameController.isListening = false;
            if (GameController.recognition) GameController.recognition.stop();
            if (micStatus) micStatus.textContent = "Stopped. Tap to Start";
            if (micBtn) micBtn.classList.remove('listening');
        }
    }
};

// Initialize progression UI styling dynamically if it hasn't been added yet
(function injectStarStyles() {
    if (document.getElementById('star-styles')) return;
    const style = document.createElement('style');
    style.id = 'star-styles';
    style.innerHTML = `
        .star-bank {
            position: absolute;
            top: 20px;
            right: 20px;
            background: rgba(255, 255, 255, 0.9);
            padding: 10px 20px;
            border-radius: 30px;
            font-family: 'Fredoka One', cursive;
            font-size: 1.5rem;
            color: var(--dark);
            display: flex;
            align-items: center;
            gap: 10px;
            box-shadow: 0 10px 20px rgba(0,0,0,0.1);
            border: 2px solid #f1c40f;
            z-index: 100;
        }
        header { position: relative; } /* Ensure header can contain absolute stars */

        .speakup-toast {
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%) translateY(20px);
            background: rgba(26, 26, 36, 0.95);
            color: #fff;
            padding: 12px 18px;
            border-radius: 12px;
            z-index: 9999;
            opacity: 0;
            transition: opacity 0.25s ease, transform 0.25s ease;
            font-weight: 700;
        }

        .speakup-toast.visible {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }

        .speakup-toast--warning {
            background: rgba(255, 71, 87, 0.95);
        }

        .speakup-toast--success {
            background: rgba(46, 213, 115, 0.95);
        }
    `;
    document.head.appendChild(style);
})();
