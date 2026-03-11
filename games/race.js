const micBtn = document.getElementById('mic-btn');
const resetBtn = document.getElementById('reset-btn');
const micStatus = document.getElementById('mic-status');
const car = document.getElementById('car');
const volFill = document.getElementById('volume-fill');

let isDriving = false;
let audioContext = null;
let analyser = null;
let dataArray = null;
let source = null;
let animationId = null;
let carPosition = 20;

async function startEngine() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        source = audioContext.createMediaStreamSource(stream);
        source.connect(analyser);
        dataArray = new Uint8Array(analyser.frequencyBinCount);

        isDriving = true;
        micStatus.textContent = "Driving...";
        micBtn.classList.add('listening');

        driveLoop();
    } catch (err) {
        alert("Microphone access denied or error occurred: " + err);
        micStatus.textContent = "Start Engine";
        micBtn.classList.remove('listening');
    }
}

function stopEngine() {
    isDriving = false;
    cancelAnimationFrame(animationId);
    if (audioContext) {
        audioContext.close();
        audioContext = null;
    }
    micStatus.textContent = "Start Engine";
    micBtn.classList.remove('listening');
    volFill.style.width = '0%';
}

function driveLoop() {
    if (!isDriving) return;

    analyser.getByteFrequencyData(dataArray);

    // Calculate average volume
    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) {
        sum += dataArray[i];
    }
    let average = sum / dataArray.length;

    // Update volume visual
    let volPercent = Math.min(100, Math.max(0, (average / 128) * 100)); // normalized roughly
    volFill.style.width = `${volPercent}%`;

    // Move car if volume is above threshold
    if (average > 10) {
        // Speed depends on volume
        let speed = average / 20;
        carPosition += speed;

        // Stop at finish line
        const trackWidth = document.getElementById('track').clientWidth;
        if (carPosition > trackWidth - 100) {
            carPosition = trackWidth - 100;
            if (isDriving) {
                // play cheering sound or ding
                // Since we didn't include utils.js to avoid mic conflicts, we do inline ding
                const context = new (window.AudioContext || window.webkitAudioContext)();
                if (context.state === 'suspended') context.resume();
                const osc = context.createOscillator();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(800, context.currentTime);
                osc.frequency.exponentialRampToValueAtTime(1200, context.currentTime + 0.1);
                osc.connect(context.destination);
                osc.start();
                osc.stop(context.currentTime + 0.3);

                stopEngine();
                micStatus.textContent = "Finished!";

                // Add a star for finishing the race
                if (typeof ProgressionSystem !== 'undefined') {
                    ProgressionSystem.addStars(1);
                }
            }
        }

        car.style.left = `${carPosition}px`;
    }

    animationId = requestAnimationFrame(driveLoop);
}

micBtn.addEventListener('click', () => {
    if (!isDriving) {
        startEngine();
    } else {
        stopEngine();
    }
});

resetBtn.addEventListener('click', () => {
    carPosition = 20;
    car.style.left = '20px';
    micStatus.textContent = "Start Engine";
    if (!isDriving) {
        volFill.style.width = '0%';
    }
});

// Since race.html doesn't use utils.js natively for recognition, we inject the Progression tracker manually
if (typeof ProgressionSystem !== 'undefined') {
    ProgressionSystem.injectUI();
}
