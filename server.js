const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(cors());
app.use(express.json());

// Simulation State
let riders = [
    { id: 'R1', name: 'Alex Rivera', lat: 40.7128, lng: -74.0060, status: 'In Transit', score: 98, route: [] },
    { id: 'R2', name: 'Sarah Chen', lat: 40.7306, lng: -73.9352, status: 'Delayed', score: 82, route: [] },
    { id: 'R3', name: 'Marco V.', lat: 40.7589, lng: -73.9851, status: 'Idle', score: 91, route: [] }
];

// Predictive Traffic Logic (Node.js Port)
const getPredictiveETA = (distance, baseTraffic) => {
    const futureFactor = 1 + (Math.random() * 0.4); // Simulating 40min window
    return Math.round((distance / 20) * baseTraffic * futureFactor);
};

// Endpoints
app.get('/api/fleet', (req, res) => res.json(riders));

app.post('/api/optimize', (req, res) => {
    const { source, destination } = req.body;
    // Mocking Route Comparison
    const options = [
        { id: 'A', name: 'Predictive Path A', eta: getPredictiveETA(15, 1.2), distance: '12.4km', traffic: 'Low (Predicted)' },
        { id: 'B', name: 'Standard Path B', eta: getPredictiveETA(15, 1.8), distance: '13.1km', traffic: 'Heavy' }
    ];
    res.json({ status: 'success', options });
});

// Real-time Simulation Loop
setInterval(() => {
    riders = riders.map(r => ({
        ...r,
        lat: r.lat + (Math.random() - 0.5) * 0.001,
        lng: r.lng + (Math.random() - 0.5) * 0.001
    }));
    io.emit('fleet_update', riders);
    
    // Random Dynamic Re-routing event
    if (Math.random() > 0.95) {
        io.emit('route_update', { 
            message: "Route updated for Sarah Chen due to congestion on Lex Ave.",
            riderId: 'R2',
            priority: 'high'
        });
    }
}, 3000);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 RouteSense Pro Backend on port ${PORT}`));
