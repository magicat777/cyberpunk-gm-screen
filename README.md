# Cyberpunk RED Game Master Screen

A digital GM screen for the Cyberpunk RED tabletop roleplaying game. This web-based tool provides quick access to game rules, tables, and references in a customizable interface.

## Web Access

The Cyberpunk GM Screen is now available online:
- **URL**: [https://magicat777.github.io/cyberpunk-gm-screen/](https://magicat777.github.io/cyberpunk-gm-screen/)
- **Password**: `cyberpunk`

## Features

- **Desktop-Style Interface**: Consolidated layout with draggable panels
- **Collapsible Sidebar**: Accordion-style sidebar with categorized game rules
- **GM Tools Suite**: Specialized tools for Game Masters:
  - **GM Notes**: Session note-taking with history and export features
  - **Dice Roller**: Cyberpunk RED dice mechanics with exploding dice support
  - **Rules Reference**: Quick access to key game rules and tables
- **Character Management**: Track PC and NPC stats with quick reference
- **Profile System**: Save and load different layout configurations
- **Persistent State**: Automatically saves layout and settings
- **Customizable UI**: Toggle between light/dark themes and customize colors
- **Dynamic UI Scaling**: Adjust interface size for any device or preference
- **Font Customization**: Change font families and sizes globally or per-panel
- **Panel Resizing**: Resize panels with drag handles and content reflow
- **Debugging Tools**: Built-in utilities for troubleshooting (Ctrl+Shift+D)
- **Background Service**: Run reliably even after system restarts
- **Auto-Organization**: One-click organization of panels by title or type
- **Window Fitting**: Automatically fit panels to the browser window

## Local Development

### Quick Start

1. Start the server using one of the following methods:
   - Double-click `simple-start.bat` (simplest option)
   - Run `python -m http.server 8888` in the project directory

2. Open your browser and navigate to:
   - http://localhost:8888/desktop.html
   - http://localhost:8888/fixed-super-minimal.html (lightweight version)

For a complete getting started guide, see [docs/user-guides/getting-started.md](docs/user-guides/getting-started.md).

## Deployment

This project is deployed to GitHub Pages. For detailed deployment information, see:
- [Deployment Checkpoint](docs/deployment/DEPLOYMENT-CHECKPOINT.md)
- [GitHub Pages Guide](docs/deployment/GITHUB-PAGES-GUIDE.md)

## Documentation

Comprehensive documentation is available in the `docs/` directory:

- **[Project Overview & Charter](docs/README.md)**: Project scope, goals, and version history
- **[User Guides](docs/user-guides/)**: Instructions for using the GM screen
  - **[Getting Started](docs/user-guides/getting-started.md)**: First steps with the GM screen
  - **[UI Customization](docs/user-guides/ui-customization.md)**: Guide to scaling and customization features
  - **[GM Tools Guide](docs/user-guides/gm-tools-guide.md)**: How to use the GM Tools suite
- **[Technical Documentation](docs/technical/)**: Architecture, deployment, and CI/CD
  - **[GM Tools Specification](docs/technical/gm-tools-spec.md)**: Technical details of GM tools implementation
  - **[Debug Tools](docs/technical/debug-tools.md)**: Debugging and troubleshooting utilities
- **[Design Specifications](docs/design/)**: UI/UX design and visual guidelines
- **[Requirements](docs/requirements/)**: User stories and project requirements

## Interface Versions

This project offers multiple interface options:

1. **Desktop Interface** (recommended): Advanced interface with accordion sidebar
   - Access at: http://localhost:8888/desktop.html
   
2. **Original Interface**: Simpler tab-based interface
   - Access at: http://localhost:8888/ or http://localhost:8888/index.html

3. **Minimal Interface**: Lightweight, modular interface with essential features
   - Access at: http://localhost:8888/fixed-super-minimal.html

## Roadmap

### Current Development: UI Modernization

We're currently working on modernizing the UI/UX of the Cyberpunk GM Screen:
- See the [UI Modernization Plan](UI-MODERNIZATION-PLAN.md) for details

## Contributing

This project follows CI/CD practices with a checkpoint versioning system. See [docs/technical/ci-cd-workflow.md](docs/technical/ci-cd-workflow.md) for details on contributing changes.

## Technical Details

- Pure HTML, CSS, and JavaScript (no frameworks)
- Python HTTP Server for local hosting
- GitHub Pages for web deployment
- Uses localStorage for client-side persistence
- Responsive design works on various screen sizes

## License

This is an unofficial fan project for the Cyberpunk RED tabletop roleplaying game. All game rules and content belong to R. Talsorian Games.

## Version History

Full version history is maintained in [docs/README.md](docs/README.md#version-log).

### Latest Version: v1.0.0-CP-2023-05-013
- Deployed to GitHub Pages for remote access
- Added password protection for secure access
- Created deployment documentation
- Updated README with web access information

### Previous Version: v1.0.0-CP-2023-05-012
- Created lightweight modular interface (fixed-super-minimal.html)
- Implemented comprehensive panel system with 16+ panel types
- Added auto-organization and fit-to-window features
- Added font customization controls with hide/show functionality
- Moved styles to external stylesheet for better maintenance
- Fixed event handling for reliable panel creation and management