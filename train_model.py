import pandas as pd
import numpy as np
import pickle
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import r2_score
import os

print("Training RouteSense Model...")

# 1. Load Data
df = pd.read_csv('data/delivery_data.csv')

# Handle missing values
df['congestion'].fillna(df.groupby(['zone','hour'])['congestion'].transform('median'), inplace=True)
df['congestion'].fillna(df['congestion'].median(), inplace=True)
df.dropna(subset=['delivery_time_min'], inplace=True)
df['distance_km'] = df['distance_km'].fillna(df['distance_km'].median())

# 2. Feature Engineering
df['is_peak_hour'] = df['hour'].apply(lambda h: 1 if (8<=h<=10 or 17<=h<=20) else 0)
df['is_weekend']   = df['day_of_week'].apply(lambda d: 1 if d>=5 else 0)

# 3. Encoding
le_vehicle = LabelEncoder()
le_weather = LabelEncoder()
le_zone    = LabelEncoder()

df['vehicle_enc'] = le_vehicle.fit_transform(df['vehicle_type'])
df['weather_enc'] = le_weather.fit_transform(df['weather'])
df['zone_enc']    = le_zone.fit_transform(df['zone'])

# 4. Define Features and Target
FEATURES = ['distance_km','congestion','hour','day_of_week','num_stops',
            'is_peak_hour','is_weekend','vehicle_enc','weather_enc','zone_enc']
TARGET = 'delivery_time_min'

X = df[FEATURES]
y = df[TARGET]

# 5. Train Random Forest (using all data since it's production saving)
# We will use the same hyperparams as the notebook
rf = RandomForestRegressor(n_estimators=100, max_depth=10, random_state=42, n_jobs=-1)
rf.fit(X, y)

print(f"Model trained. R2 Score on training data: {r2_score(y, rf.predict(X)):.4f}")

# 6. Save using pickle
model_data = {
    'model': rf,
    'le_vehicle': le_vehicle,
    'le_weather': le_weather,
    'le_zone': le_zone,
    'features': FEATURES
}

with open('model.pkl', 'wb') as f:
    pickle.dump(model_data, f)

print("✅ Model, encoders, and feature list successfully saved to model.pkl")
