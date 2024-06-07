document.addEventListener('DOMContentLoaded', () => {
    loadPage('setup-reminders');

    document.body.addEventListener('click', event => {
        if (event.target.matches('[data-page]')) {
            loadPage(event.target.getAttribute('data-page'));
        }
    });
});

function loadPage(page) {
    fetch(`pages/${page}.html`)
        .then(response => response.text())
        .then(html => {
            document.getElementById('app').innerHTML = html;
            initPage(page);
        });
}

function initPage(page) {
    if (page === 'setup-reminders') {
        setupReminders();
    } else if (page === 'log-health-symptoms') {
        logHealthSymptoms();
    } else if (page === 'set-daily-limit') {
        setDailyLimit();
    } else if (page === 'visual-cue') {
        visualCue();
    } else if (page === 'weekly-report') {
        weeklyReport();
    }
}

function setupReminders() {
    document.getElementById('save-reminders').addEventListener('click', () => {
        const interval = document.getElementById('interval').value;
        const notificationTypes = Array.from(document.querySelectorAll('input[name="notification-type"]:checked')).map(cb => cb.value);

        localStorage.setItem('reminderSettings', JSON.stringify({ interval, notificationTypes }));
        alert('Reminders saved!');
    });
}

function logHealthSymptoms() {
    document.getElementById('save-symptoms').addEventListener('click', () => {
        const symptoms = Array.from(document.querySelectorAll('input[name="symptom"]:checked')).map(cb => cb.value);
        const severity = document.getElementById('severity').value;

        localStorage.setItem('healthSymptoms', JSON.stringify({ symptoms, severity }));
        alert('Symptoms logged!');
    });
}

function setDailyLimit() {
    document.getElementById('save-daily-limit').addEventListener('click', () => {
        const dailyLimit = document.getElementById('daily-limit').value;
        const notify = document.getElementById('notify').checked;

        localStorage.setItem('dailyLimit', JSON.stringify({ dailyLimit, notify }));
        alert('Daily limit saved!');
    });
}

function visualCue() {
    const visualCue = document.querySelector('.visual-cue');
    visualCue.style.display = 'flex';

    document.getElementById('snooze').addEventListener('click', () => {
        visualCue.style.display = 'none';
    });

    document.getElementById('take-break').addEventListener('click', () => {
        visualCue.style.display = 'none';
        alert('Enjoy your break!');
    });
}

function weeklyReport() {
    const reminderSettings = JSON.parse(localStorage.getItem('reminderSettings')) || {};
    const healthSymptoms = JSON.parse(localStorage.getItem('healthSymptoms')) || {};
    const dailyLimit = JSON.parse(localStorage.getItem('dailyLimit')) || {};

    document.getElementById('report').innerHTML = `
        <h2>Reminder Settings</h2>
        <p>Interval: ${reminderSettings.interval || 'Not set'}</p>
        <p>Notification Types: ${(reminderSettings.notificationTypes || []).join(', ') || 'None'}</p>
        
        <h2>Health Symptoms</h2>
        <p>Symptoms: ${(healthSymptoms.symptoms || []).join(', ') || 'None'}</p>
        <p>Severity: ${healthSymptoms.severity || 'Not set'}</p>
        
        <h2>Daily Limit</h2>
        <p>Daily Limit: ${dailyLimit.dailyLimit || 'Not set'}</p>
        <p>Notify: ${dailyLimit.notify ? 'Yes' : 'No'}</p>
    `;
    // Delay chart generation to ensure DOM is fully updated
    setTimeout(() => {
        generateCharts();
    }, 100);
}

function generateCharts() {
    const screenTimeData = [4, 5, 6, 7, 3, 2, 1]; // Random data for demonstration
    const breakFrequencyData = [2, 3, 4, 3, 4, 2, 5]; // Random data for demonstration
    const healthImpactData = [1, 2, 3, 4, 2, 3, 1]; // Random data for demonstration
    console.log(document.getElementById('screenTimeChart'));
    const ctx1 = document.getElementById('screenTimeChart').getContext('2d');
    console.log(document.getElementById('breakFrequencyChart'));
    const ctx2 = document.getElementById('breakFrequencyChart').getContext('2d');
    console.log(document.getElementById('healthImpactChart'));
    const ctx3 = document.getElementById('healthImpactChart').getContext('2d');

    new Chart(ctx1, {
        type: 'bar',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Screen Time (hours)',
                data: screenTimeData,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    new Chart(ctx2, {
        type: 'bar',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Break Frequency',
                data: breakFrequencyData,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    new Chart(ctx3, {
        type: 'bar',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Health Impact (severity)',
                data: healthImpactData,
                backgroundColor: 'rgba(255, 206, 86, 0.2)',
                borderColor: 'rgba(255, 206, 86, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}
