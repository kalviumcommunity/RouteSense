/**
 * RouteSense Application Logic
 * Handles simple routing, form subsmissions, and dashboard map interactions
 */

// View Navigation Handler
function navigateTo(viewId) {
    if (viewId === 'landing') {
        window.location.href = '/';
    } else {
        window.location.href = '/' + viewId;
    }
}

// Auth Handlers
function handleAuth(event, targetView) {
    event.preventDefault();
    
    const btn = event.target.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;
    
    // Loading state
    btn.innerHTML = '<span class="pulse" style="display:inline-block; margin-right:8px; width:10px; height:10px; background:#0B0F19"></span> Processing...';
    btn.disabled = true;

    // Simulate API Call
    setTimeout(() => {
        btn.innerHTML = originalText;
        btn.disabled = false;
        navigateTo(targetView);
    }, 1200);
}

// Dashboard Map Simulation
let isMapInit = false;

function initDashboardMap() {
    if (isMapInit) return;
    updateAnalytics(); // Fetch top bar data immediately
    setInterval(updateAnalytics, 15000); // 15s refresh
    
    // Call Python backend to get intelligent route logic
    fetchOptimizationData();
    isMapInit = true;
}

// Map rendering from API
async function fetchOptimizationData() {
    try {
        const mapContainer = document.getElementById('dashboard-map');
        if (!mapContainer) return;

        // Visual loading state
        mapContainer.innerHTML = '<div id="map-loading-state" style="position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); color:var(--primary-color); font-weight:600;"><span class="pulse" style="display:inline-block; margin-right:8px; width:10px; height:10px; background:#00F2FE"></span> Synthesizing Data Models...</div>';
        
        const response = await fetch('/api/optimize');
        const data = await response.json();
        
        if(data.status !== 'success') throw new Error(data.message);
        
        // Setup Map Environment on Success
        mapContainer.innerHTML = ''; // clear loading

        // Create SVG for routes
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("width", "100%");
        svg.setAttribute("height", "100%");
        svg.style.position = "absolute";
        svg.style.inset = "0";
        svg.id = "map-svg";
        mapContainer.appendChild(svg);

        // We received intelligent path formatting and standard path arrays:
        const smartPath = data.smart_path;
        const legacyPath = data.legacy_path;

        // Draw points for smartPath
        smartPath.forEach(pt => {
            const ptEl = document.createElement('div');
            ptEl.className = 'map-point';
            ptEl.style.left = `${pt.x}%`;
            ptEl.style.top = `${pt.y}%`;
            mapContainer.appendChild(ptEl);
        });

        // Link legacy paths (red/faded)
        for(let i=0; i<legacyPath.length-1; i++) {
            createRoute(svg, legacyPath[i], legacyPath[i+1], false, true); 
        }

        // Link smart paths (green/highlighted)
        for(let i=0; i<smartPath.length-1; i++) {
            createRoute(svg, smartPath[i], smartPath[i+1], true, false);
        }

        // Send a vehicle down the smart path
        if(smartPath.length > 1) {
             addVehicle(mapContainer, smartPath[0], smartPath[smartPath.length-1], 3500);
        }

        // Update UI with intelligence inputs
        document.getElementById('val-source').innerText = data.source;
        document.getElementById('val-destination').innerText = data.destination;
        document.getElementById('val-weather').innerText = data.weather;
        document.getElementById('val-day').innerText = data.day;

        // Show recommendation
        const recBox = document.getElementById('recommendation-box');
        const recText = document.getElementById('recommendation-text');
        if(recBox && recText) {
            recBox.style.display = 'flex';
            recText.innerText = data.metrics.recommendation;
        }

        // Update dashboard UI if benefits exist
        if(data.metrics) {
            lastMetrics = data.metrics;
            const predEta = document.getElementById('val-predicted-eta');
            if(predEta) predEta.innerText = data.metrics.predicted_travel_time;
            updateAlertUI(data.metrics);
        }

    } catch(err) {
        console.error("Data Model Server Offline - Reverting to Dummy mode.", err);
        runDummyMapFallback();
    }
}

function updateAlertUI(metrics) {
    const list = document.getElementById('intelligence-alerts');
    if (!list) return;
    
    const item = document.createElement('li');
    item.className = 'alert-item success';
    item.innerHTML = `
        <span class="alert-icon">✓</span>
        <div class="alert-content">
             <strong>Route Synthesis Complete</strong>
            <p>Predicting <b>${metrics.predicted_travel_time}</b> travel time. Optimized to save ${metrics.time_saved} (${metrics.optimization_benefit}%) vs legacy routing.</p>
        </div>
        <span class="alert-time">${metrics.timestamp}</span>
    `;
    list.prepend(item);
}

// Global state to keep dashboard consistent
let lastMetrics = null;

// Fetches from /api/analytics
async function updateAnalytics() {
    try {
        const response = await fetch('/api/analytics');
        const data = await response.json();
        
        const boxes = document.querySelectorAll('.stats-row .stat-card .stat-value');
        if(boxes.length >= 3) {
            // Update stats, but preserve the latest AI prediction if it exists
            boxes[0].innerText = data.active_deliveries.toLocaleString();
            
            if (lastMetrics) {
                boxes[1].innerText = lastMetrics.predicted_travel_time;
                boxes[1].style.color = 'var(--primary-color)';
            } else {
                boxes[1].innerText = data.avg_delay_time;
                boxes[1].style.color = 'var(--text-main)';
            }
            
            boxes[2].innerText = data.fuel_saved_total;
        }
    } catch(err){
        console.error("Analytics fetch failed:", err);
    }
}

// Side-bar interaction simulation
document.querySelectorAll('.sidebar-nav li').forEach(item => {
    item.addEventListener('click', () => {
        document.querySelectorAll('.sidebar-nav li').forEach(li => li.classList.remove('active'));
        item.classList.add('active');
        
        // Trigger a visual refresh
        if (item.innerText.includes('Overview') || item.innerText.includes('Routes')) {
            fetchOptimizationData();
        } else if (item.innerText.includes('Analytics')) {
            updateAnalytics();
        }
    });
});

// Stat cards interaction
document.querySelectorAll('.stat-card').forEach(card => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', () => {
        card.style.transform = 'scale(0.98)';
        setTimeout(() => card.style.transform = 'translateY(-2px)', 100);
        updateAnalytics();
    });
});

function runDummyMapFallback() {
    const mapContainer = document.getElementById('dashboard-map');
    if(!mapContainer) return;
    mapContainer.innerHTML = '';
    
    // Create SVG for routes
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "100%");
    svg.style.position = "absolute";
    svg.style.inset = "0";
    svg.id = "map-svg";
    mapContainer.appendChild(svg);

    const points = [];
    const numPoints = 8;
    for (let i = 0; i < numPoints; i++) {
        const x = Math.floor(Math.random() * 80) + 10;
        const y = Math.floor(Math.random() * 80) + 10;
        points.push({x, y});
        const ptEl = document.createElement('div');
        ptEl.className = 'map-point'; ptEl.style.left = `${x}%`; ptEl.style.top = `${y}%`;
        mapContainer.appendChild(ptEl);
    }
    createRoute(svg, points[0], points[1], false);
    createRoute(svg, points[1], points[2], false);
    createRoute(svg, points[3], points[4], true);
    createRoute(svg, points[4], points[5], true);
    addVehicle(mapContainer, points[3], points[5], 4000);
}

function createRoute(container, p1, p2, isOptimized, isLegacy = false) {
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", `${p1.x}%`);
    line.setAttribute("y1", `${p1.y}%`);
    line.setAttribute("x2", `${p2.x}%`);
    line.setAttribute("y2", `${p2.y}%`);
    
    line.setAttribute("class", `map-route-svg ${isOptimized ? 'optimized' : ''} ${isLegacy ? 'legacy' : ''}`);
    
    container.appendChild(line);
}

function addVehicle(container, p1, p2, duration) {
    const vehicle = document.createElement('div');
    vehicle.className = 'map-vehicle';
    vehicle.style.left = `${p1.x}%`;
    vehicle.style.top = `${p1.y}%`;
    
    // Add a pulsing effect to the vehicle
    vehicle.innerHTML = '<div class="vehicle-core"></div><div class="vehicle-pulse"></div>';
    
    container.appendChild(vehicle);

    // Animate between p1 and p2 using CSS transitions
    setTimeout(() => {
        vehicle.style.transition = `all ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`;
        vehicle.style.left = `${p2.x}%`;
        vehicle.style.top = `${p2.y}%`;
    }, 100);

    // Loop animation
    setInterval(() => {
        vehicle.style.transition = 'none';
        vehicle.style.left = `${p1.x}%`;
        vehicle.style.top = `${p1.y}%`;
        setTimeout(() => {
            vehicle.style.transition = `all ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`;
            vehicle.style.left = `${p2.x}%`;
            vehicle.style.top = `${p2.y}%`;
        }, 100);
    }, duration + 500);
}

    // Initial Setup
    document.addEventListener('DOMContentLoaded', () => {
        console.log("✅ RouteSense Frontend Initialized Successfully.");
        
        // Init map if on dashboard
        if (window.location.pathname === '/dashboard') {
            initDashboardMap();
        }
        
        // Setup smooth scrolling for hash links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if(target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});

// Password Visibility Toggle
function togglePasswordVisibility(inputId, iconId) {
    const input = document.getElementById(inputId);
    const iconContainer = document.getElementById(iconId);
    if (!input || !iconContainer) return;
    
    if (input.type === 'password') {
        input.type = 'text';
        iconContainer.innerHTML = '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line>';
    } else {
        input.type = 'password';
        iconContainer.innerHTML = '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle>';
    }
}
