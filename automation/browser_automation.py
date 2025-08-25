from playwright.sync_api import sync_playwright
import sys
import time
import json
import os
import socket

# Global variable to store the browser context
browser_info = {
    'port': None,
    'wsEndpoint': None,
    'first_page': None
}

def read_browser_config():
    """Read browser configuration from usernames.json"""
    try:
        config_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'electron-app', 'usernames.json')
        with open(config_path, 'r') as f:
            data = json.load(f)
            return data.get('selectedBrowser', 'chrome')
    except Exception as e:
        print(f"Error reading config: {e}")
        return 'chrome'

def save_browser_info(wsEndpoint, port):
    """Save browser connection info to a file"""
    try:
        info_path = os.path.join(os.path.dirname(__file__), 'browser_info.json')
        with open(info_path, 'w') as f:
            json.dump({
                'wsEndpoint': wsEndpoint,
                'port': port
            }, f)
        print("Browser info saved successfully")
    except Exception as e:
        print(f"Error saving browser info: {e}")

def load_browser_info():
    """Load browser connection info from file"""
    try:
        info_path = os.path.join(os.path.dirname(__file__), 'browser_info.json')
        if os.path.exists(info_path):
            with open(info_path, 'r') as f:
                return json.load(f)
    except Exception as e:
        print(f"Error loading browser info: {e}")
    return None

def launch_browser():
    """Launch a new browser window"""
    print("Starting browser launch...")
    try:
        browser_type = read_browser_config()
        print(f"Browser type selected: {browser_type}")
        
        # Find an available port
        sock = socket.socket()
        sock.bind(('', 0))
        port = sock.getsockname()[1]
        sock.close()
        
        playwright = sync_playwright().start()
        
        # Launch the browser based on selection with debugging port
        if browser_type.lower() == 'edge':
            print("Launching Edge browser...")
            browser = playwright.chromium.launch(
                channel='msedge',
                headless=False,
                args=[f'--remote-debugging-port={port}']
            )
        else:
            print("Launching Chrome browser...")
            browser = playwright.chromium.launch(
                headless=False,
                args=[f'--remote-debugging-port={port}']
            )
        
        # Create a page and store it
        page = browser.new_page()
        
        # Navigate directly to NHA website
        print("Navigating to NHA website...")
        page.goto('https://provider.nha.gov.in/')
        page.wait_for_load_state('networkidle')
        print("Browser launched and website loaded successfully!")
        
        # Get the WebSocket endpoint
        wsEndpoint = f'http://localhost:{port}'
        save_browser_info(wsEndpoint, port)
        
        print("Browser is ready. Keep this window open...")
        print(f"Debug port: {port}")
        
        # Keep the browser and script running
        try:
            while True:
                time.sleep(1)
        except KeyboardInterrupt:
            print("\nClosing browser...")
            browser.close()
            playwright.stop()
            
    except Exception as e:
        print(f"Error launching browser: {e}")
        if 'playwright' in locals():
            playwright.stop()
        sys.exit(1)

def perform_login(username):
    """Fill username in the existing browser window"""
    print(f"Starting login process for user: {username}")
    try:
        # Load saved browser info
        info = load_browser_info()
        if not info or not info.get('wsEndpoint') or not info.get('port'):
            print("No browser instance found. Please launch browser first.")
            return
        
        playwright = sync_playwright().start()
        try:
            # Connect to the existing browser using CDP
            print(f"Connecting to existing browser on port {info['port']}...")
            browser = playwright.chromium.connect_over_cdp(endpoint_url=info['wsEndpoint'])
            
            # Get the existing pages or create a new one
            print("Looking for browser pages...")
            pages = browser.contexts[0].pages if browser.contexts else []
            if not pages:
                print("No pages found, creating new page...")
                context = browser.new_context()
                page = context.new_page()
            else:
                print(f"Found {len(pages)} existing pages, using first one...")
                page = pages[0]
            
            # Make sure we're on the right page
            current_url = page.url
            if not current_url or 'provider.nha.gov.in' not in current_url:
                print("Navigating to NHA website...")
                page.goto('https://provider.nha.gov.in/')
                # Wait for page load
                page.wait_for_load_state('networkidle')
            
            # Fill the username
            print("Looking for username field...")
            # Wait longer and use a more robust selector
            page.wait_for_selector('#userid', state='visible', timeout=30000)
            page.fill('#userid', username)
            print(f"Username '{username}' filled successfully")
            print("You can continue in the browser window...")
            
            # Keep the connection open until user interrupts
            print("Press Ctrl+C to close the connection...")
            while True:
                time.sleep(1)
                
        except KeyboardInterrupt:
            print("\nClosing connection (browser will stay open)...")
        except Exception as e:
            print(f"Error interacting with browser: {e}")
        finally:
            playwright.stop()
            
    except Exception as e:
        print(f"Error during login: {e}")
        return

if __name__ == "__main__":
    # Check arguments
    if len(sys.argv) < 2:
        print("Usage:")
        print("  Launch browser: python browser_automation.py launch")
        print("  Login with username: python browser_automation.py login <username>")
        sys.exit(1)
    
    command = sys.argv[1].lower()
    
    try:
        if command == "launch":
            launch_browser()
        elif command == "login":
            if len(sys.argv) < 3:
                print("Error: Username required for login command")
                print("Usage: python browser_automation.py login <username>")
                sys.exit(1)
            username = sys.argv[2]
            perform_login(username)
        else:
            print("Invalid command. Use 'launch' or 'login'")
            sys.exit(1)
    except KeyboardInterrupt:
        print("\nClosing browser...")
        sys.exit(0)
