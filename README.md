# 🚀 Pixel Rocket Builder

A 2D browser-based rocket building game with modern pixel art, drag-and-drop construction, and realistic-ish physics simulation.

## Features

- **Drag-and-Drop Editor** - Build rockets by dragging parts onto the launch pad
- **5 Part Categories** - Engines, Fuel Tanks, Structure, Control, and Payload
- **Real-time Stats** - TWR, Delta-V, estimated altitude, fuel efficiency
- **Physics Simulation** - Gravity, atmospheric drag, fuel consumption
- **Two Game Modes**:
  - **Level Mode** - Complete objectives to unlock new parts
  - **Fun Mode** - All parts unlocked for sandbox creativity
- **Launch Visualization** - Watch your rocket fly with particle effects

## How to Play

1. Open `index.html` in a modern web browser
2. Click on parts in the right panel to add them to your rocket
3. Drag parts to reposition them
4. Check your stats at the bottom (TWR must be > 1.0 to launch)
5. Click **LAUNCH** and watch your rocket fly!

## Controls

| Action | How |
|--------|-----|
| Add Part | Click on part in palette |
| Move Part | Drag on canvas |
| Delete Part | Select + Delete key |
| Launch | Click LAUNCH button |
| Stage | Click STAGE during flight |
| Abort | Click ABORT during flight |

## Parts

### Engines 🔥
| Part | Mass | Thrust | ISP |
|------|------|--------|-----|
| Small Thruster | 50kg | 20kN | 280s |
| Standard Engine | 200kg | 150kN | 320s |
| Heavy Lifter | 500kg | 400kN | 300s |
| Booster | 300kg | 250kN | 250s |

### Fuel Tanks ⛽
| Part | Mass | Capacity |
|------|------|----------|
| Small Tank | 30kg | 100 |
| Medium Tank | 80kg | 300 |
| Large Tank | 150kg | 600 |
| Radial Tank | 40kg | 80 |

## Tech Stack

- Pure HTML5/CSS/JavaScript
- Canvas 2D rendering
- LocalStorage for saves
- No build tools required

## Browser Support

Works in all modern browsers (Chrome, Firefox, Safari, Edge).

---

*Built with ❤️ for space enthusiasts*