document.addEventListener('DOMContentLoaded', () => {
    loadPage('setup-reminders');

    document.body.addEventListener('click', event => {
        if (event.target.matches('[data-page]')) {
            loadPage(event.target.getAttribute('data-page'));
        }
    });

    // Call generateCharts after the DOM is fully loaded
    generateCharts({
        screenTimeChart: 'Active Screen Time (hours)',
        breakFrequencyChart: 'Number of Breaks Taken',
        healthImpactChart: 'Severity Reduction Points'
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
    const intervalSelect = document.getElementById('interval');
    const customIntervalInput = document.getElementById('custom-interval');

    intervalSelect.addEventListener('change', () => {
        if (intervalSelect.value === 'Custom') {
            customIntervalInput.disabled = false;
        } else {
            customIntervalInput.disabled = true;
            customIntervalInput.value = '';
        }
    });

    document.getElementById('save-reminders').addEventListener('click', () => {
        let interval = intervalSelect.value;
        const customInterval = customIntervalInput.value;
        const soundAlert = document.getElementById('sound-alert').value;
        const notificationTypes = Array.from(document.querySelectorAll('input[name="notification-type"]:checked')).map(cb => cb.value);

        // Validate custom interval
        if (interval === 'Custom') {
            if (!customInterval || customInterval <= 0 || customInterval > 60) {
                alert('Please enter a valid custom interval between 1 and 60 minutes.');
                return;
            }
            interval = customInterval;
        }

        localStorage.setItem('reminderSettings', JSON.stringify({ interval, soundAlert, notificationTypes }));
        alert('Reminders saved!');
    });
}

function logHealthSymptoms() {
    document.getElementById('save-symptoms').addEventListener('click', () => {
        const symptoms = Array.from(document.querySelectorAll('input[name="symptom"]:checked')).map(cb => cb.value);

        // Get the severity values, with null checks
        const severityEyeStrainElement = document.getElementById('severity-eye-strain');
        const severityHeadachesElement = document.getElementById('severity-headaches');
        const severityAnxietyElement = document.getElementById('severity-anxiety');

        const severity = {
            eyeStrain: severityEyeStrainElement ? severityEyeStrainElement.value : null,
            headaches: severityHeadachesElement ? severityHeadachesElement.value : null,
            anxiety: severityAnxietyElement ? severityAnxietyElement.value : null
        };

        localStorage.setItem('healthSymptoms', JSON.stringify({ symptoms, severity }));
        provideSuggestions(symptoms);
        alert('Symptoms logged!');
    });
}

function provideSuggestions(symptoms) {
    let suggestions = '';

    if (symptoms.includes('headaches') && symptoms.includes('anxiety') && symptoms.includes('eye-strain')) {
        suggestions = 'Try increasing screen limit this week.';
    } else if (symptoms.includes('eye-strain') && !symptoms.includes('headaches') && !symptoms.includes('anxiety')) {
        suggestions = 'Try using Blue light glasses to reduce eye strain, this should help alleviate the severity.';
    } else if (symptoms.includes('headaches') && !symptoms.includes('eye-strain') && !symptoms.includes('anxiety')) {
        suggestions = 'Suggest doing the 20/20/20 test. Every 20 minutes or so, look into the distance (about 20 feet) for 20 seconds.';
    } else if (symptoms.includes('anxiety') && !symptoms.includes('eye-strain') && !symptoms.includes('headaches')) {
        suggestions = 'Suggest a Digital Detox by auditing social media consumption and removing anything that has influenced mental state negatively recently.';
    }

    return suggestions;
}

function setDailyLimit() {
    document.getElementById('save-daily-limit').addEventListener('click', () => {
        const dailyLimit = document.getElementById('daily-limit').value;
        const notify = document.getElementById('notify').checked;

        // Convert daily limit to minutes for easier comparison
        const [hours, minutes] = dailyLimit.split(':').map(Number);
        const totalMinutes = (hours * 60) + minutes;

        // Validate that the daily limit does not exceed 12 hours (720 minutes)
        if (totalMinutes > 720) {
            alert('Daily limit cannot exceed 12 hours. Please enter a valid limit.');
            return;
        }

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
        
        <h2>Feedback and Strategy Suggestions</h2>
        <div id="feedback"></div>
    `;

    const reminderSettings = JSON.parse(localStorage.getItem('reminderSettings')) || {};
    const healthSymptoms = JSON.parse(localStorage.getItem('healthSymptoms')) || {};
    const dailyLimit = JSON.parse(localStorage.getItem('dailyLimit')) || {};

    // Delay chart generation to ensure DOM is fully updated
    setTimeout(() => {
        // Generate charts with specific y-axis titles
        generateCharts({
            screenTimeChart: 'Active Screen Time (hours)',
            breakFrequencyChart: 'Number of Breaks Taken',
            healthImpactChart: 'Severity Reduction Points'
        });
        // Populate other report sections
        reportDiv.innerHTML += `
            <h2>Settings Review</h2>
            <h3>Reminder Settings</h3>
            <p>Scheduled Interval Breaks(Minutes): ${reminderSettings.interval || 'Not set'}</p>
            <p>Notification Types: ${(reminderSettings.notificationTypes || []).join(', ') || 'None'}</p>
            
            <h3>Health Symptoms</h3>
            <p>Key Symptoms: ${(healthSymptoms.symptoms || []).join(', ') || 'None'}</p>
            <p>Severity: ${JSON.stringify(healthSymptoms.severity) || 'Not set'}</p>
            
            <h3>Screen Usage Limit per Day </h3>
            <p>Maximum Daily Limit(hh:mm): ${dailyLimit.dailyLimit || 'Not set'}</p>
            <p>Notify once usage is done?: ${dailyLimit.notify ? 'Yes' : 'No'}</p>
        <nav>
    <button data-page="setup-reminders">Start Over</button>
    <button onclick="sendEmailWithCsv()">Share</button>

        </nav>
        `;

        // Generate feedback
        const feedbackDiv = document.getElementById('feedback');
        const suggestions = provideSuggestions(healthSymptoms.symptoms || []);
        feedbackDiv.innerHTML = `<p>${suggestions || 'No specific suggestions at this time.'}</p>`;
    }, 100);
}



function generateCharts(yAxisTitles) {
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
        type: 'line',
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
        hoverinfo: 'y+name', // test
        marker: {
            color: 'rgba(255, 206, 86, 0.2)',
            line: {
                color: 'rgba(255, 206, 86, 1)',
                width: 1
            }
        }
    };

    // Define layouts with specific y-axis titles
    const screenTimeLayout = {
        barmode: 'group',
        title: 'Screen Time Weekly Report',
        xaxis: {
            title: 'Day of Week'
        },
        yaxis: {
            title: yAxisTitles.screenTimeChart // Use the provided y-axis title for screen time chart
        }
    };

    const breakFrequencyLayout = {
        barmode: 'group',
        title: 'Break Frequency Weekly Report',
        xaxis: {
            title: 'Day of Week'
        },
        yaxis: {
            title: yAxisTitles.breakFrequencyChart // Use the provided y-axis title for break frequency chart
        }
    };

    const healthImpactLayout = {
        barmode: 'group',
        title: 'Health Rating Weekly Report',
        xaxis: {
            title: 'Day of Week'
        },
        yaxis: {
            title: yAxisTitles.healthImpactChart // Use the provided y-axis title for health impact chart
        }
    };

    // Plot charts
    Plotly.newPlot('screenTimeChart', [screenTimeChart], screenTimeLayout);
    Plotly.newPlot('breakFrequencyChart', [breakFrequencyChart], breakFrequencyLayout);
    Plotly.newPlot('healthImpactChart', [healthImpactChart], healthImpactLayout);
}


function sendEmailWithCsv() {
    const screenTimeData = [4, 5, 6, 7, 3, 2, 1]; // Random data for demonstration
    const breakFrequencyData = [2, 3, 4, 3, 4, 2, 5]; // Random data for demonstration
    const healthImpactData = [1, 2, 3, 4, 2, 3, 1]; // Random data for demonstration
    const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    // Function to generate CSV from data
    function generateCsvData(dataArray, header) {
        let csvContent = header + "\n";
        dataArray.forEach((value, index) => {
            csvContent += `${daysOfWeek[index]},${value}\n`;
        });
        return csvContent;
    }

    // Generate CSV content for each chart
    var csvScreenTime = generateCsvData(screenTimeData, "Day,Screen Time");
    var csvBreakFrequency = generateCsvData(breakFrequencyData, "Day,Break Frequency");
    var csvHealthImpact = generateCsvData(healthImpactData, "Day,Health Impact");

    // Combine all CSV data
    var combinedCsv = "Screen Time Usage\n" + csvScreenTime + 
                      "\nBreak Frequency\n" + csvBreakFrequency +
                      "\nHealth Impact\n" + csvHealthImpact;

    // Encode combined CSV data
    var encodedUri = encodeURI('data:text/csv;charset=utf-8,' + combinedCsv);

    // Create mailto link with subject and body
    var emailSubject = "Weekly Report Data";
    var emailBody = `Attached is the data for the weekly report.
Screen Time Usage: ${screenTimeData.join(', ')}
Break Frequency Data: ${breakFrequencyData.join(', ')}
Health Impact Data: ${healthImpactData.join(', ')}

Please review the attached CSV for detailed information.`;
    var mailtoLink = 'mailto:?subject=' + encodeURIComponent(emailSubject) +
                     '&body=' + encodeURIComponent(emailBody) +
                     '&attachment=' + encodedUri;

    // Open the mailto link in a new window/tab
    window.open(mailtoLink);
}