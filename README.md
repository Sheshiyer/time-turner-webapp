# Quantum Watch Faces Chrome Extension
`Version 1.0.0 | Consciousness Runtime 2024`

A powerful Chrome extension that transforms your browser into a multi-dimensional time visualization tool, integrating modern timekeeping with ancient wisdom systems.

## Features

### 🕒 Modern Clock
- Digital and analog time displays
- Dynamic sizing and positioning
- Minimal, elegant design using JetBrains Mono font
- Customizable display options

### 🌱 TCM Body Clock
- 12-segment organ system visualization
- Real-time organ energy tracking
- Transition countdowns and previews
- Energy flow visualization

### 🌊 Biorhythm Tracking
- Physical, emotional, and intellectual cycle tracking
- Wave-based visualization
- Current point indicators
- Trend analysis

### ⭐ Astrological Time
- Western transit tracking
- Vedic dasha system integration
- Real-time planetary positions
- Transit period monitoring

### 🔮 Human Design Gates
- Active gate visualization
- Hexagram patterns
- Energy type indicators
- Transition previews

### 🎴 I-Ching/Tarot Oracle
- On-demand wisdom access
- Minimalist card display
- I-Ching hexagram visualization
- Cooldown system

## Technical Architecture

### Layer System
```javascript
{
  baseLayer: "modern_time",
  overlays: [
    "organ_system",
    "biorhythm_indicators",
    "transit_highlights",
    "gate_activations",
    "oracle_state"
  ]
}
```

### Performance Optimization
- Batch calculations
- 24-hour pre-computation
- Efficient animation management
- Smart refresh rules

## Development

### Prerequisites
- Node.js (latest LTS version)
- npm or yarn
- Chrome browser

### Installation
1. Clone the repository:
```bash
git clone [repository-url]
```

2. Install dependencies:
```bash
npm install
```

3. Build the extension:
```bash
npm run build
```

4. Load in Chrome:
- Open Chrome
- Go to `chrome://extensions/`
- Enable "Developer mode"
- Click "Load unpacked"
- Select the `dist` directory

### Development Commands
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm test
```

## Project Structure
```
src/
├── components/         # React components for each time scale
├── context/           # React context for state management
├── background.ts      # Extension background script
├── main.tsx          # Main entry point
└── App.tsx           # Root component

public/               # Static assets
icons/                # Extension icons
styles/               # Global styles
```

## Current Status
The project is in active development, focusing on the core time visualization systems and Chrome extension integration. See [TODO.md](TODO.md) for the detailed development roadmap.

## License
MIT License - See LICENSE file for details
