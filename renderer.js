// DOM Elements
const usernameSelect = document.getElementById('username');
const manageUsersBtn = document.getElementById('manageUsers');
const launchBrowserBtn = document.getElementById('launchBrowser');
const performLoginBtn = document.getElementById('performLogin');
const startClaimBtn = document.getElementById('startFirstClaimCycle');
const stopClaimsBtn = document.getElementById('stopProcessing');
const killAutomationBtn = document.getElementById('killAutomation');
const refreshHistoryBtn = document.getElementById('refreshHistory');
const viewDetailsBtn = document.getElementById('viewDetails');
const claimsList = document.querySelector('.claims-list');
const logArea = document.querySelector('.log-area');

// Load last used username if any
try {
    const fs = window.require('fs');
    const path = window.require('path');
    const usernamesPath = path.join(__dirname, 'usernames.json');
    if (fs.existsSync(usernamesPath)) {
        const data = JSON.parse(fs.readFileSync(usernamesPath));
        if (data.selectedUsername) {
            usernameSelect.value = data.selectedUsername;
        }
    }
} catch (error) {
    logMessage('Error loading last username: ' + error.message);
}

// Log message function
function logMessage(message) {
    const timestamp = new Date().toLocaleTimeString();
    logArea.value += `[${timestamp}] ${message}\n`;
    logArea.scrollTop = logArea.scrollHeight;
}

// Button click handlers
launchBrowserBtn.addEventListener('click', () => {
    const selectedBrowser = document.querySelector('input[name="browser"]:checked').id;
    const username = usernameSelect.value;
    
    // Save the selected username and browser to usernames.json
    const fs = window.require('fs');
    const path = window.require('path');
    const usernamesPath = path.join(__dirname, 'usernames.json');
    
    try {
        // Save username and browser choice
        fs.writeFileSync(usernamesPath, JSON.stringify({
            selectedUsername: username,
            selectedBrowser: selectedBrowser
        }, null, 2));
        
        logMessage(`Launching browser...`);
        
        // Run the Python script
        const { spawn } = window.require('child_process');
        const pythonPath = 'python';  // or 'python3' depending on your system
        const pythonScript = path.join(__dirname, '..', 'automation', 'browser_automation.py');
        
        const process = spawn(pythonPath, [pythonScript, 'launch']);
        
        process.stdout.on('data', (data) => {
            logMessage(data.toString().trim());
        });
        
        process.stderr.on('data', (data) => {
            logMessage(`Error: ${data.toString().trim()}`);
        });
        
        process.on('error', (error) => {
            logMessage(`Failed to start process: ${error.message}`);
            return;
        });
        
        performLoginBtn.disabled = false;
    } catch (error) {
        logMessage(`Error: ${error.message}`);
    }
});

performLoginBtn.addEventListener('click', () => {
    const username = usernameSelect.value;
    logMessage(`Performing login for user: ${username}...`);
    
    // Run the Python script for login
    const { spawn } = window.require('child_process');
    const path = window.require('path');
    const pythonScript = path.join(__dirname, '..', 'automation', 'browser_automation.py');
    
    const pythonProcess = spawn('python', [pythonScript, 'login', username]);
    
    pythonProcess.stdout.on('data', (data) => {
        logMessage(data.toString().trim());
    });
    
    pythonProcess.stderr.on('data', (data) => {
        logMessage(`Error: ${data.toString().trim()}`);
    });
    
    pythonProcess.on('error', (error) => {
        logMessage(`Failed to start Python process: ${error.message}`);
    });
    
    startClaimBtn.disabled = false;
});

startClaimBtn.addEventListener('click', () => {
    logMessage('Starting claim processing cycle...');
    stopClaimsBtn.disabled = false;
    startClaimBtn.disabled = true;
});

stopClaimsBtn.addEventListener('click', () => {
    logMessage('Stopping claim processing...');
    stopClaimsBtn.disabled = true;
    startClaimBtn.disabled = false;
});

killAutomationBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to kill the automation process?')) {
        logMessage('Killing automation process...');
        performLoginBtn.disabled = true;
        startClaimBtn.disabled = true;
        stopClaimsBtn.disabled = true;
    }
});

// Claims list handlers
claimsList.addEventListener('change', () => {
    viewDetailsBtn.disabled = !claimsList.selectedOptions.length;
});

refreshHistoryBtn.addEventListener('click', () => {
    logMessage('Refreshing claims history...');
    // Simulated data
    const claims = ['CLAIM001', 'CLAIM002', 'CLAIM003'];
    claimsList.innerHTML = '';
    claims.forEach(claim => {
        const option = document.createElement('option');
        option.value = option.textContent = claim;
        claimsList.appendChild(option);
    });
    claimsCount.textContent = `Processed Claims: ${claims.length}`;
});

viewDetailsBtn.addEventListener('click', () => {
    const selectedClaim = claimsList.value;
    if (selectedClaim) {
        logMessage(`Viewing details for claim: ${selectedClaim}`);
        // In production, this would show a modal with claim details
        alert(`Claim Details for ${selectedClaim}\n\nThis is a placeholder for claim details.`);
    }
});

// Initialize UI
populateUsernames();
logMessage('Application initialized. Select or add a username, then Initialize Browser.');
