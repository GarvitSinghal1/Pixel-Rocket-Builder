/**
 * PIXEL ROCKET BUILDER - Editor
 * Drag-and-drop rocket building interface with snapping and connectivity
 */

const EDITOR = {
    canvas: null,
    ctx: null,

    // Placed parts on the canvas
    placedParts: [],

    // Currently dragging
    isDragging: false,
    dragPart: null,
    dragOffsetX: 0,
    dragOffsetY: 0,

    // Selected part
    selectedPart: null,

    // Grid settings
    gridSize: TILE_SIZE,
    showGrid: true,

    // Canvas dimensions
    width: 0,
    height: 0,

    // Launch pad position
    padX: 0,
    padY: 0,
    padWidth: 200,

    // Current category
    currentCategory: 'engines',

    // Snapping
    snapLines: { x: null, y: null },
    centerX: 0
};

/**
 * Initialize the editor
 */
function initEditor() {
    EDITOR.canvas = document.getElementById('editor-canvas');
    EDITOR.ctx = EDITOR.canvas.getContext('2d');

    resizeEditorCanvas();
    setupEditorEvents();
    renderPartsPanel('engines');

    // Initial render
    renderEditor();

    window.addEventListener('resize', () => {
        resizeEditorCanvas();
        renderEditor();
    });
}

/**
 * Resize canvas to fit container
 */
function resizeEditorCanvas() {
    const container = document.getElementById('build-area');
    EDITOR.width = container.clientWidth;
    EDITOR.height = container.clientHeight;

    EDITOR.canvas.width = EDITOR.width;
    EDITOR.canvas.height = EDITOR.height;

    // Launch pad position
    EDITOR.padX = EDITOR.width / 2 - EDITOR.padWidth / 2;
    EDITOR.padY = EDITOR.height - 60;
    EDITOR.centerX = EDITOR.width / 2;
}

/**
 * Setup event listeners
 */
function setupEditorEvents() {
    // Canvas events
    EDITOR.canvas.addEventListener('mousedown', handleCanvasMouseDown);
    EDITOR.canvas.addEventListener('mousemove', handleCanvasMouseMove);
    EDITOR.canvas.addEventListener('mouseup', handleCanvasMouseUp);
    EDITOR.canvas.addEventListener('mouseleave', handleCanvasMouseUp);

    // Touch events for mobile
    EDITOR.canvas.addEventListener('touchstart', handleTouchStart);
    EDITOR.canvas.addEventListener('touchmove', handleTouchMove);
    EDITOR.canvas.addEventListener('touchend', handleTouchEnd);

    // Category tabs
    document.querySelectorAll('.cat-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.cat-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            EDITOR.currentCategory = tab.dataset.category;
            renderPartsPanel(EDITOR.currentCategory);
            if (typeof playClickSound === 'function') playClickSound();
        });
    });

    // Keyboard events
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Delete' || e.key === 'Backspace') {
            if (EDITOR.selectedPart) {
                removePlacedPart(EDITOR.selectedPart);
                EDITOR.selectedPart = null;
                renderEditor();
                updateStats();
            }
        }
    });
}

/**
 * Handle canvas mouse down
 */
function handleCanvasMouseDown(e) {
    const rect = EDITOR.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check if clicking on existing part
    const clickedPart = getPartAtPosition(x, y);

    if (clickedPart) {
        EDITOR.isDragging = true;
        EDITOR.dragPart = clickedPart;
        EDITOR.dragOffsetX = x - clickedPart.x;
        EDITOR.dragOffsetY = y - clickedPart.y;
        EDITOR.selectedPart = clickedPart;

        // Temporarily remove from placed parts
        EDITOR.placedParts = EDITOR.placedParts.filter(p => p !== clickedPart);
    } else {
        EDITOR.selectedPart = null;
    }

    renderEditor();
}

/**
 * Handle canvas mouse move
 */
function handleCanvasMouseMove(e) {
    if (!EDITOR.isDragging || !EDITOR.dragPart) return;

    const rect = EDITOR.canvas.getBoundingClientRect();
    let x = e.clientX - rect.left - EDITOR.dragOffsetX;
    let y = e.clientY - rect.top - EDITOR.dragOffsetY;

    // Smart snap to center and other parts
    const partDef = getPartById(EDITOR.dragPart.partId);
    const partW = partDef.width * TILE_SIZE;
    const partH = partDef.height * TILE_SIZE;
    const partCenterX = x + partW / 2;

    EDITOR.snapLines = { x: null, y: null };

    // Snap to center line
    const snapThreshold = 10;
    if (Math.abs(partCenterX - EDITOR.centerX) < snapThreshold) {
        x = EDITOR.centerX - partW / 2;
        EDITOR.snapLines.x = EDITOR.centerX;
    }

    // Snap to grid
    x = Math.round(x / EDITOR.gridSize) * EDITOR.gridSize;
    y = Math.round(y / EDITOR.gridSize) * EDITOR.gridSize;

    // Snap to other parts (align to their edges)
    EDITOR.placedParts.forEach(other => {
        const otherDef = getPartById(other.partId);
        const otherW = otherDef.width * TILE_SIZE;
        const otherH = otherDef.height * TILE_SIZE;
        const otherCenterX = other.x + otherW / 2;

        // Horizontal center alignment
        if (Math.abs((x + partW / 2) - otherCenterX) < snapThreshold) {
            x = otherCenterX - partW / 2;
            EDITOR.snapLines.x = otherCenterX;
        }

        // Vertical snap to attach above/below
        if (Math.abs(x - other.x) < snapThreshold * 2 ||
            Math.abs((x + partW) - (other.x + otherW)) < snapThreshold * 2 ||
            Math.abs((x + partW / 2) - (other.x + otherW / 2)) < snapThreshold * 2) {

            // Snap to bottom of other part
            if (Math.abs(y - (other.y + otherH)) < snapThreshold) {
                y = other.y + otherH;
                EDITOR.snapLines.y = y;
            }
            // Snap to top of other part
            if (Math.abs((y + partH) - other.y) < snapThreshold) {
                y = other.y - partH;
                EDITOR.snapLines.y = other.y;
            }
        }
    });

    EDITOR.dragPart.x = x;
    EDITOR.dragPart.y = y;

    renderEditor();
}

/**
 * Handle canvas mouse up
 */
function handleCanvasMouseUp(e) {
    if (EDITOR.isDragging && EDITOR.dragPart) {
        // Keep within bounds
        const partDef = getPartById(EDITOR.dragPart.partId);
        const partW = partDef.width * TILE_SIZE;
        const partH = partDef.height * TILE_SIZE;

        EDITOR.dragPart.x = Math.max(0, Math.min(EDITOR.width - partW, EDITOR.dragPart.x));
        EDITOR.dragPart.y = Math.max(0, Math.min(EDITOR.height - partH, EDITOR.dragPart.y));

        // Add back to placed parts
        EDITOR.placedParts.push(EDITOR.dragPart);
        EDITOR.selectedPart = EDITOR.dragPart;

        // Clear snap lines
        EDITOR.snapLines = { x: null, y: null };

        updateStats();
    }

    EDITOR.isDragging = false;
    EDITOR.dragPart = null;

    renderEditor();
}

/**
 * Touch event handlers
 */
function handleTouchStart(e) {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent('mousedown', {
        clientX: touch.clientX,
        clientY: touch.clientY
    });
    handleCanvasMouseDown(mouseEvent);
}

function handleTouchMove(e) {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent('mousemove', {
        clientX: touch.clientX,
        clientY: touch.clientY
    });
    handleCanvasMouseMove(mouseEvent);
}

function handleTouchEnd(e) {
    handleCanvasMouseUp(e);
}

/**
 * Get part at canvas position
 */
function getPartAtPosition(x, y) {
    // Check in reverse order (top parts first)
    for (let i = EDITOR.placedParts.length - 1; i >= 0; i--) {
        const placed = EDITOR.placedParts[i];
        const partDef = getPartById(placed.partId);

        const partW = partDef.width * TILE_SIZE;
        const partH = partDef.height * TILE_SIZE;

        if (x >= placed.x && x <= placed.x + partW &&
            y >= placed.y && y <= placed.y + partH) {
            return placed;
        }
    }
    return null;
}

/**
 * Remove a placed part
 */
function removePlacedPart(part) {
    EDITOR.placedParts = EDITOR.placedParts.filter(p => p !== part);
}

/**
 * Check if two parts are touching/connected
 */
function arePartsConnected(part1, part2) {
    const def1 = getPartById(part1.partId);
    const def2 = getPartById(part2.partId);

    const w1 = def1.width * TILE_SIZE;
    const h1 = def1.height * TILE_SIZE;
    const w2 = def2.width * TILE_SIZE;
    const h2 = def2.height * TILE_SIZE;

    // Check if parts are adjacent (touching on any edge)
    const tolerance = 2;

    // Horizontal overlap check
    const hOverlap = !(part1.x + w1 < part2.x - tolerance || part2.x + w2 < part1.x - tolerance);

    // Vertical overlap check
    const vOverlap = !(part1.y + h1 < part2.y - tolerance || part2.y + h2 < part1.y - tolerance);

    // Check for top/bottom connection
    const topBottomConnect = hOverlap && (
        Math.abs((part1.y + h1) - part2.y) <= tolerance ||  // part1 above part2
        Math.abs((part2.y + h2) - part1.y) <= tolerance     // part2 above part1
    );

    // Check for left/right connection
    const leftRightConnect = vOverlap && (
        Math.abs((part1.x + w1) - part2.x) <= tolerance ||
        Math.abs((part2.x + w2) - part1.x) <= tolerance
    );

    return topBottomConnect || leftRightConnect;
}

/**
 * Get all connected parts starting from engines at the bottom
 * Returns only parts that form a connected structure with at least one engine
 */
function getConnectedParts() {
    if (EDITOR.placedParts.length === 0) return [];

    // Find all engine parts
    const engines = EDITOR.placedParts.filter(p => {
        const def = getPartById(p.partId);
        return def.category === 'engines';
    });

    if (engines.length === 0) return [];

    // BFS from engines to find all connected parts
    const connected = new Set();
    const queue = [...engines];

    while (queue.length > 0) {
        const current = queue.shift();
        if (connected.has(current.id)) continue;
        connected.add(current.id);

        // Find all parts connected to this one
        EDITOR.placedParts.forEach(other => {
            if (!connected.has(other.id) && arePartsConnected(current, other)) {
                queue.push(other);
            }
        });
    }

    return EDITOR.placedParts.filter(p => connected.has(p.id));
}

/**
 * Check part orientation validity
 * Returns true if part is in a valid orientation
 */
function isPartOrientationValid(placedPart) {
    const def = getPartById(placedPart.partId);

    // Nose cones must be at the top (no parts above them)
    if (def.id === 'nose_cone') {
        const partTop = placedPart.y;
        const partW = def.width * TILE_SIZE;
        const partCenterX = placedPart.x + partW / 2;

        // Check if any connected part is above this one
        return !EDITOR.placedParts.some(other => {
            if (other.id === placedPart.id) return false;
            const otherDef = getPartById(other.partId);
            const otherW = otherDef.width * TILE_SIZE;
            const otherCenterX = other.x + otherW / 2;

            // Check if parts are roughly aligned horizontally
            const aligned = Math.abs(partCenterX - otherCenterX) < partW;

            // Check if other part is above
            return aligned && other.y < partTop;
        });
    }

    // Engines must be at the bottom of their connected group
    if (def.category === 'engines') {
        const partBottom = placedPart.y + def.height * TILE_SIZE;
        const partW = def.width * TILE_SIZE;
        const partCenterX = placedPart.x + partW / 2;

        // Engines can have nothing below them OR other engines
        const partsBelow = EDITOR.placedParts.filter(other => {
            if (other.id === placedPart.id) return false;
            const otherDef = getPartById(other.partId);
            const otherW = otherDef.width * TILE_SIZE;
            const otherCenterX = other.x + otherW / 2;

            const aligned = Math.abs(partCenterX - otherCenterX) < partW;
            return aligned && other.y >= partBottom - 5;
        });

        // If there are parts below, they must all be engines or fins
        return partsBelow.every(p => {
            const d = getPartById(p.partId);
            return d.category === 'engines' || d.category === 'control';
        });
    }

    return true;
}

/**
 * Add part from palette
 */
function addPart(partId) {
    const partDef = getPartById(partId);
    if (!partDef) return;

    if (typeof playClickSound === 'function') playClickSound();

    // Place at center, above existing parts or on pad
    let placeY = EDITOR.padY - partDef.height * TILE_SIZE;

    // Find highest existing part to stack on top
    if (EDITOR.placedParts.length > 0) {
        const minY = Math.min(...EDITOR.placedParts.map(p => p.y));
        const topPart = EDITOR.placedParts.find(p => p.y === minY);
        if (topPart) {
            placeY = topPart.y - partDef.height * TILE_SIZE;
        }
    }

    const newPart = {
        id: Date.now(),
        partId: partId,
        x: EDITOR.centerX - (partDef.width * TILE_SIZE) / 2,
        y: placeY
    };

    EDITOR.placedParts.push(newPart);
    EDITOR.selectedPart = newPart;

    updateStats();
    renderEditor();
}

/**
 * Render parts panel
 */
function renderPartsPanel(category) {
    const container = document.getElementById('parts-list');
    container.innerHTML = '';

    const parts = getPartsByCategory(category);
    const isFunMode = document.getElementById('btn-fun-mode').classList.contains('active');
    const isAdvancedMode = document.getElementById('btn-advanced-mode') &&
        document.getElementById('btn-advanced-mode').classList.contains('active');
    const currentLevel = GAME ? GAME.currentLevel : 0;

    parts.forEach(part => {
        const isUnlocked = isPartUnlocked(part.id, currentLevel, isFunMode, isAdvancedMode);

        const item = document.createElement('div');
        item.className = `part-item${isUnlocked ? '' : ' locked'}`;

        // Create icon
        const iconUrl = createPartIcon(part);

        item.innerHTML = `
            <div class="part-icon">
                <img src="${iconUrl}" alt="${part.name}" style="image-rendering: pixelated; width: 100%; height: 100%;">
            </div>
            <div class="part-info">
                <div class="part-name">${part.name}</div>
                <div class="part-stats">
                    ${part.mass}kg
                    ${part.thrust ? ` | ${part.thrust}kN` : ''}
                    ${part.fuelCapacity ? ` | ${part.fuelCapacity} fuel` : ''}
                </div>
            </div>
        `;

        if (isUnlocked) {
            item.addEventListener('click', () => addPart(part.id));

            // Make draggable
            item.draggable = true;
            item.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', part.id);
            });

            // Add tooltip
            if (typeof setupTooltipFor === 'function') {
                setupTooltipFor(item, part);
            }
        }

        container.appendChild(item);
    });
}

/**
 * Handle drop on canvas
 */
function setupCanvasDrop() {
    EDITOR.canvas.addEventListener('dragover', (e) => {
        e.preventDefault();
    });

    EDITOR.canvas.addEventListener('drop', (e) => {
        e.preventDefault();
        const partId = e.dataTransfer.getData('text/plain');
        if (!partId) return;

        const partDef = getPartById(partId);
        if (!partDef) return;

        const rect = EDITOR.canvas.getBoundingClientRect();
        let x = e.clientX - rect.left - (partDef.width * TILE_SIZE) / 2;
        let y = e.clientY - rect.top - (partDef.height * TILE_SIZE) / 2;

        // Snap to grid
        x = Math.round(x / EDITOR.gridSize) * EDITOR.gridSize;
        y = Math.round(y / EDITOR.gridSize) * EDITOR.gridSize;

        // Snap to center
        const partCenterX = x + (partDef.width * TILE_SIZE) / 2;
        if (Math.abs(partCenterX - EDITOR.centerX) < 20) {
            x = EDITOR.centerX - (partDef.width * TILE_SIZE) / 2;
        }

        const newPart = {
            id: Date.now(),
            partId: partId,
            x: x,
            y: y
        };

        EDITOR.placedParts.push(newPart);
        EDITOR.selectedPart = newPart;

        if (typeof playClickSound === 'function') playClickSound();
        updateStats();
        renderEditor();
    });
}

/**
 * Render the editor canvas
 */
function renderEditor() {
    const ctx = EDITOR.ctx;

    // Clear canvas
    ctx.clearRect(0, 0, EDITOR.width, EDITOR.height);

    // Draw sky gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, EDITOR.height);
    gradient.addColorStop(0, '#000011');
    gradient.addColorStop(0.4, '#000033');
    gradient.addColorStop(0.7, '#001144');
    gradient.addColorStop(1, '#003366');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, EDITOR.width, EDITOR.height);

    // Draw stars
    ctx.fillStyle = '#ffffff';
    for (let i = 0; i < 50; i++) {
        const x = (i * 137) % EDITOR.width;
        const y = (i * 97) % (EDITOR.height * 0.6);
        const size = (i % 3) + 1;
        ctx.globalAlpha = 0.3 + (i % 5) * 0.15;
        ctx.fillRect(x, y, size, size);
    }
    ctx.globalAlpha = 1;

    // Draw center alignment line (subtle)
    ctx.strokeStyle = 'rgba(0, 255, 255, 0.15)';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 10]);
    ctx.beginPath();
    ctx.moveTo(EDITOR.centerX, 0);
    ctx.lineTo(EDITOR.centerX, EDITOR.height);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw grid (subtle)
    if (EDITOR.showGrid) {
        ctx.strokeStyle = 'rgba(100, 150, 200, 0.08)';
        ctx.lineWidth = 1;

        for (let x = 0; x < EDITOR.width; x += EDITOR.gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, EDITOR.height);
            ctx.stroke();
        }

        for (let y = 0; y < EDITOR.height; y += EDITOR.gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(EDITOR.width, y);
            ctx.stroke();
        }
    }

    // Get connected parts for rendering
    const connectedParts = getConnectedParts();
    const connectedIds = new Set(connectedParts.map(p => p.id));

    // Draw placed parts
    EDITOR.placedParts.forEach(placed => {
        const partDef = getPartById(placed.partId);
        const isConnected = connectedIds.has(placed.id);
        const isValidOrientation = isPartOrientationValid(placed);

        // Calculate flip based on position relative to center
        const partWidth = partDef.width * TILE_SIZE;
        const partCenterX = placed.x + partWidth / 2;
        // Flip if on the left side of the rocket (and not centered)
        // using a small epsilon for float comparison safety
        const flipX = partCenterX < EDITOR.centerX - 1;

        // Draw part
        ctx.globalAlpha = isConnected ? 1 : 0.4;
        drawPart(ctx, partDef, placed.x, placed.y, 1, flipX);
        ctx.globalAlpha = 1;

        // Draw connection warning for disconnected parts
        if (!isConnected && EDITOR.placedParts.some(p => {
            const d = getPartById(p.partId);
            return d.category === 'engines';
        })) {
            ctx.strokeStyle = '#ff6600';
            ctx.lineWidth = 2;
            ctx.setLineDash([3, 3]);
            ctx.strokeRect(placed.x - 1, placed.y - 1,
                partDef.width * TILE_SIZE + 2,
                partDef.height * TILE_SIZE + 2);
            ctx.setLineDash([]);

            // Warning icon
            ctx.fillStyle = '#ff6600';
            ctx.font = '12px Arial';
            ctx.fillText('⚠', placed.x + partDef.width * TILE_SIZE - 12, placed.y + 14);
        }

        // Draw orientation warning
        if (!isValidOrientation) {
            ctx.strokeStyle = '#ff3366';
            ctx.lineWidth = 2;
            ctx.setLineDash([2, 2]);
            ctx.strokeRect(placed.x - 1, placed.y - 1,
                partDef.width * TILE_SIZE + 2,
                partDef.height * TILE_SIZE + 2);
            ctx.setLineDash([]);

            ctx.fillStyle = '#ff3366';
            ctx.font = '10px Arial';
            ctx.fillText('↕', placed.x + 2, placed.y + 12);
        }

        // Selection highlight
        if (placed === EDITOR.selectedPart) {
            ctx.strokeStyle = '#00ffff';
            ctx.lineWidth = 2;
            ctx.setLineDash([4, 4]);
            ctx.strokeRect(
                placed.x - 2,
                placed.y - 2,
                partDef.width * TILE_SIZE + 4,
                partDef.height * TILE_SIZE + 4
            );
            ctx.setLineDash([]);
        }
    });

    // Draw snap lines while dragging
    if (EDITOR.isDragging) {
        ctx.strokeStyle = '#00ffff';
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 3]);

        if (EDITOR.snapLines.x !== null) {
            ctx.beginPath();
            ctx.moveTo(EDITOR.snapLines.x, 0);
            ctx.lineTo(EDITOR.snapLines.x, EDITOR.height);
            ctx.stroke();
        }

        if (EDITOR.snapLines.y !== null) {
            ctx.beginPath();
            ctx.moveTo(0, EDITOR.snapLines.y);
            ctx.lineTo(EDITOR.width, EDITOR.snapLines.y);
            ctx.stroke();
        }

        ctx.setLineDash([]);
    }

    // Draw dragging part
    if (EDITOR.isDragging && EDITOR.dragPart) {
        const partDef = getPartById(EDITOR.dragPart.partId);
        const partW = partDef.width * TILE_SIZE;
        const partCX = EDITOR.dragPart.x + partW / 2;
        const flipDrag = partCX < EDITOR.centerX - 1;

        ctx.globalAlpha = 0.7;
        drawPart(ctx, partDef, EDITOR.dragPart.x, EDITOR.dragPart.y, 1, flipDrag);
        ctx.globalAlpha = 1;
    }
}

/**
 * Update stats display - now uses only connected parts
 */
function updateStats() {
    // Get only connected parts for calculations
    const connectedParts = getConnectedParts();
    const allParts = EDITOR.placedParts;

    // Calculate stats from connected parts only
    const twr = calculateTWR(connectedParts);
    const mass = calculateTotalMass(connectedParts, calculateTotalFuel(connectedParts));
    const thrust = calculateTotalThrust(connectedParts);
    const deltaV = calculateDeltaV(connectedParts);
    const altitude = estimateAltitude(connectedParts);
    const efficiency = calculateEfficiency(connectedParts);

    // Count disconnected parts
    const disconnectedCount = allParts.length - connectedParts.length;

    // Update display
    document.getElementById('stat-twr').textContent = twr.toFixed(2);
    document.getElementById('stat-mass').textContent = `${Math.round(mass)} kg`;
    document.getElementById('stat-thrust').textContent = `${thrust} kN`;
    document.getElementById('stat-deltav').textContent = `${Math.round(deltaV)} m/s`;
    document.getElementById('stat-altitude').textContent = formatAltitude(altitude);
    document.getElementById('stat-efficiency').textContent = `${Math.round(efficiency)}%`;

    // Color TWR based on value
    const twrEl = document.getElementById('stat-twr');
    if (twr < 1) {
        twrEl.style.color = '#ff3366';
    } else if (twr < 1.3) {
        twrEl.style.color = '#ffaa00';
    } else if (twr > 5) {
        twrEl.style.color = '#ff3366'; // Danger - too high!
    } else {
        twrEl.style.color = '#00ffff';
    }

    // Show warning if disconnected parts
    if (disconnectedCount > 0) {
        document.getElementById('stat-mass').textContent += ` (${disconnectedCount} ⚠)`;
    }

    // Enable/disable launch button - require valid connected rocket
    const launchBtn = document.getElementById('btn-launch');
    const hasValidRocket = twr >= 1 && connectedParts.length > 0;
    launchBtn.disabled = !hasValidRocket;

    // Update educational pre-launch analysis
    updatePreLaunchAnalysis(connectedParts);
}

/**
 * Update educational pre-launch analysis panel
 */
function updatePreLaunchAnalysis(parts) {
    const analysisContent = document.getElementById('analysis-content');
    if (!analysisContent) return;

    // Get analysis from physics engine
    const analysis = typeof preLaunchAnalysis === 'function' ?
        preLaunchAnalysis(parts) : null;

    if (!analysis) return;

    // Update risk indicator
    const riskIndicator = document.getElementById('risk-indicator');
    if (riskIndicator) {
        riskIndicator.className = `risk-indicator ${analysis.overallRisk.toLowerCase()}`;

        const riskIcons = {
            'LOW': '✓',
            'MEDIUM': '⚠️',
            'HIGH': '⛔',
            'CRITICAL': '🚫'
        };

        riskIndicator.innerHTML = `
            <span class="risk-icon">${riskIcons[analysis.overallRisk] || '?'}</span>
            <span class="risk-label">RISK: ${analysis.overallRisk}</span>
        `;
    }

    // Update warnings
    const warningsContainer = document.getElementById('analysis-warnings');
    if (warningsContainer && analysis.warnings.length > 0) {
        warningsContainer.innerHTML = '<div style="font-size: 9px; color: var(--text-muted); margin-bottom: 4px;">WARNINGS:</div>' +
            analysis.warnings.map(w => `
                <div class="warning-item ${w.severity}">
                    <span class="warning-icon">${w.icon}</span>
                    <div class="warning-content">
                        <div class="warning-title">${w.title}</div>
                        <div class="warning-message">${w.message}</div>
                    </div>
                </div>
            `).join('');
    } else if (warningsContainer) {
        warningsContainer.innerHTML = '';
    }

    // Update suggestions
    const suggestionsContainer = document.getElementById('analysis-suggestions');
    if (suggestionsContainer && analysis.suggestions.length > 0) {
        suggestionsContainer.innerHTML = '<div style="font-size: 9px; color: var(--text-muted); margin: 8px 0 4px 0;">SUGGESTIONS:</div>' +
            analysis.suggestions.map(s => `
                <div class="suggestion-item">
                    <span class="suggestion-icon">${s.icon}</span>
                    <div class="suggestion-content">
                        <div class="suggestion-title">${s.title}</div>
                        <div class="suggestion-message">${s.message}</div>
                        <div class="suggestion-benefit">→ ${s.benefit}</div>
                    </div>
                </div>
            `).join('');
    } else if (suggestionsContainer) {
        suggestionsContainer.innerHTML = '';
    }

    // Update predictions
    const predictionsGrid = document.getElementById('predictions-grid');
    if (predictionsGrid && analysis.predictions) {
        const p = analysis.predictions;

        predictionsGrid.innerHTML = `
            <div class="prediction-item">
                <div class="prediction-label">Predicted Max G</div>
                <div class="prediction-value ${p.predictedMaxG > PHYSICS.MAX_G_LIMIT ? 'danger' : p.predictedMaxG > 7 ? 'warning' : ''}">${p.predictedMaxG.toFixed(1)}g</div>
            </div>
            <div class="prediction-item">
                <div class="prediction-label">Predicted Max Q</div>
                <div class="prediction-value ${p.predictedMaxQ > PHYSICS.MAX_Q_LIMIT ? 'danger' : p.predictedMaxQ > 25000 ? 'warning' : ''}">${(p.predictedMaxQ / 1000).toFixed(0)} kPa</div>
            </div>
            <div class="prediction-item">
                <div class="prediction-label">Nose Cone</div>
                <div class="prediction-value ${!p.hasNoseCone ? 'warning' : ''}">${p.hasNoseCone ? '✓ YES' : '✗ NO'}</div>
            </div>
            <div class="prediction-item">
                <div class="prediction-label">Delta-V</div>
                <div class="prediction-value ${p.deltaV < 1000 ? 'warning' : ''}">${Math.round(p.deltaV)} m/s</div>
            </div>
        `;
    }
}

/**
 * Setup educational toggle
 */
function setupEducationalToggle() {
    const toggle = document.getElementById('edu-toggle');
    const switchEl = document.getElementById('edu-switch');
    const content = document.getElementById('analysis-content');

    if (toggle && switchEl && content) {
        // Load saved preference
        const savedState = localStorage.getItem('eduAnalysisEnabled');
        if (savedState === 'true') {
            switchEl.classList.add('active');
            content.classList.add('visible');
        }

        toggle.addEventListener('click', () => {
            switchEl.classList.toggle('active');
            content.classList.toggle('visible');

            // Save preference
            localStorage.setItem('eduAnalysisEnabled', switchEl.classList.contains('active'));

            if (typeof playClickSound === 'function') playClickSound();
        });
    }
}

// Initialize educational toggle when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(setupEducationalToggle, 200);
});

/**
 * Format altitude for display
 */
function formatAltitude(meters) {
    if (meters >= 1000000) {
        return `${(meters / 1000000).toFixed(1)}M m`;
    } else if (meters >= 1000) {
        return `${(meters / 1000).toFixed(1)} km`;
    } else {
        return `${Math.round(meters)} m`;
    }
}

/**
 * Clear all parts
 */
function clearEditor() {
    EDITOR.placedParts = [];
    EDITOR.selectedPart = null;
    updateStats();
    renderEditor();
}

/**
 * Save rocket design to localStorage
 */
function saveRocket() {
    const saveData = {
        parts: EDITOR.placedParts,
        timestamp: Date.now()
    };

    const savedRockets = JSON.parse(localStorage.getItem('pixelRockets') || '[]');
    savedRockets.push(saveData);
    localStorage.setItem('pixelRockets', JSON.stringify(savedRockets));

    if (typeof playClickSound === 'function') playClickSound();
    alert('Rocket saved!');
}

/**
 * Load last saved rocket
 */
function loadRocket() {
    const savedRockets = JSON.parse(localStorage.getItem('pixelRockets') || '[]');

    if (savedRockets.length === 0) {
        alert('No saved rockets found!');
        return;
    }

    const lastSave = savedRockets[savedRockets.length - 1];
    EDITOR.placedParts = lastSave.parts;
    EDITOR.selectedPart = null;

    if (typeof playClickSound === 'function') playClickSound();
    updateStats();
    renderEditor();

    alert('Rocket loaded!');
}

/**
 * Get connected parts for physics (exported for use by main.js)
 */
function getValidRocketParts() {
    return getConnectedParts();
}

// Initialize drag and drop on canvas
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(setupCanvasDrop, 100);
});
