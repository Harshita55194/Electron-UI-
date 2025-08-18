# Health Pay NHA Claim Processor - Electron App Development Documentation

## Project Overview
This document outlines the development process of converting the PyQt-based NHA Claim Processor application to an Electron-based desktop application.

### Tech Stack
- **Framework**: Electron.js
- **Languages**: HTML, CSS, JavaScript
- **Build Tool**: electron-builder

## Development Process

### 1. Initial Setup
- Created basic Electron app structure
  ```
  electron-app/
  ├── main.js          # Main process file
  ├── renderer.js      # Renderer process file
  ├── index.html       # Main UI file
  ├── styles.css       # Styling
  └── package.json     # Project configuration
  ```

### 2. UI Migration Steps
1. **Analysis of PyQt UI**
   - Analyzed the original PyQt interface (`pyqt_app.py`)
   - Identified key components:
     - Configuration section (Username, Browser selection)
     - Actions section (Launch Browser, Login, etc.)
     - Split view (Claims History and Logs)
     - Footer with branding

2. **HTML Structure Implementation**
   - Created semantic HTML structure
   - Implemented form controls and buttons

3. **CSS Styling**
   - Matched PyQt styling precisely:
     - Used exact colors (rgb values)
     - Matched font sizes (11px base)
     - Replicated button states (enabled/disabled)
     - Implemented 30:70 split view ratio

4. **JavaScript Implementation**
   - Added event listeners for buttons
   - Implemented state management
   - Handled UI updates

### 3. Challenges & Solutions

1. **Exact UI Replication**
   - **Challenge**: Matching PyQt's native look and feel
   - **Solution**: Used precise CSS measurements and colors
   
2. **Button States**
   - **Challenge**: Replicating PyQt's button states
   - **Solution**: Implemented custom CSS for enabled/disabled states

3. **Layout Management**
   - **Challenge**: Matching the exact layout proportions
   - **Solution**: Used CSS Grid and Flexbox with specific ratios

4. **Building Executable**
   - **Challenge**: Initially used PowerShell command `copy %SystemRoot%\System32\shell32.dll,1 app-icon.ico` to create executable
   - **Problem**: PowerShell approach was manual, required system DLL access, and didn't properly bundle dependencies
   - **Solution**: Switched to electron-builder because it:
     - Automatically bundles all dependencies
     - Handles app icons more elegantly
     - Creates a proper Windows installer
     - Manages application metadata
     - Produces a more professional, portable build

### 4. Building the Application
1. **Initial Setup**
   ```json
   {
     "scripts": {
       "start": "electron .",
       "build": "electron-builder build --win"
     }
   }
   ```

2. **electron-builder Configuration**
   ```json
   {
     "build": {
       "appId": "com.healthpay.nha",
       "productName": "Health Pay - NHA Claim Processor",
       "win": {
         "target": ["portable"]
       }
     }
   }
   ```

### 5. Development Resources Used

I have refered **electron docs** to understand the flow of app,and **electron-builder** to export .exe file and used git copilot for converting pyqt to electron

### 6. Testing
- Tested UI components
- Verified button states
- Validated build process

## Build Instructions
1. Install dependencies:
   ```bash
   npm install
   ```

2. Run development mode:
   ```bash
   npm start
   ```

3. Build executable:
   ```bash
   npm run build
   ```

4. Running the Built Application:
   - Navigate to `dist-electron/win-unpacked` folder
   - Find `Health Pay - NHA Claim Processor.exe`
   - Double-click to run the application
   - For portable use, you can copy the entire `win-unpacked` folder to any location


## Conclusion
Successfully migrated the PyQt application to Electron while maintaining the exact look and feel of the original application. The electron-builder setup provides a straightforward way to create distributable executables.
