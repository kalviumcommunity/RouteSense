from flask import Flask, jsonify, send_from_directory, request
import networkx as nx
import random
import time
import math
from datetime import datetime

app = Flask(__name__, static_folder=".")

# ==========================================
# CORE DATA MODEL: Route Optimization Engine
# ==========================================

def get_time_factor():
    hour = datetime.now().hour
    if 8 <= hour <= 10: return 2.5 # Morning Rush
    elif 11 <= hour <= 15: return 1.5 # Mid-day
    elif 16 <= hour <= 19: return 3.0 # Evening Rush
    else: return 0.8 # Night

def get_day_factor():
    day = datetime.now().weekday()
    if day < 5: return 1.2 # Weekday heavier
    else: return 0.9 # Weekend lighter

def get_weather_factor():
    state = random.choices(["clear", "rain", "snow", "storm"], weights=[0.7, 0.2, 0.05, 0.05])[0]
    impact = {"clear": 1.0, "rain": 1.3, "snow": 1.8, "storm": 2.5}
    return impact[state], state

def build_urban_data_model():
    """
    Builds a simulated graph with locality and multi-factor data.
    """
    G = nx.grid_2d_graph(6, 6) 
    localities = ["Downtown", "Midtown", "Uptown", "Zone A", "Zone B", "Zone C"]
    
    for (u, v) in G.edges():
        G.nodes[u]['area'] = localities[u[0]]
        G.edges[u, v]['base_distance'] = random.uniform(500, 1200)
        G.edges[u, v]['historical_congestion'] = random.uniform(1.0, 2.0)
        G.edges[u, v]['realtime_factor'] = random.uniform(1.0, 1.5)
        # 4. Accidents or road closures
        G.edges[u, v]['incident_factor'] = random.choices([1.0, 5.0, 10.0], weights=[0.95, 0.04, 0.01])[0]
        
    return G

city_graph = build_urban_data_model()

def calculate_intelligent_weight(u, v, edge_data):
    """
    Predict travel time based on 11 inputs.
    """
    dist = edge_data['base_distance']
    hist = edge_data['historical_congestion']
    live = edge_data['realtime_factor']
    incidents = edge_data['incident_factor']
    
    time_f = get_time_factor()
    day_f = get_day_factor()
    weather_f, _ = get_weather_factor()
    
    # Area/locality factor
    locality_f = 1.2 if city_graph.nodes[u]['area'] == "Downtown" else 1.0
    
    return dist * hist * live * incidents * time_f * day_f * weather_f * locality_f

# ==========================================
# API ENDPOINTS
# ==========================================

@app.route("/")
def serve_index():
    return send_from_directory('.', 'index.html')

@app.route("/signin")
def serve_signin():
    return send_from_directory('.', 'signin.html')

@app.route("/signup")
def serve_signup():
    return send_from_directory('.', 'signup.html')

@app.route("/dashboard")
def serve_dashboard():
    return send_from_directory('.', 'dashboard.html')

@app.route("/css/<path:path>")
def serve_css(path):
    return send_from_directory('css', path)

@app.route("/js/<path:path>")
def serve_js(path):
    return send_from_directory('js', path)

@app.route("/health")
def health_check():
    return jsonify({"status": "running", "message": "RouteSense AI Engine is alive!"})

@app.route("/api/optimize", methods=["GET"])
def optimize_route():
    # Simulation inputs
    start_node = (random.randint(0, 1), random.randint(0, 1))
    end_node = (random.randint(4, 5), random.randint(4, 5))
    
    weather_f, weather_label = get_weather_factor()
    day_name = datetime.now().strftime("%A")
    
    try:
        # 1. Dijkstra Path using standard base dist (Unoptimized/Legacy)
        legacy_path = nx.dijkstra_path(city_graph, start_node, end_node, weight='base_distance')
        
        # 2. Dijkstra Path using our AI Data Model
        smart_path = nx.dijkstra_path(city_graph, start_node, end_node, weight=calculate_intelligent_weight)
        
        # Calculate Predicted Travel Time (Mock conversion to minutes)
        def get_travel_time(path):
            weight = nx.path_weight(city_graph, path, weight=calculate_intelligent_weight)
            return round(weight / 5000, 1) # Simple divisor for mock minutes

        smart_time = get_travel_time(smart_path)
        legacy_time = get_travel_time(legacy_path)
        
        # Format paths for frontend SVG (0-100% coordinates)
        def fmt_path(p):
            return [{"x": int((n[1]/5.0)*80 + 10), "y": int((n[0]/5.0)*80 + 10), "area": city_graph.nodes[n]['area']} for n in p]

        return jsonify({
            "status": "success",
            "source": f"{city_graph.nodes[start_node]['area']} Intersection",
            "destination": f"{city_graph.nodes[end_node]['area']} Hub",
            "weather": weather_label,
            "day": day_name,
            "smart_path": fmt_path(smart_path),
            "legacy_path": fmt_path(legacy_path),
            "metrics": {
                "predicted_travel_time": f"{smart_time}m",
                "time_saved": f"{round(legacy_time - smart_time, 1)}m",
                "optimization_benefit": round(((legacy_time - smart_time)/legacy_time)*100, 1) if legacy_time > 0 else 0,
                "recommendation": f"Route via {city_graph.nodes[smart_path[1]]['area']} prioritized to avoid congestion hotspots.",
                "timestamp": datetime.now().strftime("%H:%M:%S")
            }
        })
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)})

@app.route("/api/analytics", methods=["GET"])
def get_analytics():
    """
    Provides mock data for the dashboard statistics.
    """
    return jsonify({
        "active_deliveries": random.randint(1100, 1400),
        "avg_delay_time": f"{round(random.uniform(2.0, 5.0), 1)}m",
        "fuel_saved_total": f"{random.randint(300, 450)} L"
    })

if __name__ == "__main__":
    print("="*60)
    print("🚀 RouteSense AI Engine Initialized 🚀")
    
    try:
        from waitress import serve
        print("Production WSGI Server Serving on: http://localhost:5000")
        print("="*60)
        serve(app, host="0.0.0.0", port=5000)
    except ImportError:
        print("Waitress not found. Falling back to Development Server...")
        print("Server Serving on: http://localhost:5000")
        print("="*60)
        # Using debug=True only in fallback to help the user identify local issues
        app.run(debug=True, port=5000)
