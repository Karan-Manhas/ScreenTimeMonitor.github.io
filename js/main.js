document.addEventListener('DOMContentLoaded', () => {
    loadPage('setup-reminders');

    document.body.addEventListener('click', event => {
        if (event.target.matches('[data-page]')) {
            loadPage(event.target.getAttribute('data-page'));
        }
    });

    // Call generateCharts after the DOM is fully loaded
    generateCharts();
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
    // Create div elements for the charts
    const reportDiv = document.getElementById('report');
    reportDiv.innerHTML = `
        <h2>Screen Time Usage</h2>
        <div id="screenTimeChart"></div>
        
        <h2>Break Frequency</h2>
        <div id="breakFrequencyChart"></div>
        
        <h2>Health Impact</h2>
        <div id="healthImpactChart"></div>
    `;

    const reminderSettings = JSON.parse(localStorage.getItem('reminderSettings')) || {};
    const healthSymptoms = JSON.parse(localStorage.getItem('healthSymptoms')) || {};
    const dailyLimit = JSON.parse(localStorage.getItem('dailyLimit')) || {};

    // Delay chart generation to ensure DOM is fully updated
    setTimeout(() => {
        // Generate charts
        generateCharts();
        // Populate other report sections
        reportDiv.innerHTML += `
            <h3>Reminder Settings</h3>
            <p>Interval: ${reminderSettings.interval || 'Not set'}</p>
            <p>Notification Types: ${(reminderSettings.notificationTypes || []).join(', ') || 'None'}</p>
            
            <h3>Health Symptoms</h3>
            <p>Symptoms: ${(healthSymptoms.symptoms || []).join(', ') || 'None'}</p>
            <p>Severity: ${healthSymptoms.severity || 'Not set'}</p>
            
            <h3>Daily Limit</h3>
            <p>Daily Limit: ${dailyLimit.dailyLimit || 'Not set'}</p>
            <p>Notify: ${dailyLimit.notify ? 'Yes' : 'No'}</p>
        `;
    }, 100);
}

function generateCharts() {
    const screenTimeData = [4, 5, 6, 7, 3, 2, 1]; // Random data for demonstration
    const breakFrequencyData = [2, 3, 4, 3, 4, 2, 5]; // Random data for demonstration
    const healthImpactData = [1, 2, 3, 4, 2, 3, 1]; // Random data for demonstration
    const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    // Generate Screen Time Chart
    const screenTimeChart = {
        x: daysOfWeek,
        y: screenTimeData,
        type: 'bar',
        name: 'Screen Time (hours)',
        marker: {
            color: 'rgba(75, 192, 192, 0.2)',
            line: {
                color: 'rgba(75, 192, 192, 1)',
                width: 1
            }
        }
    };

    // Generate Break Frequency Chart
    const breakFrequencyChart = {
        x: daysOfWeek,
        y: breakFrequencyData,
        type: 'bar',
        name: 'Break Frequency',
        marker: {
            color: 'rgba(54, 162, 235, 0.2)',
            line: {
                color: 'rgba(54, 162, 235, 1)',
                width: 1
            }
        }
    };

    // Generate Health Impact Chart
    const healthImpactChart = {
        x: daysOfWeek,
        y: healthImpactData,
        type: 'bar',
        name: 'Health Impact (severity)',
        marker: {
            color: 'rgba(255, 206, 86, 0.2)',
            line: {
                color: 'rgba(255, 206, 86, 1)',
                width: 1
            }
        }
    };

    // Define layout
    const layout = {
        barmode: 'group',
        title: 'Weekly Report',
        xaxis: {
            title: 'Day of Week'
        },
        yaxis: {
            title: 'Value'
        }
    };

    // Plot charts
    Plotly.newPlot('screenTimeChart', [screenTimeChart], layout);
    Plotly.newPlot('breakFrequencyChart', [breakFrequencyChart], layout);
    Plotly.newPlot('healthImpactChart', [healthImpactChart], layout);
}