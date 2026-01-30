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
            thrust: 20,
            fuelConsumption: 2,
            isp: 280,
            width: 1,
            height: 1,
            attachPoints: { top: true, bottom: false, left: false, right: false },
            unlockLevel: 0,
            color: '#666677',
            accentColor: '#ff6600'
        },
        standard_engine: {
            id: 'standard_engine',
            name: 'Standard Engine',
            category: 'engines',
            mass: 200,
            thrust: 150,
            fuelConsumption: 8,
            isp: 320,
            width: 2,
            height: 2,
            attachPoints: { top: true, bottom: false, left: false, right: false },
            unlockLevel: 0,
            color: '#555566',
            accentColor: '#ff8800'
        },
        heavy_lifter: {
            id: 'heavy_lifter',
            name: 'Heavy Lifter',
            category: 'engines',
            mass: 500,
            thrust: 400,
            fuelConsumption: 20,
            isp: 300,
            width: 3,
            height: 2,
            attachPoints: { top: true, bottom: false, left: false, right: false },
            unlockLevel: 5,
            color: '#444455',
            accentColor: '#ffaa00'
        },
        booster: {
            id: 'booster',
            name: 'Booster',
            category: 'engines',
            mass: 300,
            thrust: 250,
            fuelConsumption: 25,
            isp: 250,
            width: 1,
            height: 3,
            attachPoints: { top: true, bottom: false, left: true, right: true },
            unlockLevel: 3,
            color: '#cc4444',
            accentColor: '#ff6600'
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
            mass: 30,
            fuelCapacity: 100,
            width: 1,
            height: 2,
            attachPoints: { top: true, bottom: true, left: false, right: false },
            unlockLevel: 0,
            color: '#ddddee',
            accentColor: '#aabbcc'
        },
        medium_tank: {
            id: 'medium_tank',
            name: 'Medium Tank',
            category: 'fuel',
            mass: 80,
            fuelCapacity: 300,
            width: 2,
            height: 3,
            attachPoints: { top: true, bottom: true, left: false, right: false },
            unlockLevel: 2,
            color: '#ccccdd',
            accentColor: '#99aacc'
        },
        large_tank: {
            id: 'large_tank',
            name: 'Large Tank',
            category: 'fuel',
            mass: 150,
            fuelCapacity: 600,
            width: 2,
            height: 4,
            attachPoints: { top: true, bottom: true, left: true, right: true },
            unlockLevel: 4,
            color: '#bbbbcc',
            accentColor: '#8899bb'
        },
        radial_tank: {
            id: 'radial_tank',
            name: 'Radial Tank',
            category: 'fuel',
            mass: 40,
            fuelCapacity: 80,
            width: 1,
            height: 2,
            attachPoints: { top: false, bottom: false, left: true, right: true },
            unlockLevel: 6,
            color: '#ddddcc',
            accentColor: '#ff8844'
        }
    },

    // ============================================
    // STRUCTURAL
    // ============================================
    structure: {
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
            accentColor: '#cc2222'
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
            accentColor: '#ffcc00'
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
            accentColor: '#888888'
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
            accentColor: '#ddddee'
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
            width: 3,
            height: 1,
            attachPoints: { top: true, bottom: false, left: false, right: false },
            unlockLevel: 0,
            color: '#888899',
            accentColor: '#666677'
        },
        large_fins: {
            id: 'large_fins',
            name: 'Large Fins',
            category: 'control',
            mass: 25,
            stability: 0.5,
            width: 4,
            height: 2,
            attachPoints: { top: true, bottom: false, left: false, right: false },
            unlockLevel: 4,
            color: '#777788',
            accentColor: '#555566'
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
            accentColor: '#00ffff'
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
            accentColor: '#667788'
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
            accentColor: '#00ccff'
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
            accentColor: '#44aaff'
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
            accentColor: '#66aa77'
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
            accentColor: '#778888'
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
function isPartUnlocked(partId, currentLevel, isFunMode = false) {
    if (isFunMode) return true;
    const part = getPartById(partId);
    return part && currentLevel >= part.unlockLevel;
}

/**
 * Draw a part on canvas (pixel art style)
 */
function drawPart(ctx, part, x, y, scale = 1) {
    const w = part.width * TILE_SIZE * scale;
    const h = part.height * TILE_SIZE * scale;
    
    ctx.save();
    ctx.imageSmoothingEnabled = false;
    
    // Main body
    ctx.fillStyle = part.color;
    ctx.fillRect(x, y, w, h);
    
    // Border/outline
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2 * scale;
    ctx.strokeRect(x, y, w, h);
    
    // Accent details based on category
    ctx.fillStyle = part.accentColor;
    
    switch (part.category) {
        case 'engines':
            // Engine nozzle
            const nozzleH = h * 0.3;
            ctx.fillRect(x + w * 0.2, y + h - nozzleH, w * 0.6, nozzleH);
            // Highlight
            ctx.fillStyle = 'rgba(255,255,255,0.3)';
            ctx.fillRect(x + 2*scale, y + 2*scale, w * 0.3, h * 0.1);
            break;
            
        case 'fuel':
            // Tank stripes
            const stripeH = h * 0.15;
            ctx.fillRect(x, y + h * 0.2, w, stripeH);
            ctx.fillRect(x, y + h * 0.6, w, stripeH);
            // Highlight
            ctx.fillStyle = 'rgba(255,255,255,0.2)';
            ctx.fillRect(x + 2*scale, y + 2*scale, w * 0.15, h - 4*scale);
            break;
            
        case 'structure':
            if (part.id === 'nose_cone') {
                // Draw cone shape
                ctx.fillStyle = part.color;
                ctx.beginPath();
                ctx.moveTo(x + w/2, y);
                ctx.lineTo(x + w, y + h);
                ctx.lineTo(x, y + h);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
            } else if (part.id === 'decoupler') {
                // Decoupler line
                ctx.fillStyle = part.accentColor;
                ctx.fillRect(x, y + h * 0.4, w, h * 0.2);
            }
            break;
            
        case 'control':
            if (part.id.includes('fins')) {
                // Fin shapes
                ctx.fillStyle = part.color;
                ctx.beginPath();
                ctx.moveTo(x, y + h);
                ctx.lineTo(x + w * 0.3, y);
                ctx.lineTo(x + w * 0.5, y);
                ctx.lineTo(x + w * 0.5, y + h);
                ctx.closePath();
                ctx.fill();
                
                ctx.beginPath();
                ctx.moveTo(x + w, y + h);
                ctx.lineTo(x + w * 0.7, y);
                ctx.lineTo(x + w * 0.5, y);
                ctx.lineTo(x + w * 0.5, y + h);
                ctx.closePath();
                ctx.fill();
            } else {
                // Circle for reaction wheel
                ctx.beginPath();
                ctx.arc(x + w/2, y + h/2, Math.min(w, h) * 0.35, 0, Math.PI * 2);
                ctx.fill();
            }
            break;
            
        case 'payload':
            // Windows/lights
            ctx.fillStyle = part.accentColor;
            const dotSize = 4 * scale;
            ctx.fillRect(x + w/2 - dotSize/2, y + h * 0.3, dotSize, dotSize);
            if (part.id === 'crew_capsule') {
                ctx.fillRect(x + w * 0.25, y + h * 0.5, dotSize, dotSize);
                ctx.fillRect(x + w * 0.65, y + h * 0.5, dotSize, dotSize);
            }
            break;
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
