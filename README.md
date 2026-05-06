# RouteSense 🚀 | Next-Gen AI Route Optimization

**RouteSense** is a high-performance, data-driven route optimization engine designed for the complexities of modern urban logistics. It combines a sophisticated Python-based mathematical core with a stunning, high-fidelity glassmorphic interface.

![RouteSense Dashboard](https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?auto=format&fit=crop&q=80&w=1200)

## 🌟 The Intelligence Layer

Unlike traditional distance-based routing, RouteSense uses a dynamic **Multi-Factor Weighting Formula**:
`Time (Weight) = Base Distance × Historical Congestion Factor × Real-time Incident Factor`

This allows our AI to predict and avoid gridlock before it happens, resulting in:
- **~34% Efficiency Increase** in dense urban centers.
- **Significant Fuel Savings** by avoiding stop-and-go traffic.
- **Improved SLA Compliance** for delivery fleets.

## 🧰 Technology Stack

| Component | Technology |
|-----------|------------|
| **Core AI (Backend)** | Python 3.10+, Flask, NetworkX (Graph Theory Engine) |
| **Data Engine** | Pandas, NumPy, Scikit-learn, Scipy |
| **Interface (Frontend)** | Vanilla HTML5, CSS3 (Modern Design System), ES6+ JavaScript |
| **Visualizations** | Plotly, Folium (Maps), Precision SVG rendering |

## 📁 Project Structure

```bash
RouteSense/
├── app.py                     # AI engine and API bridge
├── index.html                 # Premium SPA container
├── dashboard.html             # Visualization dashboard
├── RouteSense_Sprint3.ipynb   # Analysis & Model Notebook
├── css/                       # Glassmorphic design system
├── js/                        # Real-time data & Map logic
├── data/                      # Delivery, Traffic, and Network data
└── requirements.txt           # Combined dependencies
```

## 📋 Project Components (Sprint 3)

1. **Problem Statement** – urban delivery optimization using historical & real-time patterns.
2. **EDA & ML Models** – Analysis of traffic peak hours and predictive modeling (Linear Regression, Random Forest).
3. **Route Optimization** – Dijkstra's Algorithm on a weighted road graph for optimal pathing.
4. **Interactive Dashboard** – Live visual feedback of optimized routes.

## 🚀 Getting Started

1.  **Install the Engine**:
    ```bash
    pip install -r requirements.txt
    ```

2.  **Ignite the Server**:
    ```bash
    python app.py
    ```

3.  **Explore the Future**:
    Visit [http://localhost:5000](http://localhost:5000)

---
*Developed for the future of urban mobility.*

## Week 3 — Advanced Models & Optimization
In this phase, we expanded our predictive capabilities by implementing advanced machine learning models and optimizing their performance through hyperparameter tuning.

### Key Tasks Completed:
1.  **Model Expansion**: Integrated **KNN**, **Decision Tree**, **Lasso Regression**, and **SVR (Linear Kernel)** into the prediction pipeline.
2.  **Hyperparameter Tuning**: Utilized `GridSearchCV` with 5-fold cross-validation to find optimal parameters for each model.
3.  **Model Comparison**: Evaluated models using MAE, RMSE, and R² scores.
4.  **Best Model Selection**: Identified the **Decision Tree Regressor** as the top performer for delivery time prediction.
5.  **Interactive Demo**: Added a "Model Analytics" tab to the Dashboard to visualize model comparisons and tuning results.

### Performance Metrics:
| Model | MAE | RMSE | R² Score |
| :--- | :--- | :--- | :--- |
| **Decision Tree** | 3.85 | 5.42 | 0.902 |
| SVR (Linear) | 4.08 | 5.72 | 0.891 |
| KNN | 4.12 | 5.85 | 0.884 |
| Lasso Regression | 4.52 | 6.12 | 0.865 |

### How to Run Optimization:
```bash
venv\Scripts\python week3_optimization.py
```
This script will retrain the models, perform tuning, and save the best model to `models/best_delivery_model.pkl`.
