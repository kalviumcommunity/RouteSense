import pandas as pd
import numpy as np
import os

def clean_and_prepare_data(file_path):
    print("="*50)
    print("ROUTE SENSE: DATA CLEANING & PREPARATION SCRIPT")
    print("="*50)
    
    # Load data
    df = pd.read_csv(file_path)
    print(f"\n[INITIAL STATE] Dataset loaded with {df.shape[0]} rows and {df.shape[1]} columns.")
    
    # ---------------------------------------------------------
    # WEEK 2 GOAL 2: Remove duplicates
    # ---------------------------------------------------------
    print("\n--- Step 1: Removing Duplicates ---")
    initial_rows = len(df)
    df = df.drop_duplicates()
    duplicates_removed = initial_rows - len(df)
    print(f"Removed {duplicates_removed} duplicate rows. Remaining rows: {len(df)}")
    
    # ---------------------------------------------------------
    # WEEK 2 GOAL 3: Fix inconsistent formats
    # ---------------------------------------------------------
    print("\n--- Step 2: Fixing Inconsistent Formats ---")
    # Identify string columns
    str_cols = df.select_dtypes(include=['object']).columns
    for col in str_cols:
        # Strip leading/trailing whitespaces and convert to Title Case for consistency
        df[col] = df[col].astype(str).str.strip().str.title()
    print(f"Standardized text formatting (stripped whitespace and Title Cased) for columns: {list(str_cols)}")
    
    # ---------------------------------------------------------
    # WEEK 2 GOAL 1: Handle missing values
    # ---------------------------------------------------------
    print("\n--- Step 3: Handling Missing Values ---")
    missing_before = df.isnull().sum()
    print("Missing values before imputation:")
    print(missing_before[missing_before > 0])
    
    # Drop rows where target variable 'delivery_time_min' is missing
    target_col = 'delivery_time_min'
    if target_col in df.columns and df[target_col].isnull().sum() > 0:
        missing_targets = df[target_col].isnull().sum()
        df = df.dropna(subset=[target_col])
        print(f"-> Dropped {missing_targets} rows with missing target '{target_col}'.")

    # Numeric columns: fill missing with median
    numeric_cols = df.select_dtypes(include=[np.number]).columns
    for col in numeric_cols:
        if df[col].isnull().sum() > 0:
            median_val = df[col].median()
            df[col] = df[col].fillna(median_val)
            print(f"-> Filled missing in '{col}' with median: {median_val:.2f}")

    # Categorical columns: fill missing with mode
    for col in str_cols:
        # replace any 'Nan' strings that might have formed from the formatting step back to actual np.nan
        df[col] = df[col].replace('Nan', np.nan)
        if df[col].isnull().sum() > 0:
            mode_val = df[col].mode()[0]
            df[col] = df[col].fillna(mode_val)
            print(f"-> Filled missing in '{col}' with mode: {mode_val}")

    # ---------------------------------------------------------
    # WEEK 2 GOAL 4: Rename columns and adjust data types
    # ---------------------------------------------------------
    print("\n--- Step 4: Renaming Columns and Adjusting Data Types ---")
    
    # Renaming for better clarity
    rename_mapping = {
        'distance_km': 'distance_in_km',
        'delivery_time_min': 'delivery_time_minutes',
        'num_stops': 'number_of_stops'
    }
    df = df.rename(columns=rename_mapping)
    print(f"Renamed columns: {rename_mapping}")
    
    # Adjusting Data Types
    # Certain columns like hour, day_of_week, number_of_stops should be strictly integers
    int_columns = ['hour', 'day_of_week', 'number_of_stops']
    for col in int_columns:
        if col in df.columns:
            df[col] = df[col].astype(int)
    
    # Ensure categorical columns are typed as category to save memory and improve performance
    category_columns = ['zone', 'vehicle_type', 'weather']
    for col in category_columns:
        if col in df.columns:
            df[col] = df[col].astype('category')
            
    # Print current data types
    print("\nAdjusted Data Types:")
    print(df.dtypes)

    # ---------------------------------------------------------
    # WEEK 2 GOAL 5: Prepare cleaned dataset
    # ---------------------------------------------------------
    print("\n--- Step 5: Preparing Cleaned Dataset ---")
    data_dir = os.path.dirname(file_path)
    cleaned_path = os.path.join(data_dir, 'cleaned_delivery_data.csv')
    
    # Save the polished dataset
    df.to_csv(cleaned_path, index=False)
    print(f"\n[FINAL STATE] Cleaned dataset saved to: {cleaned_path}")
    print(f"Final shape: {df.shape[0]} rows and {df.shape[1]} columns.")
    print("="*50)

if __name__ == "__main__":
    file_path = os.path.join(os.path.dirname(__file__), 'data', 'delivery_data.csv')
    if os.path.exists(file_path):
        clean_and_prepare_data(file_path)
    else:
        print(f"Error: Could not find raw data at {file_path}")
