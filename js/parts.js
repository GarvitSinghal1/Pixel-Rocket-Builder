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
            description: 'Long-term space habitation',
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
    const pixelSize = Math.max(1, 1 * scale); // Finer details

    ctx.save();

    if (flipX) {
        ctx.translate(x + w, y);
        ctx.scale(-1, 1);
        ctx.translate(-x, -y);
    }

    ctx.imageSmoothingEnabled = false;

    // --- Color Helpers ---
    const lighten = (hex, amt) => {
        if(!hex) return '#ffffff';
        const num = parseInt(hex.replace('#', ''), 16);
        const r = Math.min(255, (num >> 16) + amt);
        const g = Math.min(255, ((num >> 8) & 0xff) + amt);
        const b = Math.min(255, (num & 0xff) + amt);
        return `rgb(${r},${g},${b})`;
    };
    const darken = (hex, amt) => lighten(hex, -amt);

    const baseColor = part.color || '#cccccc';
    const accentColor = part.accentColor || '#ff8800';
    
    // --- Drawing Helpers ---
    const drawCylinder = (cx, cy, cw, ch, mainColor, vertical = true) => {
        const grad = vertical ? ctx.createLinearGradient(cx, cy, cx + cw, cy) : ctx.createLinearGradient(cx, cy, cx, cy + ch);
        grad.addColorStop(0, darken(mainColor, 60));
        grad.addColorStop(0.1, darken(mainColor, 20));
        grad.addColorStop(0.4, lighten(mainColor, 30));
        grad.addColorStop(0.5, lighten(mainColor, 50)); // Specular highlight
        grad.addColorStop(0.6, lighten(mainColor, 20));
        grad.addColorStop(0.85, darken(mainColor, 10));
        grad.addColorStop(1, darken(mainColor, 50));
        ctx.fillStyle = grad;
        ctx.fillRect(cx, cy, cw, ch);
    };

    const drawPanelDetails = (cx, cy, cw, ch, color) => {
        ctx.strokeStyle = darken(color, 50);
        ctx.lineWidth = pixelSize;
        ctx.strokeRect(cx + pixelSize*2, cy + pixelSize*2, cw - pixelSize*4, ch - pixelSize*4);
        
        ctx.strokeStyle = lighten(color, 40);
        ctx.beginPath();
        ctx.moveTo(cx + pixelSize*2, cy + ch - pixelSize*2);
        ctx.lineTo(cx + pixelSize*2, cy + pixelSize*2);
        ctx.lineTo(cx + cw - pixelSize*2, cy + pixelSize*2);
        ctx.stroke();
    };

    const drawRivets = (cx, cy, cw, ch, isVertical) => {
        ctx.fillStyle = darken(baseColor, 70);
        const padding = w * 0.1;
        const spacing = w * 0.2;
        if (isVertical) {
            for (let i = padding; i < ch - padding; i += spacing) {
                ctx.fillRect(cx + cw/2 - pixelSize, cy + i, pixelSize*2, pixelSize*2);
            }
        } else {
            for (let i = padding; i < cw - padding; i += spacing) {
                ctx.fillRect(cx + i, cy + ch/2 - pixelSize, pixelSize*2, pixelSize*2);
            }
        }
    };

    switch (part.category) {
        case 'engines':
            drawCylinder(x, y, w, h * 0.55, baseColor);
            drawPanelDetails(x, y, w, h * 0.55, baseColor);
            
            // Ribbed Combustion Chamber
            const ribH = h * 0.15;
            const ribY = y + h * 0.55;
            drawCylinder(x + w * 0.1, ribY, w * 0.8, ribH, darken(baseColor, 40));
            ctx.fillStyle = darken(baseColor, 80);
            for(let i = 0; i < 4; i++) {
                ctx.fillRect(x + w * 0.1, ribY + i * (ribH/4), w * 0.8, pixelSize*1.5);
            }

            if (part.id === 'ion_drive') {
                drawCylinder(x, y, w, h * 0.7, baseColor);
                
                ctx.fillStyle = '#00ffff';
                ctx.shadowColor = '#00ffff';
                ctx.shadowBlur = pixelSize * 5;
                ctx.fillRect(x + w * 0.2, y + h * 0.2, w * 0.6, pixelSize*2);
                ctx.fillRect(x + w * 0.2, y + h * 0.4, w * 0.6, pixelSize*2);
                ctx.shadowBlur = 0;

                const glowW = w * 0.6;
                const glowX = x + (w - glowW) / 2;
                const ionGrad = ctx.createLinearGradient(x, y + h * 0.7, x, y + h);
                ionGrad.addColorStop(0, '#00ffff');
                ionGrad.addColorStop(1, 'rgba(0, 255, 255, 0)');
                ctx.fillStyle = ionGrad;
                ctx.fillRect(glowX, y + h * 0.7, glowW, h * 0.3);

                ctx.strokeStyle = '#005555';
                ctx.lineWidth = pixelSize;
                ctx.strokeRect(glowX, y + h * 0.7, glowW, h * 0.1);

            } else if (part.id === 'mammoth_engine') {
                drawCylinder(x, y, w, h * 0.4, baseColor);
                drawRivets(x, y + h * 0.1, w, h * 0.1, false);
                drawRivets(x, y + h * 0.3, w, h * 0.1, false);

                const bellW = w * 0.45;
                const positions = [x + w * 0.02, x + w * 0.53];

                positions.forEach(bx => {
                    const bellGrad = ctx.createLinearGradient(bx, y, bx + bellW, y);
                    bellGrad.addColorStop(0, '#1a1a1a');
                    bellGrad.addColorStop(0.3, '#4a4a4a');
                    bellGrad.addColorStop(0.5, '#7a7a7a');
                    bellGrad.addColorStop(0.8, '#3a3a3a');
                    bellGrad.addColorStop(1, '#111111');
                    ctx.fillStyle = bellGrad;

                    ctx.beginPath();
                    ctx.moveTo(bx + bellW * 0.3, y + h * 0.4);
                    ctx.quadraticCurveTo(bx + bellW * 0.2, y + h * 0.7, bx, y + h);
                    ctx.lineTo(bx + bellW, y + h);
                    ctx.quadraticCurveTo(bx + bellW * 0.8, y + h * 0.7, bx + bellW * 0.7, y + h * 0.4);
                    ctx.fill();

                    const innerGlowGrad = ctx.createLinearGradient(bx, y + h * 0.8, bx, y + h);
                    innerGlowGrad.addColorStop(0, '#050505');
                    innerGlowGrad.addColorStop(1, '#ff4400');
                    ctx.fillStyle = innerGlowGrad;
                    ctx.beginPath();
                    ctx.moveTo(bx + bellW * 0.4, y + h * 0.4);
                    ctx.lineTo(bx + bellW * 0.1, y + h);
                    ctx.lineTo(bx + bellW * 0.9, y + h);
                    ctx.lineTo(bx + bellW * 0.6, y + h * 0.4);
                    ctx.fill();
                    
                    ctx.fillStyle = '#555';
                    ctx.fillRect(bx, y + h - pixelSize*3, bellW, pixelSize*3);
                });

            } else {
                const bellGrad = ctx.createLinearGradient(x, y, x + w, y);
                bellGrad.addColorStop(0, '#1a1a1a');
                bellGrad.addColorStop(0.4, '#555');
                bellGrad.addColorStop(0.5, '#888');
                bellGrad.addColorStop(0.7, '#333');
                bellGrad.addColorStop(1, '#0a0a0a');
                ctx.fillStyle = bellGrad;

                ctx.beginPath();
                ctx.moveTo(x + w * 0.2, y + h * 0.7);
                ctx.quadraticCurveTo(x + w * 0.15, y + h * 0.85, x, y + h);
                ctx.lineTo(x + w, y + h);
                ctx.quadraticCurveTo(x + w * 0.85, y + h * 0.85, x + w * 0.8, y + h * 0.7);
                ctx.closePath();
                ctx.fill();

                const innerGrad = ctx.createLinearGradient(x + w * 0.2, y + h * 0.7, x + w * 0.8, y + h);
                innerGrad.addColorStop(0, '#050505');
                innerGrad.addColorStop(0.8, '#882200');
                innerGrad.addColorStop(1, '#ffaa00');
                ctx.fillStyle = innerGrad;
                ctx.beginPath();
                ctx.moveTo(x + w * 0.3, y + h * 0.7);
                ctx.lineTo(x + w * 0.1, y + h);
                ctx.lineTo(x + w * 0.9, y + h);
                ctx.lineTo(x + w * 0.7, y + h * 0.7);
                ctx.closePath();
                ctx.fill();
                
                ctx.fillStyle = '#666';
                ctx.fillRect(x, y + h - pixelSize*2, w, pixelSize*2);

                ctx.fillStyle = accentColor;
                ctx.fillRect(x + w * 0.05, y + h * 0.4, w * 0.9, h * 0.05);

                const glowSize = pixelSize * 4;
                ctx.fillStyle = '#ffcc00';
                ctx.shadowColor = '#ff6600';
                ctx.shadowBlur = glowSize * 2;
                ctx.beginPath();
                ctx.arc(x + w/2, y + h - glowSize/2, glowSize, 0, Math.PI*2);
                ctx.fill();
                ctx.shadowBlur = 0;
            }
            break;

        case 'fuel':
            drawCylinder(x, y, w, h, baseColor);
            
            const bandH = h * 0.06;
            const drawBand = (by) => {
                ctx.fillStyle = darken(baseColor, 50);
                ctx.fillRect(x, by, w, bandH + pixelSize*2);
                drawCylinder(x, by + pixelSize, w, bandH, accentColor);
                drawRivets(x, by + pixelSize, w, bandH, false);
            };

            drawBand(y + h * 0.15);
            drawBand(y + h * 0.79);

            if (part.id === 'huge_tank' || part.height >= 4) {
                drawBand(y + h * 0.47);
                drawCylinder(x + w * 0.1, y, w * 0.06, h, '#555', false);
                drawCylinder(x + w * 0.84, y, w * 0.06, h, '#555', false);
            }

            ctx.strokeStyle = darken(baseColor, 40);
            ctx.lineWidth = pixelSize;
            ctx.beginPath();
            ctx.moveTo(x + w * 0.2, y + h * 0.5);
            ctx.lineTo(x + w * 0.8, y + h * 0.5);
            ctx.stroke();
            
            ctx.fillStyle = 'rgba(255,255,255,0.15)';
            ctx.fillRect(x + w * 0.1, y, w * 0.1, h);
            ctx.fillRect(x + w * 0.5, y, w * 0.05, h);
            break;

        case 'structure':
            if (part.id === 'nose_cone' || part.id === 'small_nose_cone') {
                const noseGrad = ctx.createLinearGradient(x, y, x + w, y);
                noseGrad.addColorStop(0, darken(baseColor, 60));
                noseGrad.addColorStop(0.2, darken(baseColor, 10));
                noseGrad.addColorStop(0.5, lighten(baseColor, 50));
                noseGrad.addColorStop(0.8, baseColor);
                noseGrad.addColorStop(1, darken(baseColor, 50));
                ctx.fillStyle = noseGrad;
                
                ctx.beginPath();
                ctx.moveTo(x + w / 2, y);
                ctx.bezierCurveTo(x + w * 0.5, y + h * 0.2, x, y + h * 0.6, x, y + h);
                ctx.lineTo(x + w, y + h);
                ctx.bezierCurveTo(x + w, y + h * 0.6, x + w * 0.5, y + h * 0.2, x + w / 2, y);
                ctx.closePath();
                ctx.fill();

                ctx.fillStyle = '#dddddd';
                ctx.beginPath();
                ctx.moveTo(x + w / 2, y);
                ctx.bezierCurveTo(x + w * 0.52, y + h * 0.05, x + w * 0.45, y + h * 0.1, x + w * 0.4, y + h * 0.15);
                ctx.lineTo(x + w * 0.6, y + h * 0.15);
                ctx.bezierCurveTo(x + w * 0.55, y + h * 0.1, x + w * 0.48, y + h * 0.05, x + w / 2, y);
                ctx.fill();

                drawCylinder(x, y + h - h * 0.05, w, h * 0.05, darken(baseColor, 30));

            } else if (part.id === 'fairing' || part.id === 'small_fairing') {
                const fairingGrad = ctx.createLinearGradient(x, y, x + w, y);
                fairingGrad.addColorStop(0, darken(baseColor, 50));
                fairingGrad.addColorStop(0.15, baseColor);
                fairingGrad.addColorStop(0.5, lighten(baseColor, 50));
                fairingGrad.addColorStop(0.85, baseColor);
                fairingGrad.addColorStop(1, darken(baseColor, 50));
                ctx.fillStyle = fairingGrad;

                ctx.beginPath();
                if (part.id === 'fairing') {
                    ctx.moveTo(x, y + h);
                    ctx.quadraticCurveTo(x, y, x + w / 2, y);
                    ctx.quadraticCurveTo(x + w, y, x + w, y + h);
                } else {
                    ctx.moveTo(x + w * 0.2, y);
                    ctx.lineTo(x, y + h * 0.25);
                    ctx.lineTo(x, y + h);
                    ctx.lineTo(x + w, y + h);
                    ctx.lineTo(x + w, y + h * 0.25);
                    ctx.lineTo(x + w * 0.8, y);
                }
                ctx.closePath();
                ctx.fill();

                ctx.strokeStyle = darken(baseColor, 60);
                ctx.lineWidth = pixelSize;
                ctx.beginPath();
                ctx.moveTo(x + w * 0.5, y);
                ctx.lineTo(x + w * 0.5, y + h);
                ctx.stroke();
                
                const stripeY = y + h * 0.85;
                const stripeH = h * 0.05;
                ctx.fillStyle = '#222';
                ctx.fillRect(x + w*0.05, stripeY, w * 0.9, stripeH);

            } else if (part.id === 'decoupler') {
                drawCylinder(x, y, w, h, baseColor);
                
                ctx.save();
                ctx.beginPath();
                ctx.rect(x, y + h * 0.25, w, h * 0.5);
                ctx.clip();
                const stripeW = w / 8;
                for (let i = -2; i < 10; i++) {
                    ctx.fillStyle = i % 2 === 0 ? accentColor : '#111';
                    ctx.beginPath();
                    ctx.moveTo(x + i * stripeW, y);
                    ctx.lineTo(x + (i + 2) * stripeW, y + h);
                    ctx.lineTo(x + (i + 3) * stripeW, y + h);
                    ctx.lineTo(x + (i + 1) * stripeW, y);
                    ctx.fill();
                }
                ctx.restore();
                
                ctx.fillStyle = '#ff3333';
                ctx.fillRect(x + w * 0.1, y + h * 0.45, w * 0.1, h * 0.1);
                ctx.fillRect(x + w * 0.8, y + h * 0.45, w * 0.1, h * 0.1);

            } else {
                drawCylinder(x, y, w, h, baseColor);
                ctx.strokeStyle = darken(baseColor, 50);
                ctx.lineWidth = pixelSize * 2;
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.lineTo(x + w, y + h);
                ctx.moveTo(x + w, y);
                ctx.lineTo(x, y + h);
                ctx.stroke();
            }
            break;

        case 'control':
            if (part.id === 'small_fins' || part.id === 'large_fins') {
                ctx.beginPath();
                if (part.id === 'small_fins') {
                    ctx.moveTo(x, y);
                    ctx.lineTo(x + w, y + h);
                    ctx.lineTo(x, y + h);
                } else {
                    ctx.moveTo(x, y);
                    ctx.lineTo(x + w * 0.5, y);
                    ctx.lineTo(x + w, y + h * 0.8);
                    ctx.lineTo(x + w, y + h);
                    ctx.lineTo(x, y + h);
                }
                ctx.closePath();

                const finGrad = ctx.createLinearGradient(x, y, x + w, y + h);
                finGrad.addColorStop(0, lighten(baseColor, 20));
                finGrad.addColorStop(0.3, baseColor);
                finGrad.addColorStop(0.6, darken(baseColor, 30));
                finGrad.addColorStop(1, darken(baseColor, 60));
                ctx.fillStyle = finGrad;
                ctx.fill();

                ctx.strokeStyle = lighten(baseColor, 50);
                ctx.lineWidth = pixelSize * 1.5;
                ctx.beginPath();
                ctx.moveTo(x, y);
                if (part.id === 'small_fins') {
                    ctx.lineTo(x + w, y + h);
                } else {
                    ctx.lineTo(x + w * 0.5, y);
                    ctx.lineTo(x + w, y + h * 0.8);
                }
                ctx.stroke();

                if (part.id === 'large_fins') {
                    ctx.fillStyle = darken(baseColor, 40);
                    ctx.fillRect(x + w * 0.6, y + h * 0.82, w * 0.38, h * 0.16);
                    ctx.strokeStyle = darken(baseColor, 70);
                    ctx.strokeRect(x + w * 0.6, y + h * 0.82, w * 0.38, h * 0.16);
                }

            } else if (part.id === 'reaction_wheel') {
                drawCylinder(x, y, w, h, '#222');
                
                const housingGrad = ctx.createRadialGradient(x + w/2, y + h/2, w*0.1, x + w/2, y + h/2, w*0.4);
                housingGrad.addColorStop(0, '#111');
                housingGrad.addColorStop(1, '#333');
                ctx.fillStyle = housingGrad;
                ctx.beginPath();
                ctx.arc(x + w / 2, y + h / 2, w * 0.45, 0, Math.PI * 2);
                ctx.fill();

                ctx.fillStyle = '#ffd700'; 
                ctx.beginPath();
                ctx.arc(x + w / 2, y + h / 2, w * 0.35, 0, Math.PI * 2);
                ctx.fill();

                ctx.fillStyle = '#555';
                ctx.beginPath();
                ctx.arc(x + w / 2, y + h / 2, w * 0.1, 0, Math.PI * 2);
                ctx.fill();

                ctx.strokeStyle = '#b8860b'; 
                ctx.lineWidth = pixelSize * 3;
                ctx.setLineDash([pixelSize*4, pixelSize*6]);
                ctx.beginPath();
                ctx.arc(x + w / 2, y + h / 2, w * 0.25, 0, Math.PI * 2);
                ctx.stroke();
                ctx.setLineDash([]); 

                const glassGrad = ctx.createLinearGradient(x, y, x + w, y + h);
                glassGrad.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
                glassGrad.addColorStop(0.5, 'rgba(0, 200, 255, 0.1)');
                glassGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
                ctx.fillStyle = glassGrad;
                ctx.beginPath();
                ctx.arc(x + w / 2, y + h / 2, w * 0.45, 0, Math.PI * 2);
                ctx.fill();

            } else if (part.id === 'gimbal') {
                drawCylinder(x, y, w, h * 0.2, '#333'); 
                drawCylinder(x, y + h * 0.8, w, h * 0.2, '#333'); 
                
                const ballGrad = ctx.createRadialGradient(x + w/2, y + h/2, w*0.05, x + w/2, y + h/2, w*0.3);
                ballGrad.addColorStop(0, '#ccc');
                ballGrad.addColorStop(0.5, '#777');
                ballGrad.addColorStop(1, '#222');
                ctx.fillStyle = ballGrad;
                ctx.beginPath();
                ctx.arc(x + w / 2, y + h / 2, w * 0.25, 0, Math.PI * 2);
                ctx.fill();

                ctx.fillStyle = '#aaa';
                ctx.fillRect(x + w * 0.2, y + h * 0.2, w * 0.1, h * 0.6);
                ctx.fillRect(x + w * 0.7, y + h * 0.2, w * 0.1, h * 0.6);
                
                ctx.fillStyle = '#fff';
                ctx.fillRect(x + w * 0.22, y + h * 0.2, w * 0.06, h * 0.3);
                ctx.fillRect(x + w * 0.72, y + h * 0.2, w * 0.06, h * 0.3);
            }
            break;

        case 'utility':
        case 'payload':
            if (part.id === 'habitation_module') {
                drawCylinder(x, y, w, h, baseColor);
                
                drawCylinder(x, y, w, h * 0.05, darken(baseColor, 40));
                drawCylinder(x, y + h * 0.95, w, h * 0.05, darken(baseColor, 40));

                ctx.fillStyle = '#bbb';
                ctx.fillRect(x - pixelSize, y + h * 0.2, w + pixelSize*2, h * 0.08);
                ctx.fillRect(x - pixelSize, y + h * 0.72, w + pixelSize*2, h * 0.08);

                ctx.strokeStyle = 'rgba(0,0,0,0.1)';
                ctx.lineWidth = pixelSize;
                for(let i=0; i<w; i+=w*0.2) {
                    ctx.beginPath(); ctx.moveTo(x+i, y); ctx.lineTo(x+i, y+h); ctx.stroke();
                }
                for(let i=0; i<h; i+=h*0.2) {
                    ctx.beginPath(); ctx.moveTo(x, y+i); ctx.lineTo(x+w, y+i); ctx.stroke();
                }

                ctx.fillStyle = darken(baseColor, 80);
                ctx.beginPath();
                ctx.arc(x + w * 0.5, y + h * 0.5, w * 0.2, 0, Math.PI * 2);
                ctx.fill();

                const cupolaGrad = ctx.createRadialGradient(x + w*0.5, y + h*0.5, 0, x + w*0.5, y + h*0.5, w*0.15);
                cupolaGrad.addColorStop(0, '#ffffff');
                cupolaGrad.addColorStop(0.3, '#00d4ff');
                cupolaGrad.addColorStop(1, '#00264d');
                ctx.fillStyle = cupolaGrad;
                ctx.beginPath();
                ctx.arc(x + w * 0.5, y + h * 0.5, w * 0.15, 0, Math.PI * 2);
                ctx.fill();

                ctx.strokeStyle = '#222';
                ctx.lineWidth = pixelSize * 2;
                ctx.beginPath();
                ctx.moveTo(x + w * 0.35, y + h * 0.5); ctx.lineTo(x + w * 0.65, y + h * 0.5);
                ctx.moveTo(x + w * 0.5, y + h * 0.35); ctx.lineTo(x + w * 0.5, y + h * 0.65);
                ctx.stroke();

            } else if (part.id === 'solar_panel') {
                ctx.fillStyle = '#111';
                ctx.fillRect(x, y, w, h);

                const cellGrad = ctx.createLinearGradient(x, y, x + w, y + h);
                cellGrad.addColorStop(0, '#0a1930');
                cellGrad.addColorStop(0.5, '#1e3c72');
                cellGrad.addColorStop(1, '#0a1930');
                ctx.fillStyle = cellGrad;
                ctx.fillRect(x + pixelSize*2, y + pixelSize*2, w - pixelSize*4, h - pixelSize*4);

                ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
                ctx.beginPath();
                ctx.moveTo(x + pixelSize*2, y + pixelSize*2);
                ctx.lineTo(x + w/2, y + pixelSize*2);
                ctx.lineTo(x + pixelSize*2, y + h/2);
                ctx.fill();

                ctx.strokeStyle = 'rgba(200, 220, 255, 0.7)';
                ctx.lineWidth = pixelSize;
                const rows = 4;
                const cols = 2;
                for (let r = 1; r < rows; r++) {
                    ctx.beginPath();
                    ctx.moveTo(x + pixelSize*2, y + (h / rows) * r);
                    ctx.lineTo(x + w - pixelSize*2, y + (h / rows) * r);
                    ctx.stroke();
                }
                for (let c = 1; c < cols; c++) {
                    ctx.beginPath();
                    ctx.moveTo(x + (w / cols) * c, y + pixelSize*2);
                    ctx.lineTo(x + (w / cols) * c, y + h - pixelSize*2);
                    ctx.stroke();
                }

                ctx.strokeStyle = '#555';
                ctx.lineWidth = pixelSize * 2;
                ctx.strokeRect(x, y, w, h);

            } else if (part.id === 'docking_port') {
                drawCylinder(x, y, w, h, '#d0d0d0');
                
                const ringGrad = ctx.createLinearGradient(x, y, x + w, y);
                ringGrad.addColorStop(0, '#888');
                ringGrad.addColorStop(0.5, '#eee');
                ringGrad.addColorStop(1, '#666');
                ctx.fillStyle = ringGrad;
                ctx.beginPath();
                ctx.arc(x + w / 2, y + h / 2, w * 0.45, 0, Math.PI * 2);
                ctx.fill();

                ctx.fillStyle = '#111';
                ctx.beginPath();
                ctx.arc(x + w / 2, y + h / 2, w * 0.35, 0, Math.PI * 2);
                ctx.fill();
                
                ctx.strokeStyle = '#444';
                ctx.lineWidth = pixelSize * 2;
                ctx.beginPath();
                ctx.moveTo(x + w * 0.2, y + h / 2); ctx.lineTo(x + w * 0.8, y + h / 2);
                ctx.moveTo(x + w / 2, y + h * 0.2); ctx.lineTo(x + w / 2, y + h * 0.8);
                ctx.stroke();

                for (let i = 0; i < 4; i++) {
                    const angle = (i / 4) * Math.PI * 2 + (Math.PI / 4);
                    const dx = x + w / 2 + Math.cos(angle) * w * 0.38;
                    const dy = y + h / 2 + Math.sin(angle) * w * 0.38;
                    
                    ctx.fillStyle = '#777';
                    ctx.fillRect(dx - pixelSize*2, dy - pixelSize*2, pixelSize*4, pixelSize*4);
                    
                    ctx.fillStyle = '#00ff00';
                    ctx.beginPath();
                    ctx.arc(dx, dy, pixelSize, 0, Math.PI * 2);
                    ctx.fill();
                }

            } else if (part.id === 'crew_capsule') {
                const capsuleGrad = ctx.createLinearGradient(x, y, x + w, y);
                capsuleGrad.addColorStop(0, darken(baseColor, 50));
                capsuleGrad.addColorStop(0.3, lighten(baseColor, 30));
                capsuleGrad.addColorStop(0.7, lighten(baseColor, 50));
                capsuleGrad.addColorStop(1, darken(baseColor, 40));
                ctx.fillStyle = capsuleGrad;

                ctx.beginPath();
                ctx.moveTo(x + w * 0.3, y);
                ctx.lineTo(x, y + h);
                ctx.lineTo(x + w, y + h);
                ctx.lineTo(x + w * 0.7, y);
                ctx.closePath();
                ctx.fill();
                
                ctx.fillStyle = '#221100'; 
                ctx.fillRect(x, y + h - h * 0.1, w, h * 0.1);

                const drawWindow = (wx, wy, size) => {
                    ctx.fillStyle = '#111'; 
                    ctx.fillRect(wx - pixelSize, wy - pixelSize, size + pixelSize*2, size + pixelSize*2);
                    
                    const glassGrad = ctx.createLinearGradient(wx, wy, wx+size, wy+size);
                    glassGrad.addColorStop(0, '#fff');
                    glassGrad.addColorStop(0.2, '#0af');
                    glassGrad.addColorStop(1, '#002');
                    ctx.fillStyle = glassGrad;
                    ctx.fillRect(wx, wy, size, size);
                };

                const wSize = w * 0.15;
                drawWindow(x + w * 0.25, y + h * 0.4, wSize);
                drawWindow(x + w * 0.5 - wSize/2, y + h * 0.45, wSize);
                drawWindow(x + w * 0.75 - wSize, y + h * 0.4, wSize);
                
                ctx.strokeStyle = darken(baseColor, 60);
                ctx.lineWidth = pixelSize;
                ctx.strokeRect(x + w * 0.4, y + h * 0.6, w * 0.2, h * 0.3);

            } else {
                drawCylinder(x, y, w, h, baseColor);
                drawPanelDetails(x, y, w, h, baseColor);
                
                ctx.strokeStyle = darken(baseColor, 70);
                ctx.lineWidth = pixelSize * 2;
                ctx.beginPath();
                ctx.moveTo(x + w / 2, y);
                ctx.lineTo(x + w / 2, y + h);
                ctx.stroke();

                ctx.fillStyle = accentColor;
                ctx.fillRect(x + w * 0.3, y + h * 0.2, w * 0.1, h * 0.1);
                ctx.fillRect(x + w * 0.6, y + h * 0.2, w * 0.1, h * 0.1);
            }
            break;
    }

    ctx.strokeStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.lineWidth = pixelSize * 1.5;

    if (!['nose_cone', 'small_nose_cone', 'docking_port', 'habitation_module', 'solar_panel', 'fairing', 'small_fairing', 'small_fins', 'large_fins', 'crew_capsule', 'mammoth_engine'].includes(part.id)) {
        ctx.strokeRect(x, y, w, h);
    } else if (part.id === 'crew_capsule') {
        ctx.beginPath();
        ctx.moveTo(x + w * 0.3, y);
        ctx.lineTo(x, y + h);
        ctx.lineTo(x + w, y + h);
        ctx.lineTo(x + w * 0.7, y);
        ctx.closePath();
        ctx.stroke();
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
