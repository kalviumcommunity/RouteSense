import os
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
import seaborn as sns
import networkx as nx
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.linear_model import LinearRegression
from sklearn.tree import DecisionTreeRegressor
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import warnings
warnings.filterwarnings('ignore')

# Print config
import sys
import codecs
sys.stdout = codecs.getwriter('utf-8')(sys.stdout.detach())

# Plot styling
plt.rcParams.update({
    'figure.facecolor': '#0f1117',
    'axes.facecolor': '#1a1d2e',
    'axes.edgecolor': '#444',
    'axes.labelcolor': 'white',
    'xtick.color': 'white',
    'ytick.color': 'white',
    'text.color': 'white',
    'grid.color': '#333',
    'grid.alpha': 0.4,
    'figure.dpi': 120,
    'font.family': 'DejaVu Sans'
})

np.random.seed(42)

def generate_data():
    print("==================================================")
    print("🚚 GENERATING DATASETS...")
    print("==================================================")
    os.makedirs('data', exist_ok=True)

    # 1. Delivery Dataset
    ZONES = ['Banjara Hills','Jubilee Hills','Hitech City','Gachibowli',
             'Kondapur','Madhapur','Kukatpally','Ameerpet',
             'Secunderabad','Dilsukhnagar','LB Nagar','Uppal',
             'Mehdipatnam','Attapur','Tolichowki']

    n = 1500
    hours  = np.random.randint(6, 22, n)
    peak_factor = np.where((hours>=8)&(hours<=10), 0.8,
                  np.where((hours>=17)&(hours<=20), 0.85,
                  np.where((hours>=12)&(hours<=14), 0.5, 0.25)))
    congestion = np.clip(peak_factor + np.random.normal(0, 0.1, n), 0, 1)

    distance_km  = np.random.uniform(1, 18, n)
    base_time    = distance_km * 4
    actual_time  = base_time * (1 + 1.8 * congestion) + np.random.normal(0, 3, n)
    actual_time  = np.clip(actual_time, 5, 120)

    df_delivery = pd.DataFrame({
        'order_id'      : range(1, n+1),
        'zone'          : np.random.choice(ZONES, n),
        'hour'          : hours,
        'day_of_week'   : np.random.randint(0, 7, n),
        'distance_km'   : distance_km.round(2),
        'congestion'    : congestion.round(3),
        'num_stops'     : np.random.randint(1, 8, n),
        'vehicle_type'  : np.random.choice(['Bike','Van','Truck'], n, p=[0.5,0.35,0.15]),
        'weather'       : np.random.choice(['Clear','Cloudy','Rain'], n, p=[0.6,0.25,0.15]),
        'delivery_time_min': actual_time.round(1)
    })
    
    for col in ['congestion','distance_km','delivery_time_min']:
        mask = np.random.random(n) < 0.03
        df_delivery.loc[mask, col] = np.nan

    df_delivery.to_csv('data/delivery_data.csv', index=False)
    print(f"✅ delivery_data.csv ({n} rows)")

    # 2. Traffic Dataset
    records = []
    for zone in ZONES:
        for hour in range(24):
            for day in range(7):
                base = 0.8 if (hour in range(8,11) or hour in range(17,21)) else \
                       0.5 if hour in range(12,15) else 0.2
                cong = np.clip(base + np.random.normal(0, 0.08), 0, 1)
                speed = np.clip(60 * (1 - cong) + np.random.normal(0,3), 5, 60)
                records.append({'zone':zone,'hour':hour,'day_of_week':day,
                                'congestion':round(cong,3),'avg_speed_kmh':round(speed,1),
                                'incident':int(np.random.random()<0.04)})

    df_traffic = pd.DataFrame(records)
    df_traffic.to_csv('data/traffic_data.csv', index=False)
    print(f"✅ traffic_data.csv ({len(records)} rows)")

    # 3. Road Network Dataset
    edges = [
        ('Banjara Hills','Jubilee Hills',3.2), ('Jubilee Hills','Hitech City',5.1),
        ('Hitech City','Gachibowli',4.3),     ('Gachibowli','Kondapur',3.8),
        ('Kondapur','Madhapur',2.9),          ('Madhapur','Hitech City',3.0),
        ('Madhapur','Kukatpally',6.5),        ('Kukatpally','Ameerpet',4.0),
        ('Ameerpet','Banjara Hills',3.5),     ('Ameerpet','Secunderabad',5.2),
        ('Secunderabad','Uppal',7.8),         ('Uppal','Dilsukhnagar',4.1),
        ('Dilsukhnagar','LB Nagar',3.3),      ('LB Nagar','Mehdipatnam',8.9),
        ('Mehdipatnam','Attapur',3.0),        ('Attapur','Tolichowki',2.4),
        ('Tolichowki','Mehdipatnam',2.8),     ('Mehdipatnam','Banjara Hills',4.5),
        ('Gachibowli','Mehdipatnam',6.2),     ('Jubilee Hills','Ameerpet',4.8),
        ('Kukatpally','Hitech City',7.1),     ('Secunderabad','Ameerpet',4.6),
        ('LB Nagar','Uppal',3.7),             ('Kondapur','Gachibowli',3.8),
        ('Banjara Hills','Hitech City',6.0),  ('Ameerpet','Mehdipatnam',5.3),
        ('Dilsukhnagar','Secunderabad',9.2),  ('Attapur','LB Nagar',7.1),
        ('Tolichowki','Banjara Hills',5.8),   ('Kukatpally','Secunderabad',8.4),
    ]
    df_roads = pd.DataFrame(edges, columns=['from_zone','to_zone','distance_km'])
    df_roads.to_csv('data/road_network.csv', index=False)
    print(f"✅ road_network.csv ({len(edges)} roads)")
    
    return df_delivery, df_traffic, df_roads

def run_project():
    df, df_traffic, df_roads = generate_data()

    print("\n==================================================")
    print("🧹 PREPROCESSING DATA...")
    print("==================================================")
    
    df['congestion'].fillna(df.groupby(['zone','hour'])['congestion'].transform('median'), inplace=True)
    df['congestion'].fillna(df['congestion'].median(), inplace=True)
    df['distance_km'].fillna(df['distance_km'].median(), inplace=True)
    df['delivery_time_min'].fillna(df['delivery_time_min'].median(), inplace=True)

    df['is_peak_hour']    = df['hour'].apply(lambda h: 1 if (8<=h<=10 or 17<=h<=20) else 0)
    df['is_weekend']      = df['day_of_week'].apply(lambda d: 1 if d>=5 else 0)
    df['speed_kmh']       = (df['distance_km'] / df['delivery_time_min'] * 60).round(2)
    df['congestion_band'] = pd.cut(df['congestion'], bins=[0,0.33,0.66,1.0], labels=['Low','Medium','High'])

    le = LabelEncoder()
    df['vehicle_enc'] = le.fit_transform(df['vehicle_type'])
    df['weather_enc'] = le.fit_transform(df['weather'])
    df['zone_enc']    = le.fit_transform(df['zone'])

    df.dropna(inplace=True)
    
    print(f"✅ Preprocessing complete. No missing values left. Final shape: {df.shape}")

    print("\n==================================================")
    print("🤖 TRAINING PREDICTION MODELS...")
    print("==================================================")
    
    FEATURES = ['distance_km','congestion','hour','day_of_week','num_stops',
                'is_peak_hour','is_weekend','vehicle_enc','weather_enc','zone_enc']
    TARGET = 'delivery_time_min'

    X = df[FEATURES]
    y = df[TARGET]

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    scaler_m = StandardScaler()
    X_train_s = scaler_m.fit_transform(X_train)
    X_test_s  = scaler_m.transform(X_test)

    models = {
        'Linear Regression' : LinearRegression(),
        'Decision Tree'     : DecisionTreeRegressor(max_depth=8, random_state=42),
        'Random Forest'     : RandomForestRegressor(n_estimators=100, max_depth=10, random_state=42, n_jobs=-1),
    }

    results = {}
    print(f"{'Model':<25} {'MAE':>8} {'RMSE':>8} {'R²':>8}")
    print("-" * 55)
    for name, model in models.items():
        Xtr, Xte = (X_train_s, X_test_s) if name=='Linear Regression' else (X_train, X_test)
        model.fit(Xtr, y_train)
        preds = model.predict(Xte)
        results[name] = {
            'MAE'   : mean_absolute_error(y_test, preds),
            'RMSE'  : np.sqrt(mean_squared_error(y_test, preds)),
            'R2'    : r2_score(y_test, preds),
        }
        print(f"{name:25s} | {results[name]['MAE']:5.2f} | {results[name]['RMSE']:5.2f} | {results[name]['R2']:6.4f}")

    print("\n==================================================")
    print("🗺️ ROUTE OPTIMIZATION ALGORITHMS...")
    print("==================================================")
    
    def get_traffic_weight(from_z, to_z, hour=8):
        cong = df_traffic[(df_traffic['zone'].isin([from_z,to_z])) & (df_traffic['hour']==hour)]['congestion'].mean()
        return 0.5 if np.isnan(cong) else cong

    def build_graph(hour=8):
        G = nx.DiGraph()
        for _, row in df_roads.iterrows():
            weight = row['distance_km'] * (1 + 1.5 * get_traffic_weight(row['from_zone'], row['to_zone'], hour))
            G.add_edge(row['from_zone'], row['to_zone'], weight=round(weight,2), distance=row['distance_km'])
            G.add_edge(row['to_zone'], row['from_zone'], weight=round(weight,2), distance=row['distance_km'])
        return G

    G_morning = build_graph(hour=8)
    G_evening = build_graph(hour=18)
    G_offpeak = build_graph(hour=10)

    def dijkstra_route(G, depot, stops):
        route = [depot]
        remaining = list(stops)
        total_cost = 0
        while remaining:
            current = route[-1]
            best_stop, best_cost = None, float('inf')
            for stop in remaining:
                try:
                    cost = nx.dijkstra_path_length(G, current, stop, weight='weight')
                    if cost < best_cost: best_cost, best_stop = cost, stop
                except: pass
            if best_stop is None: break
            route.append(best_stop)
            remaining.remove(best_stop)
            total_cost += best_cost
        return route, round(total_cost, 2)

    DEPOT = 'Hitech City'
    DELIVERY_STOPS = ['Banjara Hills','Ameerpet','LB Nagar','Kondapur','Secunderabad']

    for label, G, hour in [('Morning Peak (8 AM)', G_morning, 8),
                            ('Evening Peak (6 PM)', G_evening, 18),
                            ('Off-Peak (10 AM)',    G_offpeak, 10)]:
        route, cost = dijkstra_route(G, DEPOT, DELIVERY_STOPS)
        naive_cost = sum(nx.dijkstra_path_length(G, DELIVERY_STOPS[i], DELIVERY_STOPS[i+1], weight='weight')
                         for i in range(len(DELIVERY_STOPS)-1) 
                         if nx.has_path(G, DELIVERY_STOPS[i], DELIVERY_STOPS[i+1]))
        saving = round(naive_cost - cost, 2)
        pct = (saving/naive_cost*100) if naive_cost>0 else 0
        print(f"\n🕐 {label}")
        print(f"   Route : {' → '.join(route)}")
        print(f"   Cost  : Optimized={cost:.2f} | Naive={naive_cost:.2f} | Saved={pct:.1f}%")

    print("\n==================================================")
    print("📈 GENERATING VISUALIZATIONS DASHBOARD...")
    print("==================================================")
    
    fig = plt.figure(figsize=(20, 14))
    fig.suptitle('🚚 RouteSense — Insights Dashboard', fontsize=20, fontweight='bold', color='white', y=1.0)
    gs = fig.add_gridspec(3, 3, hspace=0.45, wspace=0.35)
    ACCENT = ['#00d4ff','#ff6b6b','#ffd93d','#6bcb77','#c77dff','#ff9f43']

    ax1 = fig.add_subplot(gs[0, :2])
    h_cong = df_traffic.groupby('hour')['congestion'].mean()
    ax1.fill_between(h_cong.index, h_cong.values, alpha=0.3, color='#ff6b6b')
    ax1.plot(h_cong.index, h_cong.values, color='#ff6b6b', lw=2.5, marker='o')
    ax1.axvspan(8, 10, alpha=0.15, color='#ffd93d', label='Morning Peak')
    ax1.axvspan(17, 20, alpha=0.15, color='#ffd93d', label='Evening Peak')
    ax1.set_title('Average Traffic Congestion by Hour', fontweight='bold')
    ax1.legend()

    ax2 = fig.add_subplot(gs[0, 2])
    r2s = [results[m]['R2'] for m in results]
    ax2.bar(list(results.keys()), r2s, color=ACCENT[:3])
    ax2.set_title('Model R² Scores', fontweight='bold')

    ax4 = fig.add_subplot(gs[1, 1])
    for vt, color in zip(['Bike','Van','Truck'], ACCENT[:3]):
        sub = df[df['vehicle_type']==vt]
        ax4.scatter(sub['distance_km'], sub['delivery_time_min'], alpha=0.3, s=8, label=vt, color=color)
    ax4.set_title('Distance vs Delivery Time', fontweight='bold')
    ax4.legend()

    ax6 = fig.add_subplot(gs[2, 0])
    cb = df['congestion_band'].value_counts()
    ax6.pie(cb.values, labels=cb.index, colors=['#6bcb77','#ffd93d','#ff6b6b'], autopct='%1.1f%%', textprops={'color':'white'})
    ax6.set_title('Congestion Bands', fontweight='bold')

    for ax in fig.get_axes(): ax.set_facecolor('#1a1d2e')
    fig.patch.set_facecolor('#0f1117')
    
    out_path = 'data/dashboard.png'
    plt.savefig(out_path, bbox_inches='tight', facecolor='#0f1117', dpi=130)
    print(f"✅ Dashboard saved visually to {out_path}")
    print("\n🎯 RUN COMPLETE!")

if __name__ == "__main__":
    run_project()
