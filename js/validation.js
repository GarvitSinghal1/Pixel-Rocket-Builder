/**
 * ROCKET VALIDATION - Strict physics checks
 * Ensures only realistic rocket configurations can launch
 */

/**
 * Validate rocket design before launch
 * Returns { valid: boolean, errors: string[], warnings: string[] }
 */
function validateRocketDesign(parts) {
    const errors = [];
    const warnings = [];

    // Get only connected parts
    const connectedParts = typeof getConnectedParts === 'function' ? getConnectedParts() : parts;

    // Warn about disconnected parts (don't block)
    if (connectedParts.length < parts.length) {
        const disconnected = parts.length - connectedParts.length;
        warnings.push(`⚠️ ${disconnected} disconnected part(s) will be ignored during launch.`);
    }

    // Use only connected parts for remaining validation
    const partsToValidate = connectedParts;

    // 1. Must have at least one engine
    const engines = partsToValidate.filter(p => {
        const def = getPartById(p.partId);
        return def.category === 'engines';
    });

    if (engines.length === 0) {
        errors.push('No engine detected. Rocket needs at least one engine to generate thrust.');
        return { valid: false, errors, warnings };
    }

    // 2. Must have fuel
    const fuelParts = partsToValidate.filter(p => {
        const def = getPartById(p.partId);
        return def.fuelCapacity && def.fuelCapacity > 0;
    });

    if (fuelParts.length === 0) {
        errors.push('No fuel tanks detected. Rocket needs fuel to fly.');
        return { valid: false, errors, warnings };
    }

    // 4. Structural integrity - find topmost and bottommost parts
    let topmostY = Infinity;
    let bottommostY = -Infinity;
    let topmostPart = null;
    let bottommostPart = null;

    parts.forEach(p => {
        const def = getPartById(p.partId);
        const partBottom = p.y + (def.height * TILE_SIZE);

        if (p.y < topmostY) {
            topmostY = p.y;
            topmostPart = p;
        }
        if (partBottom > bottommostY) {
            bottommostY = partBottom;
            bottommostPart = p;
        }
    });

    // 5. Nose cone must be at the top (if present)
    const noseCones = parts.filter(p => {
        const def = getPartById(p.partId);
        return def.id === 'nose_cone' || def.id === 'small_nose_cone';
    });

    if (noseCones.length > 0) {
        // Check if nose cone is the topmost part
        const noseCone = noseCones[0];
        const noseConeDef = getPartById(noseCone.partId);

        // Allow some tolerance (within 1 tile)
        if (noseCone.y > topmostY + TILE_SIZE) {
            errors.push('Nose cone must be at the TOP of the rocket, not in the middle or bottom.');
            return { valid: false, errors };
        }
    }

    // 6. Engines must be at or near the bottom
    engines.forEach(engine => {
        const engineDef = getPartById(engine.partId);
        const engineBottom = engine.y + (engineDef.height * TILE_SIZE);

        // Engine bottom should be within 2 tiles of rocket bottom
        if (engineBottom < bottommostY - (TILE_SIZE * 2)) {
            errors.push('Engines must be at the BOTTOM of the rocket. Thrust pushes from below.');
            return { valid: false, errors };
        }
    });

    // 7. Check for upside-down configuration
    // If nose cone exists and is below engines, it's upside down
    if (noseCones.length > 0 && engines.length > 0) {
        const noseCone = noseCones[0];
        const lowestEngine = engines.reduce((lowest, e) => {
            return e.y < lowest.y ? e : lowest;
        }, engines[0]);

        if (noseCone.y > lowestEngine.y) {
            errors.push('Rocket is UPSIDE DOWN! Nose cone at bottom, engines at top. This cannot fly.');
            return { valid: false, errors };
        }
    }

    // 8. TWR must be >= 1
    const twr = calculateTWR(parts);
    if (twr < 1.0) {
        errors.push(`Thrust-to-Weight Ratio too low (${twr.toFixed(2)}). Must be ≥1.0 to overcome gravity.`);
        return { valid: false, errors };
    }

    // 9. Check for physically impossible configurations
    // Parts can't be in mid-air with nothing below them
    parts.forEach(part => {
        const def = getPartById(part.partId);

        // Skip engines and bottom parts
        if (def.category === 'engines') return;

        const partBottom = part.y + (def.height * TILE_SIZE);

        // Check if there's a part below supporting this one
        const hasSupport = parts.some(other => {
            if (other === part) return false;

            const otherDef = getPartById(other.partId);
            const otherTop = other.y;
            const otherBottom = other.y + (otherDef.height * TILE_SIZE);

            // Check if other part is directly below and touching
            const horizontalOverlap = !(
                part.x + (def.width * TILE_SIZE) <= other.x ||
                other.x + (otherDef.width * TILE_SIZE) <= part.x
            );

            const isTouching = Math.abs(partBottom - otherTop) < 5;

            return horizontalOverlap && isTouching && other.y > part.y;
        });

        // Engines at bottom don't need support
        const isSupported = hasSupport || partBottom >= bottommostY - 5;

        if (!isSupported && def.category !== 'engines') {
            errors.push(`Floating parts detected. Part "${def.name}" has no support below it.`);
        }
    });

    if (errors.length > 0) {
        return { valid: false, errors };
    }

    return { valid: true, errors: [] };
}

/**
 * Show validation errors to user
 */
function showValidationErrors(errors) {
    const modal = document.getElementById('validation-modal');
    const content = document.getElementById('validation-errors');

    if (!modal || !content) {
        alert('INVALID ROCKET:\n\n' + errors.join('\n\n'));
        return;
    }

    content.innerHTML = errors.map(err =>
        `<div class="validation-error">❌ ${err}</div>`
    ).join('');

    modal.classList.add('active');
}
