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

// Load saved usernames from JSON file
let usernames = [];
try {
    // In production, this would load from a file
    usernames = ['user1', 'user2']; // Placeholder data
} catch (error) {
    logMessage('Error loading usernames: ' + error.message);
}

// Populate username select
function populateUsernames() {
    usernameSelect.innerHTML = '';
    usernames.forEach(username => {
        const option = document.createElement('option');
        option.value = option.textContent = username;
        usernameSelect.appendChild(option);
    });
}

// Log message function
function logMessage(message) {
    const timestamp = new Date().toLocaleTimeString();
    logArea.value += `[${timestamp}] ${message}\n`;
    logArea.scrollTop = logArea.scrollHeight;
}

// Button click handlers
launchBrowserBtn.addEventListener('click', () => {
    const selectedBrowser = document.querySelector('input[name="browser"]:checked').value;
    logMessage(`Launching ${selectedBrowser} browser...`);
    performLoginBtn.disabled = false;
});

performLoginBtn.addEventListener('click', () => {
    const username = usernameSelect.value;
    logMessage(`Performing login for user: ${username}`);
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
