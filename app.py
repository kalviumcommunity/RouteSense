import pandas as pd
import networkx as nx
import random
import os
from datetime import datetime
from flask import Flask, jsonify, send_from_directory, request

app = Flask(__name__, static_folder=".")

# ==========================================
# CORE DATA MODEL: AI Route Optimization
# ==========================================

# Zone coordinates for visualization (from Sprint 3 Notebook)
ZONE_POSITIONS = {
    'Hitech City'   : (0.50, 0.75), 'Gachibowli'    : (0.30, 0.65),
    'Kondapur'      : (0.35, 0.82), 'Madhapur'      : (0.45, 0.88),
    'Banjara Hills' : (0.55, 0.55), 'Jubilee Hills' : (0.48, 0.62),
    'Ameerpet'      : (0.65, 0.58), 'Kukatpally'    : (0.55, 0.88),
    'Secunderabad'  : (0.80, 0.65), 'Uppal'         : (0.90, 0.48),
    'Dilsukhnagar'  : (0.80, 0.40), 'LB Nagar'      : (0.75, 0.28),
    'Mehdipatnam'   : (0.52, 0.32), 'Attapur'       : (0.40, 0.25),
    'Tolichowki'    : (0.35, 0.32),
}

class RouteEngine:
    def __init__(self):
        self.load_data()
        self.build_graph()

    def load_data(self):
        try:
            self.df_roads = pd.read_csv('data/road_network.csv')
            self.df_traffic = pd.read_csv('data/traffic_data.csv')
            self.zones = list(ZONE_POSITIONS.keys())
            print("✅ Data layers initialized from CSV files.")
        except Exception as e:
            print(f"⚠️ Error loading data: {e}. Using fallback simulation.")
            self.df_roads = None
            self.df_traffic = None
            self.zones = list(ZONE_POSITIONS.keys())

    def get_traffic_factor(self, from_z, to_z, hour):
        if self.df_traffic is None:
            return random.uniform(1.0, 2.0)
        
        # Calculate mean congestion for these zones at the given hour
        cong = self.df_traffic[(self.df_traffic['zone'].isin([from_z, to_z])) & 
                                (self.df_traffic['hour'] == hour)]['congestion'].mean()
        return 1.0 + (1.5 * cong if not pd.isna(cong) else 0.5)

    def build_graph(self, hour=None):
        if hour is None:
            hour = datetime.now().hour
            
        self.G = nx.Graph()
        
        if self.df_roads is not None:
            for _, row in self.df_roads.iterrows():
                u, v, dist = row['from_zone'], row['to_zone'], row['distance_km']
                weight = dist * self.get_traffic_factor(u, v, hour)
                self.G.add_edge(u, v, base_distance=dist, weight=weight)
        else:
            # Fallback random graph if files missing
            for i in range(len(self.zones)):
                for j in range(i+1, len(self.zones)):
                    if random.random() > 0.7:
                        u, v = self.zones[i], self.zones[j]
                        dist = random.uniform(2, 10)
                        self.G.add_edge(u, v, base_distance=dist, weight=dist * random.uniform(1, 2))

    def get_weather(self):
        state = random.choices(["Clear", "Rain", "Cloudy", "Storm"], weights=[0.6, 0.2, 0.15, 0.05])[0]
        impact = {"Clear": 1.0, "Rain": 1.3, "Cloudy": 1.1, "Storm": 2.2}
        return state, impact[state]

    def optimize(self):
        hour = datetime.now().hour
        self.build_graph(hour) # Update weights for current time
        
        start_node = random.choice(self.zones)
        end_node = random.choice([z for z in self.zones if z != start_node])
        
        weather_label, weather_f = self.get_weather()
        
        try:
            # Smart Path (AI Weighted)
            smart_path = nx.dijkstra_path(self.G, start_node, end_node, weight='weight')
            smart_weight = nx.path_weight(self.G, smart_path, weight='weight') * weather_f
            
            # Legacy Path (Distance only)
            legacy_path = nx.dijkstra_path(self.G, start_node, end_node, weight='base_distance')
            legacy_weight = nx.path_weight(self.G, legacy_path, weight='weight') * weather_f
            
            # Mock conversion to minutes
            smart_time = round(smart_weight * 2.5, 1)
            legacy_time = round(legacy_weight * 2.5, 1)
            
            def fmt_path(path):
                return [{"x": int(ZONE_POSITIONS[n][0]*100), "y": int(ZONE_POSITIONS[n][1]*100), "area": n} for n in path]

            return {
                "status": "success",
                "source": start_node,
                "destination": end_node,
                "weather": weather_label,
                "day": datetime.now().strftime("%A"),
                "smart_path": fmt_path(smart_path),
                "legacy_path": fmt_path(legacy_path),
                "metrics": {
                    "predicted_travel_time": f"{smart_time}m",
                    "time_saved": f"{round(max(0, legacy_time - smart_time), 1)}m",
                    "optimization_benefit": round(max(0, (legacy_time - smart_time)/legacy_time)*100, 1) if legacy_time > 0 else 0,
                    "recommendation": f"Route via {smart_path[1] if len(smart_path)>1 else 'direct'} prioritized to bypass congestion hotspots in {start_node}.",
                    "timestamp": datetime.now().strftime("%H:%M:%S")
                }
            }
        except Exception as e:
            return {"status": "error", "message": str(e)}

engine = RouteEngine()

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

@app.route("/data/<path:path>")
def serve_data(path):
    return send_from_directory('data', path)

@app.route("/api/optimize", methods=["GET"])
def optimize_route():
    return jsonify(engine.optimize())

@app.route("/api/analytics", methods=["GET"])
def get_analytics():
    return jsonify({
        "active_deliveries": random.randint(1100, 1400),
        "avg_delay_time": f"{round(random.uniform(2.0, 5.0), 1)}m",
        "fuel_saved_total": f"{random.randint(300, 450)} L"
    })

if __name__ == "__main__":
    print("="*60)
    print("🚀 RouteSense AI Engine Initialized 🚀")
    print("Serving on: http://localhost:5000")
    print("="*60)
    app.run(debug=True, port=5000)
=5000)
