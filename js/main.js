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
}
