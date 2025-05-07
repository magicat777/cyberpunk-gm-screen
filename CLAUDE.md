# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build/Test Commands
- Run Python server: `python server.py`
- Run simple Python server: `python simple-server.py`
- Start with batch file: `./run-cyberpunk-server.bat` or double-click the file
- Start minimal server for testing: `python -m http.server 8888`
- Run navigation validation: `node ci/validate-navigation.js [directory]`
- Install dependencies: `npm install`

## Code Style Guidelines
- **HTML/CSS/JavaScript**: Follow standard web development best practices
- **Python Server**:
  - Follow PEP 8 guidelines for Python code
  - Use descriptive variable and function names
  - Add proper error handling with try/except blocks
  - Document functions with docstrings
- **JavaScript**:
  - Use descriptive camelCase variable and function names
  - Add comments for complex logic
  - Follow project's error handling patterns
  - Maintain compatibility with project's no-framework approach

## Project Architecture

### Key Components
- **Web Interface**: HTML/CSS/JavaScript front-end with desktop-style UI
  - Core interface files: `desktop.html`, `fixed-super-minimal.html`, `index.html`
  - Multiple interface versions for different use cases
- **Python Backend**: Handles serving static files and provides API endpoints
  - `server.py`: Full server with Google Cloud Storage support
  - `simple-server.py`: Simplified server for local testing
- **Data Management**: Hybrid approach using localStorage and optional cloud storage
- **Navigation System**: Standardized navigation component validated via CI
- **GM Tools**: Suite of tools for game masters

### Key Directories
- `/css`: Style definitions including themes and responsive layouts
- `/js`: JavaScript functionality including UI adapters, data handlers, and tools
- `/docs`: Complete documentation including user guides and technical specs
- `/fonts`: Custom web fonts for the Cyberpunk theme
- `/images`: Icons and visual assets
- `/ci`: Continuous integration tools and validation scripts

### Data Flow
1. User interacts with the desktop-style interface
2. Client-side JavaScript handles UI operations
3. Data is stored locally via localStorage
4. Optional cloud synchronization if Google Cloud Storage is configured
5. Server API provides endpoints for storage operations

## Common Development Tasks
- Access the main interface at `http://localhost:8888/desktop.html`
- Access the minimal interface at `http://localhost:8888/fixed-super-minimal.html`
- Add debug information with Ctrl+Shift+D in browser
- View test versions in `/test-frames` directory