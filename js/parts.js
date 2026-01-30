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
function isPartUnlocked(partId, currentLevel, isFunMode = false, isAdvancedMode = false) {
    // Fun and Advanced modes unlock all parts
    if (isFunMode || isAdvancedMode) return true;
    const part = getPartById(partId);
    return part && currentLevel >= part.unlockLevel;
}

/**
 * Draw a part on canvas (enhanced pixel art style)
 */
function drawPart(ctx, part, x, y, scale = 1) {
    const w = part.width * TILE_SIZE * scale;
    const h = part.height * TILE_SIZE * scale;
    const pixelSize = Math.max(1, 2 * scale); // Pixel size for details

    ctx.save();
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
            // Engine body with metallic gradient
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
            if (part.id === 'nose_cone') {
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
            if (part.id.includes('fins')) {
                // Metallic fin gradient
                const finGrad = ctx.createLinearGradient(x, y, x + w, y);
                finGrad.addColorStop(0, darken(part.color, 20));
                finGrad.addColorStop(0.5, lighten(part.color, 30));
                finGrad.addColorStop(1, darken(part.color, 20));
                ctx.fillStyle = finGrad;

                // Left fin
                ctx.beginPath();
                ctx.moveTo(x, y + h);
                ctx.lineTo(x + w * 0.2, y);
                ctx.lineTo(x + w * 0.4, y);
                ctx.lineTo(x + w * 0.45, y + h);
                ctx.closePath();
                ctx.fill();

                // Center bar
                ctx.fillRect(x + w * 0.4, y + h * 0.3, w * 0.2, h * 0.7);

                // Right fin
                ctx.beginPath();
                ctx.moveTo(x + w, y + h);
                ctx.lineTo(x + w * 0.8, y);
                ctx.lineTo(x + w * 0.6, y);
                ctx.lineTo(x + w * 0.55, y + h);
                ctx.closePath();
                ctx.fill();

                // Fin edge highlights
                ctx.strokeStyle = 'rgba(255,255,255,0.3)';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(x + w * 0.2, y);
                ctx.lineTo(x, y + h);
                ctx.stroke();
            } else {
                // Reaction wheel / gimbal
                ctx.fillStyle = part.color;
                ctx.fillRect(x, y, w, h);

                // Inner circle (tech detail)
                ctx.fillStyle = part.accentColor;
                ctx.beginPath();
                ctx.arc(x + w / 2, y + h / 2, Math.min(w, h) * 0.35, 0, Math.PI * 2);
                ctx.fill();

                // Tech glow
                ctx.fillStyle = 'rgba(0,255,255,0.3)';
                ctx.beginPath();
                ctx.arc(x + w / 2, y + h / 2, Math.min(w, h) * 0.25, 0, Math.PI * 2);
                ctx.fill();
            }
            break;

        case 'payload':
            // Base with gradient
            const payloadGrad = ctx.createLinearGradient(x, y, x + w, y);
            payloadGrad.addColorStop(0, darken(part.color, 30));
            payloadGrad.addColorStop(0.35, lighten(part.color, 20));
            payloadGrad.addColorStop(0.5, part.color);
            payloadGrad.addColorStop(1, darken(part.color, 30));
            ctx.fillStyle = payloadGrad;
            ctx.fillRect(x, y, w, h);

            // Windows/lights (glowing effect)
            ctx.fillStyle = part.accentColor;
            ctx.shadowColor = part.accentColor;
            ctx.shadowBlur = 5 * scale;
            const windowSize = pixelSize * 2;

            if (part.id === 'crew_capsule') {
                // Multiple windows
                ctx.fillRect(x + w * 0.2, y + h * 0.3, windowSize, windowSize);
                ctx.fillRect(x + w * 0.5 - windowSize / 2, y + h * 0.3, windowSize, windowSize);
                ctx.fillRect(x + w * 0.8 - windowSize, y + h * 0.3, windowSize, windowSize);
            } else {
                // Single indicator
                ctx.fillRect(x + w / 2 - windowSize / 2, y + h * 0.3, windowSize, windowSize);
            }
            ctx.shadowBlur = 0;

            // Panel detail lines
            ctx.strokeStyle = darken(part.color, 40);
            ctx.lineWidth = 1;
            ctx.strokeRect(x + 2, y + 2, w - 4, h - 4);
            break;
    }

    // Common outline
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = Math.max(1, 2 * scale);

    if (part.id !== 'nose_cone') {
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
