import joblib
import pandas as pd
import os


# ==================================================
# GET CURRENT BACKEND DIRECTORY
# ==================================================

BASE_DIR = os.path.dirname(
    os.path.abspath(__file__)
)


# ==================================================
# MODEL PATH
# ==================================================

MODEL_PATH = os.path.join(
    BASE_DIR,
    "saved_models",
    "diabetes_model.pkl"
)


# ==================================================
# SCALER PATH
# ==================================================

SCALER_PATH = os.path.join(
    BASE_DIR,
    "saved_models",
    "scaler.pkl"
)


# ==================================================
# LOAD MODEL
# ==================================================

model = joblib.load(
    MODEL_PATH
)


# ==================================================
# LOAD SCALER
# ==================================================

scaler = joblib.load(
    SCALER_PATH
)


# ==================================================
# PREDICT DIABETES
# ==================================================

def predict_diabetes(data):


    # ==============================================
    # CREATE DATAFRAME WITH EXACT TRAINING FEATURES
    # ==============================================

    input_data = pd.DataFrame([

        {

            "Pregnancies":
                data["Pregnancies"],

            "Glucose":
                data["Glucose"],

            "BloodPressure":
                data["BloodPressure"],

            "SkinThickness":
                data["SkinThickness"],

            "Insulin":
                data["Insulin"],

            "BMI":
                data["BMI"],

            "DiabetesPedigreeFunction":
                data[
                    "DiabetesPedigreeFunction"
                ],

            "Age":
                data["Age"]

        }

    ])


    # ==============================================
    # SCALE THE INPUT
    # ==============================================

    scaled_input = scaler.transform(
        input_data
    )


    # ==============================================
    # MAKE PREDICTION
    # ==============================================

    prediction = int(

        model.predict(
            scaled_input
        )[0]

    )


    # ==============================================
    # GET PROBABILITY
    # ==============================================

    probability = float(

        model.predict_proba(
            scaled_input
        )[0][1]

    )


    # ==============================================
    # CONVERT TO PERCENTAGE
    # ==============================================

    risk_percentage = (
        probability * 100
    )


    # ==============================================
    # DETERMINE RISK CATEGORY
    # ==============================================

    if prediction == 1:

        risk_category = (
            "High Risk"
        )

    else:

        risk_category = (
            "Low Risk"
        )


    # ==============================================
    # RETURN RESULT
    # ==============================================

    return {

        "prediction":
            prediction,

        "risk_probability":
            risk_percentage,

        "risk_category":
            risk_category

    }