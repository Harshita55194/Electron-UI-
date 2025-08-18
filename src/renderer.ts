interface UIElements {
    usernameSelect: HTMLSelectElement;
    manageUsersBtn: HTMLButtonElement;
    launchBrowserBtn: HTMLButtonElement;
    performLoginBtn: HTMLButtonElement;
    startClaimBtn: HTMLButtonElement;
    stopClaimsBtn: HTMLButtonElement;
    killAutomationBtn: HTMLButtonElement;
    refreshHistoryBtn: HTMLButtonElement;
    viewDetailsBtn: HTMLButtonElement;
    claimsList: HTMLDivElement;
    logArea: HTMLDivElement;
}

class UIController {
    private elements: UIElements;

    constructor() {
        this.elements = {
            usernameSelect: document.getElementById('username') as HTMLSelectElement,
            manageUsersBtn: document.getElementById('manageUsers') as HTMLButtonElement,
            launchBrowserBtn: document.getElementById('launchBrowser') as HTMLButtonElement,
            performLoginBtn: document.getElementById('performLogin') as HTMLButtonElement,
            startClaimBtn: document.getElementById('startFirstClaimCycle') as HTMLButtonElement,
            stopClaimsBtn: document.getElementById('stopProcessing') as HTMLButtonElement,
            killAutomationBtn: document.getElementById('killAutomation') as HTMLButtonElement,
            refreshHistoryBtn: document.getElementById('refreshHistory') as HTMLButtonElement,
            viewDetailsBtn: document.getElementById('viewDetails') as HTMLButtonElement,
            claimsList: document.querySelector('.claims-list') as HTMLDivElement,
            logArea: document.querySelector('.log-area') as HTMLDivElement
        };
        this.initializeEventListeners();
    }

    private initializeEventListeners(): void {
        this.elements.launchBrowserBtn.addEventListener('click', () => this.handleLaunchBrowser());
        this.elements.performLoginBtn.addEventListener('click', () => this.handlePerformLogin());
        this.elements.startClaimBtn.addEventListener('click', () => this.handleStartClaim());
        this.elements.stopClaimsBtn.addEventListener('click', () => this.handleStopClaims());
        this.elements.killAutomationBtn.addEventListener('click', () => this.handleKillAutomation());
        this.elements.refreshHistoryBtn.addEventListener('click', () => this.handleRefreshHistory());
        this.elements.viewDetailsBtn.addEventListener('click', () => this.handleViewDetails());
    }

    private handleLaunchBrowser(): void {
        const selectedBrowser = document.querySelector('input[name="browser"]:checked') as HTMLInputElement;
        this.logMessage(`Launching ${selectedBrowser.value} browser...`);
        this.elements.performLoginBtn.disabled = false;
    }

    private handlePerformLogin(): void {
        const username = this.elements.usernameSelect.value;
        this.logMessage(`Performing login for user: ${username}`);
        this.elements.startClaimBtn.disabled = false;
    }

    private handleStartClaim(): void {
        this.logMessage('Starting claim processing cycle...');
        this.elements.stopClaimsBtn.disabled = false;
        this.elements.startClaimBtn.disabled = true;
    }

    private handleStopClaims(): void {
        this.logMessage('Stopping claim processing...');
        this.elements.stopClaimsBtn.disabled = true;
        this.elements.startClaimBtn.disabled = false;
    }

    private handleKillAutomation(): void {
        if (confirm('Are you sure you want to kill the automation process?')) {
            this.logMessage('Killing automation process...');
            this.elements.performLoginBtn.disabled = true;
            this.elements.startClaimBtn.disabled = true;
            this.elements.stopClaimsBtn.disabled = true;
        }
    }

    private handleRefreshHistory(): void {
        this.logMessage('Refreshing claims history...');
    }

    private handleViewDetails(): void {
        this.logMessage('Viewing selected claim details...');
    }

    private logMessage(message: string): void {
        const timestamp = new Date().toLocaleTimeString();
        this.elements.logArea.textContent += `[${timestamp}] ${message}\n`;
    }
}

// Initialize UI when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new UIController();
});
