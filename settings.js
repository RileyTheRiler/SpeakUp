document.addEventListener('DOMContentLoaded', () => {
    const soundToggle = document.getElementById('sound-toggle');
    const resetStarsBtn = document.getElementById('reset-stars-btn');
    const langSelect = document.getElementById('recognition-lang-select');

    // Load initial state
    const soundMuted = localStorage.getItem('speakup_muted') === 'true';
    soundToggle.checked = !soundMuted;

    soundToggle.addEventListener('change', (e) => {
        localStorage.setItem('speakup_muted', !e.target.checked);
    });

    if (langSelect) {
        langSelect.value = localStorage.getItem('speakup_recognition_lang') || 'en-US';
        langSelect.addEventListener('change', (e) => {
            localStorage.setItem('speakup_recognition_lang', e.target.value);
            if (typeof uiUtils !== 'undefined') {
                uiUtils.notify('Speech language updated. Restart mic in games to apply.', 'success');
            }
        });
    }

    resetStarsBtn.addEventListener('click', () => {
        if (confirm("Are you sure you want to reset all collected stars? This cannot be undone.")) {
            localStorage.setItem('speakup_stars', 0);
            ProgressionSystem.updateUI(); // If the UI is showing here
            if (typeof uiUtils !== 'undefined') {
                uiUtils.notify('Stars have been reset to 0.', 'success');
            }
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

        const today = new Date().toISOString().slice(0, 10);
        const todayAttempts = data.logs.filter(log => log.timestamp.startsWith(today)).length;
        document.getElementById('dashboard-today-attempts').textContent = todayAttempts;

        const byGame = data.logs.reduce((acc, log) => {
            acc[log.game] = (acc[log.game] || 0) + 1;
            return acc;
        }, {});
        const topGame = Object.entries(byGame).sort((a, b) => b[1] - a[1])[0];
        document.getElementById('dashboard-top-game').textContent = topGame ? topGame[0] : '-';
    };

    updateDashboard();

    const exportBtn = document.getElementById('export-csv-btn');
    if (exportBtn) {
        exportBtn.addEventListener('click', () => {
            const data = SessionData.get();
            if (data.logs.length === 0) {
                if (typeof uiUtils !== 'undefined') {
                    uiUtils.notify('No practice data to export yet.', 'warning');
                }
                return;
            }

            const csvEscape = (value) => {
                const normalized = String(value ?? '').replace(/"/g, '""');
                return `"${normalized}"`;
            };

            let csvContent = "data:text/csv;charset=utf-8,";
            csvContent += "Timestamp,Game,Target Word,Recognized Transcript,Success\n";

            data.logs.forEach(log => {
                const row = [
                    csvEscape(new Date(log.timestamp).toLocaleString()),
                    csvEscape(log.game),
                    csvEscape(log.target),
                    csvEscape(log.transcript),
                    csvEscape(log.success ? "Yes" : "No")
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
