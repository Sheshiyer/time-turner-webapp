# Time Turner Chrome Extension

A Chrome extension that reimagines time visualization through the lens of His Dark Materials' alethiometer, offering both 2D and 3D interfaces for exploring temporal patterns and personal rhythms.

## Features

- **Dual View System**
  - Traditional Alethiometer View (2D) for precise readings
  - Crystalline Sphere View (3D) for immersive visualization
  - Seamless switching between views while maintaining state

- **Temporal Layers**
  - Zodiac influences and astronomical alignments
  - Traditional Chinese Medicine (TCM) elements and cycles
  - Personal biorhythms and patterns
  - Dust particle visualization of meaningful connections

- **Interactive Elements**
  - Rotate rings/spheres to explore alignments
  - Real-time updates based on current time
  - Visual feedback for significant patterns
  - Intuitive controls in both views

## Installation

1. Clone this repository
```bash
git clone https://github.com/yourusername/time-turner-chrome-ext.git
```

2. Install dependencies
```bash
npm install
```

3. Build the extension
```bash
npm run build
```

4. Load in Chrome
- Open Chrome and navigate to `chrome://extensions/`
- Enable "Developer mode"
- Click "Load unpacked" and select the `dist` folder

## Usage

### Alethiometer View (2D)

The traditional view presents concentric rings that can be rotated to explore different temporal alignments:

- **Outer Ring**: Zodiac signs and astronomical positions
- **Middle Ring**: TCM elements and their influences
- **Inner Ring**: Personal biorhythms and cycles
- **Center**: Current time and significant alignments

### Crystalline View (3D)

The immersive view represents temporal layers as crystalline spheres:

- **Outer Sphere**: Cosmic influences and zodiac patterns
- **Middle Sphere**: Elemental energies and cycles
- **Inner Sphere**: Personal temporal patterns
- **Dust Particles**: Flow between spheres indicating connections

### View Switching

- Use the view toggle button in the top-right corner
- Current alignments and readings are preserved when switching views
- Each view offers unique insights into the same temporal patterns

## Development

### Project Structure

```
src/
├── components/
│   ├── AlethiometerClock.tsx    # 2D view implementation
│   ├── Scene3D.tsx              # 3D view implementation
│   ├── rings/                   # Ring components
│   └── ...
├── utils/
│   ├── zodiac.ts               # Astronomical calculations
│   └── ...
└── types/
    └── rings.ts                # Type definitions
```

### Running Locally

```bash
npm run dev
```

### Building

```bash
npm run build
```

### Testing

```bash
npm test
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Inspired by Philip Pullman's His Dark Materials series
- Built with React, Three.js, and TypeScript
- Uses astronomical calculations from the Astronomia library
