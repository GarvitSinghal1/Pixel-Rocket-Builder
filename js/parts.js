/**
 * PIXEL ROCKET BUILDER - Parts Definitions
 * All rocket parts with their properties and pixel art
 */

const PARTS = {
    // ============================================
    // ENGINES
    // ============================================
    engines: {
        small_thruster: {
            id: 'small_thruster',
            name: 'Small Thruster',
            category: 'engines',
            mass: 50,
            thrust: 10,
            fuelConsumption: 0.5,
            isp: 280,
            ispASL: 250,
            ispVac: 280,
            width: 1,
            height: 1,
            attachPoints: { top: true, bottom: false, left: false, right: false },
            unlockLevel: 0,
            color: '#666677',
            accentColor: '#ff6600',
            description: 'Compact engine for lightweight rockets',
            tooltip: 'Low thrust but fuel-efficient. Best for altitudes up to 10km'
        },
        standard_engine: {
            id: 'standard_engine',
            name: 'Standard Engine',
            category: 'engines',
            mass: 500,
            thrust: 120, // Nerfed from 300
            fuelConsumption: 5,
            isp: 320,
            ispASL: 280,
            ispVac: 320,
            width: 2,
            height: 2,
            attachPoints: { top: true, bottom: false, left: false, right: false },
            unlockLevel: 0,
            color: '#555566',
            accentColor: '#ff8800',
            description: 'Reliable workhorse engine',
            tooltip: 'Balanced thrust and efficiency. Good for reaching 50km+'
        },
        heavy_lifter: {
            id: 'heavy_lifter',
            name: 'Heavy Lifter',
            category: 'engines',
            mass: 1500,
            thrust: 450, // Nerfed from 1200
            fuelConsumption: 18,
            isp: 300,
            ispASL: 270,
            ispVac: 300,
            width: 3,
            height: 2,
            attachPoints: { top: true, bottom: false, left: false, right: false },
            unlockLevel: 5,
            color: '#444455',
            accentColor: '#ffaa00',
            description: 'Powerful main stage engine',
            tooltip: 'High thrust for heavy payloads. Can reach space (100km+)'
        },
        booster: {
            id: 'booster',
            name: 'Booster',
            category: 'engines',
            mass: 500, // Dry mass
            fuelCapacity: 1500, // Solid Fuel
            thrust: 250, // Nerfed from 600
            fuelConsumption: 15,
            isp: 250,
            ispASL: 230,
            ispVac: 250,
            width: 1,
            height: 3,
            attachPoints: { top: true, bottom: false, left: true, right: true },
            unlockLevel: 3,
            color: '#cc4444',
            accentColor: '#ff6600',
            description: 'Solid rocket booster for extra thrust',
            tooltip: 'Side-mounted booster. Burns fast'
        },
        ion_drive: {
            id: 'ion_drive',
            name: 'Ion Drive',
            category: 'engines',
            mass: 100,
            thrust: 2, // Nerfed back to logical low thrust
            fuelConsumption: 0.1,
            isp: 4000,
            ispASL: 100, // Virtually useless in atmosphere
            ispVac: 4000,
            width: 1,
            height: 1,
            attachPoints: { top: true, bottom: false, left: false, right: false },
            unlockLevel: 8,
            color: '#aaaaaa',
            accentColor: '#00ffff',
            description: 'High-efficiency deep space engine',
            tooltip: 'Tiny thrust but insane efficiency. Vacuum only'
        },
        aerospike: {
            id: 'aerospike',
            name: 'Aerospike',
            category: 'engines',
            mass: 800,
            thrust: 350, // Nerfed from 500
            fuelConsumption: 14,
            isp: 340,
            ispASL: 320, // Altitude compensating
            ispVac: 340,
            width: 2,
            height: 2,
            attachPoints: { top: true, bottom: false, left: false, right: false },
            unlockLevel: 7,
            color: '#775555',
            accentColor: '#ffccaa',
            description: 'Altitude compensating engine',
            tooltip: 'Efficient in both atmo and vacuum'
        },
        mammoth_engine: {
            id: 'mammoth_engine',
            name: 'Mammoth Engine',
            category: 'engines',
            mass: 3000,
            thrust: 1000, // Nerfed from 4000
            fuelConsumption: 50,
            isp: 295,
            ispASL: 260,
            ispVac: 295,
            width: 3,
            height: 3,
            attachPoints: { top: true, bottom: false, left: false, right: false },
            unlockLevel: 11,
            color: '#333333',
            accentColor: '#ff4400',
            description: 'Super-heavy lifter',
            tooltip: 'Massive thrust for huge rockets. Low efficiency'
        }
    },

    // ============================================
    // FUEL TANKS
    // ============================================
    fuel: {
        small_tank: {
            id: 'small_tank',
            name: 'Small Tank',
            category: 'fuel',
            mass: 100, // Dry
            fuelCapacity: 500, // Wet ~ 600kg total
            width: 1,
            height: 2,
            attachPoints: { top: true, bottom: true, left: false, right: false },
            unlockLevel: 0,
            color: '#ddddee',
            accentColor: '#aabbcc',
            description: 'Lightweight fuel tank',
            tooltip: 'Perfect for small rockets'
        },
        medium_tank: {
            id: 'medium_tank',
            name: 'Medium Tank',
            category: 'fuel',
            mass: 400,
            fuelCapacity: 2000, // ~2.4t total
            width: 2,
            height: 3,
            attachPoints: { top: true, bottom: true, left: false, right: false },
            unlockLevel: 2,
            color: '#ccccdd',
            accentColor: '#99aacc',
            description: 'Standard capacity fuel tank',
            tooltip: 'Balanced size and capacity'
        },
        large_tank: {
            id: 'large_tank',
            name: 'Large Tank',
            category: 'fuel',
            mass: 800,
            fuelCapacity: 5000, // ~5.8t total
            width: 2,
            height: 4,
            attachPoints: { top: true, bottom: true, left: true, right: true },
            unlockLevel: 4,
            color: '#bbbbcc',
            accentColor: '#8899bb',
            description: 'High-capacity main stage tank',
            tooltip: 'For heavy lifters reaching space'
        },
        radial_tank: {
            id: 'radial_tank',
            name: 'Radial Tank',
            category: 'fuel',
            mass: 150,
            fuelCapacity: 600,
            width: 1,
            height: 2,
            attachPoints: { top: false, bottom: false, left: true, right: true },
            unlockLevel: 6,
            color: '#ddddcc',
            accentColor: '#ff8844',
            description: 'Side-mounted fuel canister',
            tooltip: 'Mounts on sides for extra capacity'
        },
        tiny_tank: {
            id: 'tiny_tank',
            name: 'Tiny Tank',
            category: 'fuel',
            mass: 20,
            fuelCapacity: 100,
            width: 1,
            height: 1,
            attachPoints: { top: true, bottom: true, left: false, right: false },
            unlockLevel: 0,
            color: '#eeeeff',
            accentColor: '#aabbcc',
            description: 'Micro fuel tank',
            tooltip: 'Micro fuel tank. Specific for probes/ion drives'
        },
        huge_tank: {
            id: 'huge_tank',
            name: 'Huge Tank',
            category: 'fuel',
            mass: 3000,
            fuelCapacity: 15000, // ~18t total!
            width: 3,
            height: 5,
            attachPoints: { top: true, bottom: true, left: true, right: true },
            unlockLevel: 11,
            color: '#cccccc',
            accentColor: '#999999',
            description: 'Massive main stage tank',
            tooltip: 'For Mammoth engines'
        }
    },

    // ============================================
    // STRUCTURAL
    // ============================================
    structure: {
        small_nose_cone: {
            id: 'small_nose_cone',
            name: 'Small Nose Cone',
            category: 'structure',
            mass: 5,
            dragReduction: 0.2,
            width: 1,
            height: 1,
            attachPoints: { top: false, bottom: true, left: false, right: false },
            unlockLevel: 0,
            color: '#ff4444',
            accentColor: '#cc2222',
            description: 'Lightweight aerodynamic nose for small rockets',
            tooltip: 'Reduces drag by 20%. Perfect for 1-tile wide rockets'
        },
        nose_cone: {
            id: 'nose_cone',
            name: 'Nose Cone',
            category: 'structure',
            mass: 20,
            dragReduction: 0.3,
            width: 2,
            height: 2,
            attachPoints: { top: false, bottom: true, left: false, right: false },
            unlockLevel: 0,
            color: '#ee4444',
            accentColor: '#cc2222',
            description: 'Standard aerodynamic nose cone',
            tooltip: 'Reduces drag by 30%. Ideal for medium rockets'
        },
        small_fairing: {
            id: 'small_fairing',
            name: 'Small Fairing',
            category: 'structure',
            mass: 10,
            dragReduction: 0.3,
            width: 1,
            height: 2,
            attachPoints: { top: false, bottom: true, left: false, right: false },
            unlockLevel: 2,
            color: '#eeeeee',
            accentColor: '#ccddee',
            description: 'Compact payload fairing',
            tooltip: 'Protects small payloads. Reduces drag by 30%'
        },
        decoupler: {
            id: 'decoupler',
            name: 'Decoupler',
            category: 'structure',
            mass: 15,
            isDecoupler: true,
            width: 2,
            height: 1,
            attachPoints: { top: true, bottom: true, left: false, right: false },
            unlockLevel: 3,
            color: '#444466',
            accentColor: '#ffcc00',
            description: 'Stage separation mechanism',
            tooltip: 'Separates rocket stages. Essential for multi-stage designs'
        },
        strut: {
            id: 'strut',
            name: 'Strut',
            category: 'structure',
            mass: 5,
            width: 1,
            height: 1,
            attachPoints: { top: true, bottom: true, left: true, right: true },
            unlockLevel: 2,
            color: '#666666',
            accentColor: '#888888',
            description: 'Structural support beam',
            tooltip: 'Adds structural integrity. Connects to all sides'
        },
        fairing: {
            id: 'fairing',
            name: 'Fairing',
            category: 'structure',
            mass: 30,
            dragReduction: 0.5,
            width: 3,
            height: 3,
            attachPoints: { top: true, bottom: true, left: false, right: false },
            unlockLevel: 7,
            color: '#ffffff',
            accentColor: '#ddddee',
            description: 'Large payload protection fairing',
            tooltip: 'Heavy-duty payload protection. Reduces drag by 50%. Best for large rockets'
        }
    },

    // ============================================
    // CONTROL
    // ============================================
    control: {
        small_fins: {
            id: 'small_fins',
            name: 'Small Fins',
            category: 'control',
            mass: 10,
            stability: 0.2,
            width: 1,
            height: 1,
            attachPoints: { top: true, bottom: false, left: true, right: true },
            unlockLevel: 0,
            color: '#888899',
            accentColor: '#666677',
            description: 'Aerodynamic stabilizers',
            tooltip: 'Increases stability by 20%. Prevents rocket from tumbling'
        },
        large_fins: {
            id: 'large_fins',
            name: 'Large Fins',
            category: 'control',
            mass: 25,
            stability: 0.5,
            width: 2,
            height: 2,
            attachPoints: { top: true, bottom: false, left: true, right: true },
            unlockLevel: 4,
            color: '#777788',
            accentColor: '#555566',
            description: 'Heavy-duty stabilizers',
            tooltip: 'Increases stability by 50%. Essential for large rockets'
        },
        reaction_wheel: {
            id: 'reaction_wheel',
            name: 'Reaction Wheel',
            category: 'control',
            mass: 40,
            torque: 50,
            width: 1,
            height: 1,
            attachPoints: { top: true, bottom: true, left: true, right: true },
            unlockLevel: 8,
            color: '#333344',
            accentColor: '#00ffff',
            description: 'Active attitude control',
            tooltip: 'Provides 50Nm torque for precise control. Works in space'
        },
        gimbal: {
            id: 'gimbal',
            name: 'Gimbal Mount',
            category: 'control',
            mass: 30,
            gimbalRange: 15,
            width: 2,
            height: 1,
            attachPoints: { top: true, bottom: true, left: false, right: false },
            unlockLevel: 6,
            color: '#445566',
            accentColor: '#667788',
            description: 'Engine vectoring system',
            tooltip: '±15° gimbal range. Allows engine to pivot for thrust vectoring'
        }
    },

    // ============================================
    // PAYLOAD
    // ============================================
    payload: {
        crew_capsule: {
            id: 'crew_capsule',
            name: 'Crew Capsule',
            category: 'payload',
            mass: 500,
            isPayload: true,
            payloadValue: 100,
            width: 2,
            height: 2,
            attachPoints: { top: false, bottom: true, left: false, right: false },
            unlockLevel: 10,
            color: '#334455',
            accentColor: '#00ccff',
            description: 'Manned spacecraft',
            tooltip: 'Carries crew to space. High value (100pts). Very heavy'
        },
        satellite: {
            id: 'satellite',
            name: 'Satellite',
            category: 'payload',
            mass: 200,
            isPayload: true,
            payloadValue: 50,
            width: 2,
            height: 2,
            attachPoints: { top: false, bottom: true, left: false, right: false },
            unlockLevel: 5,
            color: '#225588',
            accentColor: '#44aaff',
            description: 'Communications satellite',
            tooltip: 'Medium payload (50pts). Orbital deployment'
        },
        probe: {
            id: 'probe',
            name: 'Probe',
            category: 'payload',
            mass: 100,
            isPayload: true,
            payloadValue: 30,
            width: 1,
            height: 2,
            attachPoints: { top: false, bottom: true, left: false, right: false },
            unlockLevel: 0,
            color: '#447755',
            accentColor: '#66aa77',
            description: 'Unmanned science probe',
            tooltip: 'Lightweight payload (30pts). Good for testing'
        },
        cargo_bay: {
            id: 'cargo_bay',
            name: 'Cargo Bay',
            category: 'payload',
            mass: 50,
            isPayload: true,
            payloadValue: 20,
            width: 2,
            height: 2,
            attachPoints: { top: true, bottom: true, left: false, right: false },
            unlockLevel: 3,
            color: '#556666',
            accentColor: '#778888',
            description: 'Cargo storage module',
            tooltip: 'Small payload (20pts). Can stack parts. Connects top/bottom'
        },
        habitation_module: {
            id: 'habitation_module',
            name: 'Habitation Module',
            category: 'payload',
            mass: 1500,
            isPayload: true,
            payloadValue: 200,
            width: 3,
            height: 3,
            attachPoints: { top: true, bottom: true, left: false, right: false },
            unlockLevel: 12,
            color: '#ccccdd',
            accentColor: '#ffaa44',
            description: 'Long-term space habitaiton',
            tooltip: 'Massive payload (200pts). Requires heavy lifting capability'
        }
    },

    // ============================================
    // UTILITY
    // ============================================
    utility: {
        docking_port: {
            id: 'docking_port',
            name: 'Docking Port',
            category: 'utility',
            mass: 50,
            width: 1,
            height: 1,
            attachPoints: { top: true, bottom: true, left: false, right: false },
            unlockLevel: 6,
            color: '#888899',
            accentColor: '#ffffff',
            description: 'Standard docking interface',
            tooltip: 'Allows spacecraft connection'
        },
        solar_panel: {
            id: 'solar_panel',
            name: 'Solar Panel',
            category: 'utility',
            mass: 20,
            width: 1,
            height: 2,
            attachPoints: { top: false, bottom: false, left: true, right: true },
            unlockLevel: 2,
            color: '#223344',
            accentColor: '#0066aa',
            description: 'Deployable solar array',
            tooltip: 'Generates power (visual only). Side mount'
        }
    }
};

// Tile size in pixels
const TILE_SIZE = 32;

/**
 * Get all parts as a flat array
 */
function getAllParts() {
    const allParts = [];
    for (const category in PARTS) {
        for (const partId in PARTS[category]) {
            allParts.push(PARTS[category][partId]);
        }
    }
    return allParts;
}

/**
 * Get parts by category
 */
function getPartsByCategory(category) {
    return PARTS[category] ? Object.values(PARTS[category]) : [];
}

/**
 * Get a specific part by ID
 */
function getPartById(partId) {
    for (const category in PARTS) {
        if (PARTS[category][partId]) {
            return PARTS[category][partId];
        }
    }
    return null;
}

/**
 * Check if a part is unlocked
 */
function isPartUnlocked(partId, currentLevel, isFunMode = false, isAdvancedMode = false) {
    // Fun and Advanced modes unlock all parts
    if (isFunMode || isAdvancedMode) return true;
    const part = getPartById(partId);
    return part && currentLevel >= part.unlockLevel;
}

/**
 * Draw a part on canvas (enhanced pixel art style)
 */
function drawPart(ctx, part, x, y, scale = 1, flipX = false) {
    const w = part.width * TILE_SIZE * scale;
    const h = part.height * TILE_SIZE * scale;
    const pixelSize = Math.max(1, 2 * scale); // Pixel size for details

    ctx.save();

    // Apply horizontal flip if requested
    if (flipX) {
        ctx.translate(x + w / 2, y + h / 2);
        ctx.scale(-1, 1);
        ctx.translate(-(x + w / 2), -(y + h / 2));
    }

    ctx.imageSmoothingEnabled = false;

    // Helper for drawing pixel details
    const drawPixel = (px, py, color) => {
        ctx.fillStyle = color;
        ctx.fillRect(x + px * pixelSize, y + py * pixelSize, pixelSize, pixelSize);
    };

    // Lighter and darker versions of main color
    const lighten = (hex, amt) => {
        const num = parseInt(hex.slice(1), 16);
        const r = Math.min(255, (num >> 16) + amt);
        const g = Math.min(255, ((num >> 8) & 0xff) + amt);
        const b = Math.min(255, (num & 0xff) + amt);
        return `rgb(${r},${g},${b})`;
    };
    const darken = (hex, amt) => lighten(hex, -amt);

    switch (part.category) {
        case 'engines':
            // Common Engine Body Gradient
            const engGrad = ctx.createLinearGradient(x, y, x + w, y);
            engGrad.addColorStop(0, darken(part.color, 30));
            engGrad.addColorStop(0.3, lighten(part.color, 20));
            engGrad.addColorStop(0.5, part.color);
            engGrad.addColorStop(0.7, lighten(part.color, 20));
            engGrad.addColorStop(1, darken(part.color, 30));

            if (part.id === 'ion_drive') {
                // Ion Drive (1x1) - High Tech Cube
                // Body
                ctx.fillStyle = engGrad;
                ctx.fillRect(x, y, w, h * 0.7);

                // Grate texture
                ctx.fillStyle = '#111';
                ctx.fillRect(x + w * 0.15, y + h * 0.7, w * 0.7, h * 0.2);

                // Ion Glow (Pixelated)
                ctx.fillStyle = '#00ffff';
                const glowW = w * 0.5;
                const glowX = x + (w - glowW) / 2;
                ctx.fillRect(glowX, y + h * 0.75, glowW, h * 0.2);

                // Panel lines
                ctx.fillStyle = darken(part.color, 50);
                ctx.fillRect(x, y + h * 0.3, w, pixelSize);

            } else if (part.id === 'aerospike') {
                // Aerospike (2x2) - V shape integrated
                // Base housing
                ctx.fillStyle = engGrad;
                ctx.fillRect(x, y, w, h * 0.4);

                // Spike (Conical)
                const spikeGrad = ctx.createLinearGradient(x + w * 0.25, y, x + w * 0.75, y);
                spikeGrad.addColorStop(0, '#444');
                spikeGrad.addColorStop(0.5, '#999');
                spikeGrad.addColorStop(1, '#444');
                ctx.fillStyle = spikeGrad;

                ctx.beginPath();
                ctx.moveTo(x + w * 0.25, y + h * 0.4);
                ctx.lineTo(x + w * 0.5, y + h); // Tip
                ctx.lineTo(x + w * 0.75, y + h * 0.4);
                ctx.fill();

                // Combustion Chamber Ring
                ctx.fillStyle = '#222';
                ctx.fillRect(x + w * 0.2, y + h * 0.4, w * 0.6, h * 0.1);

            } else if (part.id === 'mammoth_engine') {
                // Mammoth (3x3) - Cluster of 4 bells
                // Upper Thrust Structure
                ctx.fillStyle = engGrad;
                ctx.fillRect(x, y, w, h * 0.5);

                // Heavy Ribbing
                ctx.fillStyle = darken(part.color, 40);
                ctx.fillRect(x, y + h * 0.1, w, pixelSize * 2);
                ctx.fillRect(x, y + h * 0.3, w, pixelSize * 2);

                // 4 Bells (Approximated as 2 wide matching ones for 2D, or 4 small ones)
                // Let's do 2 large bells visually to represent the cluster in side profile
                const bellW = w * 0.35;
                const bellH = h * 0.5;
                const positions = [x + w * 0.1, x + w * 0.55];

                positions.forEach(bx => {
                    // Nozzle Bell Gradient
                    const bellGrad = ctx.createLinearGradient(bx, y, bx + bellW, y);
                    bellGrad.addColorStop(0, '#222');
                    bellGrad.addColorStop(0.5, '#666');
                    bellGrad.addColorStop(1, '#222');
                    ctx.fillStyle = bellGrad;

                    ctx.beginPath();
                    ctx.moveTo(bx + bellW * 0.2, y + h * 0.5);
                    ctx.lineTo(bx, y + h);
                    ctx.lineTo(bx + bellW, y + h);
                    ctx.lineTo(bx + bellW * 0.8, y + h * 0.5);
                    ctx.fill();

                    // Inner dark
                    ctx.fillStyle = '#111';
                    ctx.beginPath();
                    ctx.moveTo(bx + bellW * 0.3, y + h * 0.5);
                    ctx.lineTo(bx + bellW * 0.1, y + h);
                    ctx.lineTo(bx + bellW * 0.9, y + h);
                    ctx.lineTo(bx + bellW * 0.7, y + h * 0.5);
                    ctx.fill();
                });

            } else {
                // Standard Engine rendering
                const engGrad = ctx.createLinearGradient(x, y, x + w, y);
                engGrad.addColorStop(0, darken(part.color, 30));
                engGrad.addColorStop(0.3, lighten(part.color, 20));
                engGrad.addColorStop(0.5, part.color);
                engGrad.addColorStop(0.7, lighten(part.color, 20));
                engGrad.addColorStop(1, darken(part.color, 30));
                ctx.fillStyle = engGrad;
                ctx.fillRect(x, y, w, h * 0.6);

                // Nozzle bell
                ctx.fillStyle = part.accentColor;
                ctx.beginPath();
                ctx.moveTo(x + w * 0.2, y + h * 0.6);
                ctx.lineTo(x + w * 0.1, y + h);
                ctx.lineTo(x + w * 0.9, y + h);
                ctx.lineTo(x + w * 0.8, y + h * 0.6);
                ctx.closePath();
                ctx.fill();

                // Nozzle inner dark
                ctx.fillStyle = '#222222';
                ctx.beginPath();
                ctx.moveTo(x + w * 0.3, y + h * 0.65);
                ctx.lineTo(x + w * 0.25, y + h * 0.95);
                ctx.lineTo(x + w * 0.75, y + h * 0.95);
                ctx.lineTo(x + w * 0.7, y + h * 0.65);
                ctx.closePath();
                ctx.fill();

                // Highlights
                ctx.fillStyle = 'rgba(255,255,255,0.4)';
                ctx.fillRect(x + pixelSize, y + pixelSize, w * 0.2, h * 0.1);

                // Mounting bolts
                ctx.fillStyle = '#333344';
                for (let i = 0; i < 3; i++) {
                    ctx.fillRect(x + w * 0.2 + i * w * 0.25, y + h * 0.55, pixelSize * 2, pixelSize * 2);
                }
            }
            break;

        case 'fuel':
            // Tank body gradient (cylindrical look)
            const tankGrad = ctx.createLinearGradient(x, y, x + w, y);
            tankGrad.addColorStop(0, darken(part.color, 40));
            tankGrad.addColorStop(0.15, darken(part.color, 20));
            tankGrad.addColorStop(0.35, lighten(part.color, 30));
            tankGrad.addColorStop(0.5, lighten(part.color, 40));
            tankGrad.addColorStop(0.65, lighten(part.color, 30));
            tankGrad.addColorStop(0.85, darken(part.color, 20));
            tankGrad.addColorStop(1, darken(part.color, 40));
            ctx.fillStyle = tankGrad;
            ctx.fillRect(x, y, w, h);

            // Tank stripes/bands
            ctx.fillStyle = part.accentColor;
            const bandH = h * 0.08;
            ctx.fillRect(x, y + h * 0.15, w, bandH);
            ctx.fillRect(x, y + h * 0.8, w, bandH);

            // Extra detailing for Huge Tank
            if (part.id === 'huge_tank') {
                ctx.fillRect(x, y + h * 0.5, w, bandH); // Middle band
                // Vertical pipes
                ctx.fillStyle = '#444';
                ctx.fillRect(x + w * 0.1, y, w * 0.05, h);
                ctx.fillRect(x + w * 0.9, y, w * 0.05, h);
            }

            // Rivets along bands
            ctx.fillStyle = darken(part.accentColor, 30);
            const rivetSpacing = w / 5;
            for (let i = 1; i < 5; i++) {
                ctx.fillRect(x + i * rivetSpacing - pixelSize / 2, y + h * 0.15 + bandH / 2 - pixelSize / 2, pixelSize, pixelSize);
                ctx.fillRect(x + i * rivetSpacing - pixelSize / 2, y + h * 0.8 + bandH / 2 - pixelSize / 2, pixelSize, pixelSize);
            }

            // Vertical highlight
            ctx.fillStyle = 'rgba(255,255,255,0.15)';
            ctx.fillRect(x + w * 0.15, y + pixelSize * 2, pixelSize * 2, h - pixelSize * 4);

            // Panel lines
            ctx.strokeStyle = darken(part.color, 50);
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(x, y + h * 0.5);
            ctx.lineTo(x + w, y + h * 0.5);
            ctx.stroke();
            break;

        case 'structure':
            if (part.id === 'nose_cone' || part.id === 'small_nose_cone') {
                // Nose cone with smooth gradient
                const noseGrad = ctx.createLinearGradient(x, y, x + w, y);
                noseGrad.addColorStop(0, darken(part.color, 30));
                noseGrad.addColorStop(0.3, lighten(part.color, 20));
                noseGrad.addColorStop(0.5, part.color);
                noseGrad.addColorStop(1, darken(part.color, 30));
                ctx.fillStyle = noseGrad;
                ctx.beginPath();
                ctx.moveTo(x + w / 2, y);
                ctx.quadraticCurveTo(x + w * 0.3, y + h * 0.3, x, y + h);
                ctx.lineTo(x + w, y + h);
                ctx.quadraticCurveTo(x + w * 0.7, y + h * 0.3, x + w / 2, y);
                ctx.closePath();
                ctx.fill();

                // Tip highlight
                ctx.fillStyle = 'rgba(255,255,255,0.5)';
                ctx.beginPath();
                ctx.arc(x + w / 2 - pixelSize, y + pixelSize * 2, pixelSize * 1.5, 0, Math.PI * 2);
                ctx.fill();

                // Edge highlight
                ctx.fillStyle = 'rgba(255,255,255,0.2)';
                ctx.beginPath();
                ctx.moveTo(x + w * 0.4, y + h * 0.1);
                ctx.quadraticCurveTo(x + w * 0.25, y + h * 0.5, x + pixelSize, y + h);
                ctx.lineTo(x + w * 0.15, y + h);
                ctx.quadraticCurveTo(x + w * 0.3, y + h * 0.4, x + w * 0.45, y + h * 0.1);
                ctx.closePath();
                ctx.fill();
            } else if (part.id === 'small_fairing') {
                // Small fairing - simplified version of large fairing
                const fairingGrad = ctx.createLinearGradient(x, y, x + w, y);
                fairingGrad.addColorStop(0, darken(part.color, 20));
                fairingGrad.addColorStop(0.5, part.color);
                fairingGrad.addColorStop(1, darken(part.color, 20));
                ctx.fillStyle = fairingGrad;

                // Tapered sides
                ctx.beginPath();
                ctx.moveTo(x + w * 0.2, y);
                ctx.lineTo(x, y + h * 0.3);
                ctx.lineTo(x, y + h);
                ctx.lineTo(x + w, y + h);
                ctx.lineTo(x + w, y + h * 0.3);
                ctx.lineTo(x + w * 0.8, y);
                ctx.closePath();
                ctx.fill();

                // Panel lines
                ctx.strokeStyle = part.accentColor;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(x + w * 0.5, y);
                ctx.lineTo(x + w * 0.5, y + h);
                ctx.stroke();
            } else if (part.id === 'decoupler') {
                // Decoupler body
                ctx.fillStyle = part.color;
                ctx.fillRect(x, y, w, h);

                // Separation line (yellow/black hazard stripe)
                const stripeW = w / 10;
                for (let i = 0; i < 10; i++) {
                    ctx.fillStyle = i % 2 === 0 ? '#ffcc00' : '#222222';
                    ctx.fillRect(x + i * stripeW, y + h * 0.35, stripeW, h * 0.3);
                }
            } else if (part.id === 'fairing') {
                // Large Fairing (3x3) - Ogive shape
                const fairingGrad = ctx.createLinearGradient(x, y, x + w, y);
                fairingGrad.addColorStop(0, darken(part.color, 30));
                fairingGrad.addColorStop(0.3, part.color);
                fairingGrad.addColorStop(0.7, lighten(part.color, 20));
                fairingGrad.addColorStop(1, darken(part.color, 30));
                ctx.fillStyle = fairingGrad;

                ctx.beginPath();
                ctx.moveTo(x, y + h); // Bottom Left
                // Left Curve: Control at Top Left corner, End at Top Center
                ctx.quadraticCurveTo(x, y, x + w / 2, y);
                // Right Curve: Control at Top Right corner, End at Bottom Right
                ctx.quadraticCurveTo(x + w, y, x + w, y + h);
                ctx.closePath();
                ctx.fill();

                // Vertical Split Line
                ctx.strokeStyle = 'rgba(0,0,0,0.3)';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(x + w * 0.5, y);
                ctx.lineTo(x + w * 0.5, y + h);
                ctx.stroke();

                // Horizontal reinforced band
                ctx.fillStyle = 'rgba(0,0,0,0.1)';
                ctx.fillRect(x + w * 0.1, y + h * 0.85, w * 0.8, h * 0.05);

            } else {
                // Generic structure
                ctx.fillStyle = part.color;
                ctx.fillRect(x, y, w, h);
                ctx.strokeStyle = darken(part.color, 40);
                ctx.lineWidth = 2 * scale;
                ctx.strokeRect(x, y, w, h);
            }
            break;

        case 'control':
            if (part.id === 'small_fins') {
                // Small delta fins (Width 1)
                ctx.beginPath();
                ctx.moveTo(x, y); // Top Left (attached)
                ctx.lineTo(x + w, y + h); // Tip (Bottom Right)
                ctx.lineTo(x, y + h); // Bottom Left
                ctx.closePath();

                // Metallic Gradient
                const finGrad = ctx.createLinearGradient(x, y, x + w, y + h);
                finGrad.addColorStop(0, '#666');
                finGrad.addColorStop(0.5, '#bbb');
                finGrad.addColorStop(1, '#666');
                ctx.fillStyle = finGrad;
                ctx.fill();

                // Leading Edge
                ctx.strokeStyle = '#fff';
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.lineTo(x + w, y + h);
                ctx.stroke();

            } else if (part.id === 'large_fins') {
                // Large swept wings (Width 2)
                ctx.beginPath();
                ctx.moveTo(x, y); // Top Left (Root)
                ctx.lineTo(x + w * 0.5, y); // Start of sweep
                ctx.lineTo(x + w, y + h * 0.8); // Tip Top
                ctx.lineTo(x + w, y + h); // Tip Bottom
                ctx.lineTo(x, y + h); // Bottom Left (Root)
                ctx.closePath();

                // Gradient
                const lgFinGrad = ctx.createLinearGradient(x, y, x + w, y + h);
                lgFinGrad.addColorStop(0, '#555');
                lgFinGrad.addColorStop(0.5, '#999');
                lgFinGrad.addColorStop(1, '#444');
                ctx.fillStyle = lgFinGrad;
                ctx.fill();

                // Control Surface (Flap)
                ctx.fillStyle = part.accentColor || '#d00';
                ctx.fillRect(x + w * 0.6, y + h * 0.85, w * 0.4, h * 0.15);

                // Panel Lines
                ctx.strokeStyle = '#333';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(x + w * 0.5, y);
                ctx.lineTo(x + w * 0.5, y + h);
                ctx.stroke();

            } else if (part.id === 'reaction_wheel') {
                // Background Frame
                ctx.fillStyle = '#2a2a2a';
                ctx.fillRect(x, y, w, h);

                // Gold Flywheel
                ctx.fillStyle = '#ffb300';
                ctx.beginPath();
                ctx.arc(x + w / 2, y + h / 2, w * 0.4, 0, Math.PI * 2);
                ctx.fill();

                // Spokes (Spinning look)
                ctx.strokeStyle = '#805500';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(x + w / 2, y + h * 0.1);
                ctx.lineTo(x + w / 2, y + h * 0.9);
                ctx.moveTo(x + w * 0.1, y + h / 2);
                ctx.lineTo(x + w * 0.9, y + h / 2);
                ctx.stroke();

                // Glass Reflection
                ctx.fillStyle = 'rgba(200, 240, 255, 0.2)';
                ctx.beginPath();
                ctx.arc(x + w / 2, y + h / 2, w * 0.4, -Math.PI / 4, Math.PI / 2);
                ctx.fill();

            } else if (part.id === 'gimbal') {
                // Gimbal Mount
                // Top Plate
                ctx.fillStyle = '#444';
                ctx.fillRect(x, y, w, h * 0.25);
                // Bottom Plate
                ctx.fillRect(x, y + h * 0.75, w, h * 0.25);

                // Pivot Sphere
                const pivotGrad = ctx.createRadialGradient(x + w / 2, y + h / 2, 0, x + w / 2, y + h / 2, w * 0.3);
                pivotGrad.addColorStop(0, '#eee');
                pivotGrad.addColorStop(1, '#333');
                ctx.fillStyle = pivotGrad;
                ctx.beginPath();
                ctx.arc(x + w / 2, y + h / 2, w * 0.25, 0, Math.PI * 2);
                ctx.fill();

                // Hydraulic Pistons
                ctx.fillStyle = '#999';
                // Left
                ctx.fillRect(x + w * 0.15, y + h * 0.25, w * 0.1, h * 0.5);
                // Right
                ctx.fillRect(x + w * 0.75, y + h * 0.25, w * 0.1, h * 0.5);

            } else {
                // Fallback Generic
                ctx.fillStyle = part.color;
                ctx.fillRect(x, y, w, h);
                ctx.fillStyle = part.accentColor;
                ctx.fillRect(x + w * 0.25, y + h * 0.25, w * 0.5, h * 0.5);
            }
            break;

        case 'utility':
        case 'payload':
            // HAB MODULE
            if (part.id === 'habitation_module') {
                // Hab Module (3x3) - Space Station vibe
                // Cylinder body gradient
                const habGrad = ctx.createLinearGradient(x, y, x + w, y);
                habGrad.addColorStop(0, '#aaa');
                habGrad.addColorStop(0.5, '#eee');
                habGrad.addColorStop(1, '#aaa');
                ctx.fillStyle = habGrad;
                ctx.beginPath();
                ctx.roundRect(x, y, w, h, 2 * scale); // Less rounded, more module-like
                ctx.fill();

                // Structural Rings
                ctx.fillStyle = '#999';
                ctx.fillRect(x, y + h * 0.2, w, pixelSize * 2);
                ctx.fillRect(x, y + h * 0.8, w, pixelSize * 2);

                // Windows (Dark with blue reflection)
                ctx.fillStyle = '#223';
                ctx.beginPath();
                ctx.arc(x + w * 0.5, y + h * 0.5, w * 0.15, 0, Math.PI * 2); // Center window
                ctx.fill();

                // Reflection dot
                ctx.fillStyle = 'rgba(200, 240, 255, 0.4)';
                ctx.beginPath();
                ctx.arc(x + w * 0.5 - w * 0.05, y + h * 0.5 - h * 0.05, w * 0.03, 0, Math.PI * 2);
                ctx.fill();

                // Ring of windows
                for (let i = 0; i < 8; i++) {
                    const angle = (i / 8) * Math.PI * 2;
                    const wx = x + w * 0.5 + Math.cos(angle) * w * 0.35;
                    const wy = y + h * 0.5 + Math.sin(angle) * h * 0.35;
                    ctx.fillStyle = '#223';
                    ctx.beginPath();
                    ctx.arc(wx, wy, w * 0.05, 0, Math.PI * 2);
                    ctx.fill();
                }
                break;
            }

            // SOLAR PANEL
            if (part.id === 'solar_panel') {
                // Frame
                ctx.fillStyle = '#222';
                ctx.fillRect(x, y, w, h);

                // Solar Cells (Dark Blue with slight gradient)
                const cellGrad = ctx.createLinearGradient(x, y, x + w, y + h);
                cellGrad.addColorStop(0, '#113355');
                cellGrad.addColorStop(1, '#001133');
                ctx.fillStyle = cellGrad;
                ctx.fillRect(x + pixelSize, y + pixelSize, w - pixelSize * 2, h - pixelSize * 2);

                // Grid lines (Thicker, darker)
                ctx.strokeStyle = '#000';
                ctx.lineWidth = 1;
                ctx.beginPath();
                // Vertical split
                ctx.moveTo(x + w / 2, y);
                ctx.lineTo(x + w / 2, y + h);
                // Horizontal splits
                ctx.moveTo(x, y + h / 3);
                ctx.lineTo(x + w, y + h / 3);
                ctx.moveTo(x, y + 2 * h / 3);
                ctx.lineTo(x + w, y + 2 * h / 3);
                ctx.stroke();

                // Highlight edge
                ctx.strokeStyle = '#445566';
                ctx.lineWidth = 1;
                ctx.strokeRect(x, y, w, h);
                break;
            }

            // Base with gradient (Generic Payloads)
            const payloadGrad = ctx.createLinearGradient(x, y, x + w, y);
            payloadGrad.addColorStop(0, darken(part.color, 30));
            payloadGrad.addColorStop(0.35, lighten(part.color, 20));
            payloadGrad.addColorStop(0.5, part.color);
            payloadGrad.addColorStop(1, darken(part.color, 30));
            ctx.fillStyle = payloadGrad;

            // Draw rect unless it's a specific shape (docking port handled below)
            if (part.id !== 'docking_port') {
                ctx.fillRect(x, y, w, h);
            }

            // Windows/lights (glowing effect matching style)
            ctx.fillStyle = part.accentColor;
            const windowSize = pixelSize * 2;

            if (part.id === 'crew_capsule') {
                // Multiple windows
                ctx.fillStyle = '#333'; // Dark glass
                ctx.fillRect(x + w * 0.2, y + h * 0.3, windowSize, windowSize);
                ctx.fillRect(x + w * 0.5 - windowSize / 2, y + h * 0.3, windowSize, windowSize);
                ctx.fillRect(x + w * 0.8 - windowSize, y + h * 0.3, windowSize, windowSize);

                // Glint
                ctx.fillStyle = '#aaf';
                ctx.fillRect(x + w * 0.2 + 1, y + h * 0.3 + 1, 1, 1);
                ctx.fillRect(x + w * 0.5 - windowSize / 2 + 1, y + h * 0.3 + 1, 1, 1);
                ctx.fillRect(x + w * 0.8 - windowSize + 1, y + h * 0.3 + 1, 1, 1);

            } else if (part.id === 'docking_port') {
                // Docking port - Mechanical Ring
                // Outer ring
                ctx.fillStyle = '#888';
                ctx.beginPath();
                ctx.arc(x + w / 2, y + h / 2, w * 0.45, 0, Math.PI * 2);
                ctx.fill();

                // Inner dark area
                ctx.fillStyle = '#222';
                ctx.beginPath();
                ctx.arc(x + w / 2, y + h / 2, w * 0.35, 0, Math.PI * 2);
                ctx.fill();

                // Docking mechanism cross
                ctx.strokeStyle = '#555';
                ctx.lineWidth = 2 * scale;
                ctx.beginPath();
                ctx.moveTo(x + w * 0.2, y + h / 2);
                ctx.lineTo(x + w * 0.8, y + h / 2);
                ctx.moveTo(x + w / 2, y + h * 0.2);
                ctx.lineTo(x + w / 2, y + h * 0.8);
                ctx.stroke();

                // Latch details (dots around ring)
                ctx.fillStyle = '#aa0';
                for (let i = 0; i < 4; i++) {
                    const angle = (i / 4) * Math.PI * 2 + (Math.PI / 4);
                    const dx = x + w / 2 + Math.cos(angle) * w * 0.4;
                    const dy = y + h / 2 + Math.sin(angle) * w * 0.4;
                    ctx.beginPath();
                    ctx.arc(dx, dy, 2 * scale, 0, Math.PI * 2);
                    ctx.fill();
                }

            } else {
                // Single indicator
                ctx.fillStyle = part.accentColor;
                ctx.shadowColor = part.accentColor;
                ctx.shadowBlur = 5 * scale;
                ctx.fillRect(x + w / 2 - windowSize / 2, y + h * 0.3, windowSize, windowSize);
                ctx.shadowBlur = 0;
            }

            // Panel detail lines
            ctx.strokeStyle = darken(part.color, 40);
            ctx.lineWidth = 1;
            if (part.id !== 'docking_port') {
                ctx.strokeRect(x + 2, y + 2, w - 4, h - 4);
            }
            break;
    }

    // Common outline
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = Math.max(1, 2 * scale);

    if (part.id !== 'nose_cone' && part.id !== 'docking_port' && part.id !== 'habitation_module' && part.id !== 'solar_panel') {
        ctx.strokeRect(x, y, w, h);
    }

    ctx.restore();
}

/**
 * Create a part icon for the parts panel
 */
function createPartIcon(part) {
    const canvas = document.createElement('canvas');
    const size = 32;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    const scale = Math.min(size / (part.width * TILE_SIZE), size / (part.height * TILE_SIZE)) * 0.8;
    const drawW = part.width * TILE_SIZE * scale;
    const drawH = part.height * TILE_SIZE * scale;
    const offsetX = (size - drawW) / 2;
    const offsetY = (size - drawH) / 2;

    drawPart(ctx, part, offsetX, offsetY, scale);

    return canvas.toDataURL();
}
