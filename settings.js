document.addEventListener('DOMContentLoaded', () => {
    const soundToggle = document.getElementById('sound-toggle');
    const resetStarsBtn = document.getElementById('reset-stars-btn');

    // Load initial state
    const soundMuted = localStorage.getItem('speakup_muted') === 'true';
    soundToggle.checked = !soundMuted;

    soundToggle.addEventListener('change', (e) => {
        localStorage.setItem('speakup_muted', !e.target.checked);
        // Note: Full audio muting would require modifying `utils.js` to check this flag 
        // before playing sound. We will do that via a multi_replace in utils.js shortly.
    });

    resetStarsBtn.addEventListener('click', () => {
        if (confirm("Are you sure you want to reset all collected stars? This cannot be undone.")) {
            localStorage.setItem('speakup_stars', 0);
            ProgressionSystem.updateUI(); // If the UI is showing here
            alert("Stars have been reset to 0.");
        }
    });

    // --- SLP Target Settings ---
    const targetCheckboxes = document.querySelectorAll('.target-checkbox');
    const loadTargets = () => {
        let savedCategories = null;
        try {
            savedCategories = JSON.parse(localStorage.getItem('speakup_target_categories'));
        } catch (e) { }

        if (savedCategories && Array.isArray(savedCategories)) {
            targetCheckboxes.forEach(cb => {
                cb.checked = savedCategories.includes(cb.value);
            });
        }
    };

    const saveTargets = () => {
        const selected = Array.from(targetCheckboxes).filter(cb => cb.checked).map(cb => cb.value);
        localStorage.setItem('speakup_target_categories', JSON.stringify(selected));

        let words = [];
        selected.forEach(cat => {
            if (SpeechTargets.categories[cat]) {
                words = words.concat(SpeechTargets.categories[cat]);
            }
        });

        SpeechTargets.setActiveTargets(words);
    };

    targetCheckboxes.forEach(cb => cb.addEventListener('change', saveTargets));
    loadTargets();

    // --- Clinical Dashboard ---
    const updateDashboard = () => {
        const data = SessionData.get();
        document.getElementById('dashboard-attempts').textContent = data.attempts;
        document.getElementById('dashboard-successes').textContent = data.successes;
        const accuracy = data.attempts > 0 ? Math.round((data.successes / data.attempts) * 100) : 0;
        document.getElementById('dashboard-accuracy').textContent = accuracy + '%';
    };

    updateDashboard();

    const exportBtn = document.getElementById('export-csv-btn');
    if (exportBtn) {
        exportBtn.addEventListener('click', () => {
            const data = SessionData.get();
            if (data.logs.length === 0) {
                alert("No practice data to export yet.");
                return;
            }

            let csvContent = "data:text/csv;charset=utf-8,";
            csvContent += "Timestamp,Game,Target Word,Recognized Transcript,Success\n";

            data.logs.forEach(log => {
                const row = [
                    new Date(log.timestamp).toLocaleString().replace(',', ''),
                    log.game,
                    log.target,
                    log.transcript,
                    log.success ? "Yes" : "No"
                ].join(",");
                csvContent += row + "\n";
            });

            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", `speakup_clinical_data_${new Date().toISOString().split('T')[0]}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    }
});
