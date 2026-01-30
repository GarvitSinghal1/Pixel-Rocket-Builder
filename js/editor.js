/**
 * PIXEL ROCKET BUILDER - Editor
 * Drag-and-drop rocket building interface
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
    currentCategory: 'engines'
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
    const x = e.clientX - rect.left - EDITOR.dragOffsetX;
    const y = e.clientY - rect.top - EDITOR.dragOffsetY;

    EDITOR.dragPart.x = x;
    EDITOR.dragPart.y = y;

    renderEditor();
}

/**
 * Handle canvas mouse up
 */
function handleCanvasMouseUp(e) {
    if (EDITOR.isDragging && EDITOR.dragPart) {
        // Snap to grid
        EDITOR.dragPart.x = Math.round(EDITOR.dragPart.x / EDITOR.gridSize) * EDITOR.gridSize;
        EDITOR.dragPart.y = Math.round(EDITOR.dragPart.y / EDITOR.gridSize) * EDITOR.gridSize;

        // Keep within bounds
        const partDef = getPartById(EDITOR.dragPart.partId);
        const partW = partDef.width * TILE_SIZE;
        const partH = partDef.height * TILE_SIZE;

        EDITOR.dragPart.x = Math.max(0, Math.min(EDITOR.width - partW, EDITOR.dragPart.x));
        EDITOR.dragPart.y = Math.max(0, Math.min(EDITOR.height - partH, EDITOR.dragPart.y));

        // Add back to placed parts
        EDITOR.placedParts.push(EDITOR.dragPart);
        EDITOR.selectedPart = EDITOR.dragPart;

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
 * Add part from palette
 */
function addPart(partId) {
    const partDef = getPartById(partId);
    if (!partDef) return;

    const newPart = {
        id: Date.now(),
        partId: partId,
        x: EDITOR.padX + EDITOR.padWidth / 2 - (partDef.width * TILE_SIZE) / 2,
        y: EDITOR.padY - partDef.height * TILE_SIZE
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
    const currentLevel = GAME.currentLevel || 0;

    parts.forEach(part => {
        const isUnlocked = isPartUnlocked(part.id, currentLevel, isFunMode);

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

        const newPart = {
            id: Date.now(),
            partId: partId,
            x: x,
            y: y
        };

        EDITOR.placedParts.push(newPart);
        EDITOR.selectedPart = newPart;

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

    // Draw grid (subtle)
    if (EDITOR.showGrid) {
        ctx.strokeStyle = 'rgba(100, 150, 200, 0.1)';
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

    // Draw placed parts
    EDITOR.placedParts.forEach(placed => {
        const partDef = getPartById(placed.partId);
        drawPart(ctx, partDef, placed.x, placed.y);

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

    // Draw dragging part
    if (EDITOR.isDragging && EDITOR.dragPart) {
        const partDef = getPartById(EDITOR.dragPart.partId);
        ctx.globalAlpha = 0.7;
        drawPart(ctx, partDef, EDITOR.dragPart.x, EDITOR.dragPart.y);
        ctx.globalAlpha = 1;
    }
}

/**
 * Update stats display
 */
function updateStats() {
    const parts = EDITOR.placedParts;

    // Calculate stats
    const twr = calculateTWR(parts);
    const mass = calculateTotalMass(parts, calculateTotalFuel(parts));
    const thrust = calculateTotalThrust(parts);
    const deltaV = calculateDeltaV(parts);
    const altitude = estimateAltitude(parts);
    const efficiency = calculateEfficiency(parts);

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
    } else {
        twrEl.style.color = '#00ffff';
    }

    // Enable/disable launch button
    const launchBtn = document.getElementById('btn-launch');
    launchBtn.disabled = twr < 1 || parts.length === 0;
}

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

    updateStats();
    renderEditor();

    alert('Rocket loaded!');
}

// Initialize drag and drop on canvas
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(setupCanvasDrop, 100);
});
