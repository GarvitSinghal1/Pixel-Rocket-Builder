/**
 * PIXEL ROCKET BUILDER - Tooltips
 * Shows helpful information when hovering over parts
 */

let currentTooltip = null;

/**
 * Show tooltip for a part
 */
function showTooltip(part, x, y) {
    hideTooltip();

    if (!part.tooltip) return;

    const tooltip = document.createElement('div');
    tooltip.className = 'part-tooltip';
    const statsHtml = generateStatsHtml(part);
    tooltip.innerHTML = `
        <div class="tooltip-name">${part.name}</div>
        <div class="tooltip-desc">${part.tooltip}</div>
        ${statsHtml}
    `;

    document.body.appendChild(tooltip);

    // Position tooltip
    const rect = tooltip.getBoundingClientRect();
    tooltip.style.left = Math.min(x + 15, window.innerWidth - rect.width - 10) + 'px';
    tooltip.style.top = Math.min(y + 15, window.innerHeight - rect.height - 10) + 'px';

    currentTooltip = tooltip;
}

/**
 * Hide current tooltip
 */
function hideTooltip() {
    if (currentTooltip) {
        currentTooltip.remove();
        currentTooltip = null;
    }
}

/**
 * Setup tooltip listeners for a DOM element
 */
function setupTooltipFor(element, part) {
    element.addEventListener('mouseenter', (e) => {
        showTooltip(part, e.clientX, e.clientY);
    });

    element.addEventListener('mouseleave', hideTooltip);

    element.addEventListener('mousemove', (e) => {
        if (currentTooltip) {
            const rect = currentTooltip.getBoundingClientRect();
            currentTooltip.style.left = Math.min(e.clientX + 15, window.innerWidth - rect.width - 10) + 'px';
            currentTooltip.style.top = Math.min(e.clientY + 15, window.innerHeight - rect.height - 10) + 'px';
        }
    });
}

/**
 * Generate HTML for part statistics
 */
function generateStatsHtml(part) {
    let stats = [];

    // Mass (Dry & Wet)
    const dryMass = part.mass;
    const wetMass = dryMass + (part.fuelCapacity || 0);

    // Display
    if (part.fuelCapacity) {
        if (wetMass > 1000) {
            stats.push({ label: 'Mass', value: `${(dryMass / 1000).toFixed(1)}t (Dry) / ${(wetMass / 1000).toFixed(1)}t (Wet)` });
        } else {
            stats.push({ label: 'Mass', value: `${dryMass}kg / ${wetMass}kg` });
        }
    } else {
        stats.push({ label: 'Mass', value: `${dryMass}kg` });
    }

    // Engine Stats
    if (part.category === 'engines') {
        stats.push({ label: 'Thrust', value: `${part.thrust} kN` });
        stats.push({ label: 'ISP', value: `${part.isp || 250} s` });
    }

    // Fuel Stats
    if (part.fuelCapacity) {
        stats.push({ label: 'Fuel', value: `${part.fuelCapacity}` });
    }

    // Drag Stats
    if (part.dragReduction) {
        stats.push({ label: 'Drag Red.', value: `-${Math.round(part.dragReduction * 100)}%` });
    }

    // Structure
    if (part.stability) {
        stats.push({ label: 'Stability', value: `+${Math.round(part.stability * 100)}%` });
    }

    if (stats.length === 0) return '';

    return `
        <div class="tooltip-stats" style="margin-top: 8px; border-top: 1px solid rgba(255,255,255,0.2); padding-top: 5px; font-size: 0.9em;">
            ${stats.map(s => `
                <div class="stat-row" style="display: flex; justify-content: space-between; gap: 15px;">
                    <span class="stat-label" style="color: #aaa;">${s.label}:</span>
                    <span class="stat-value" style="color: #fff; font-weight: bold;">${s.value}</span>
                </div>
            `).join('')}
        </div>
    `;
}
