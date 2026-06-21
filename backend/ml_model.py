import sqlite3
import pandas as pd
import pickle
import os
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.preprocessing import LabelEncoder

# Paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "students.db")
ROLE_MODEL_PATH = os.path.join(BASE_DIR, "role_model.pkl")
LPA_MODEL_PATH = os.path.join(BASE_DIR, "lpa_model.pkl")
ENCODER_PATH = os.path.join(BASE_DIR, "label_encoder.pkl")

# Features list
FEATURES = [
    "cgpa", "java", "python", "web_dev", "dsa", 
    "communication", "leadership", "projects", 
    "internships", "certifications"
]

def train_models():
    if not os.path.exists(DB_PATH):
        raise FileNotFoundError(f"Database not found at {DB_PATH}. Please run database.py first.")
        
    conn = sqlite3.connect(DB_PATH)
    
    # Load data
    query = "SELECT * FROM students"
    df = pd.read_sql_query(query, conn)
    conn.close()
    
    if len(df) == 0:
        print("No data found in database. Cannot train models.")
        return
        
    X = df[FEATURES]
    y_role = df["recommended_role"]
    y_lpa = df["package_lpa"]
    
    # Label encode the recommended_role target
    le = LabelEncoder()
    y_role_encoded = le.fit_transform(y_role)
    
    # Train Random Forest Classifier for Job Role
    role_rf = RandomForestClassifier(n_estimators=50, random_state=42)
    role_rf.fit(X, y_role_encoded)
    
    # Train Random Forest Regressor for LPA Package
    lpa_rf = RandomForestRegressor(n_estimators=50, random_state=42)
    lpa_rf.fit(X, y_lpa)
    
    # Save the models and the label encoder
    with open(ROLE_MODEL_PATH, "wb") as f:
        pickle.dump(role_rf, f)
        
    with open(LPA_MODEL_PATH, "wb") as f:
        pickle.dump(lpa_rf, f)
        
    with open(ENCODER_PATH, "wb") as f:
        pickle.dump(le, f)
        
    print("Machine Learning models trained and saved successfully!")

def predict_career(student_features):
    """
    student_features should be a dict or list with the keys/order:
    [cgpa, java, python, web_dev, dsa, communication, leadership, projects, internships, certifications]
    """
    if not (os.path.exists(ROLE_MODEL_PATH) and os.path.exists(LPA_MODEL_PATH) and os.path.exists(ENCODER_PATH)):
        print("Models not found. Training models now...")
        train_models()
        
    # Load models
    with open(ROLE_MODEL_PATH, "rb") as f:
        role_rf = pickle.load(f)
    with open(LPA_MODEL_PATH, "rb") as f:
        lpa_rf = pickle.load(f)
    with open(ENCODER_PATH, "rb") as f:
        le = pickle.load(f)
        
    # Convert features to DataFrame
    df_features = pd.DataFrame([student_features])
    
    # Reorder columns to match feature order
    df_features = df_features[FEATURES]
    
    # Predict role and LPA
    pred_role_encoded = role_rf.predict(df_features)[0]
    pred_role = le.inverse_transform([pred_role_encoded])[0]
    
    pred_lpa = round(float(lpa_rf.predict(df_features)[0]), 2)
    
    return {
        "recommended_role": pred_role,
        "package_lpa": pred_lpa
    }

if __name__ == "__main__":
    train_models()
