from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr, Field

from ml_service import predict_diabetes
from email_service import send_otp_email

from datetime import datetime, timedelta
import random

# ==================================================
# DATABASE IMPORTS
# ==================================================

from database import Base, engine, get_db
from models import User, Assessment, OTP


# ==================================================
# AUTHENTICATION IMPORTS
# ==================================================

from auth import (
    hash_password,
    verify_password,
    create_access_token,
    get_current_user
)


# ==================================================
# MACHINE LEARNING IMPORTS
# ==================================================

# Alias the ML function to avoid naming conflicts
from ml_service import predict_diabetes as ml_predict_diabetes


# ==================================================
# REPORT IMPORT
# ==================================================

from report_service import generate_medical_report


# ==================================================
# CREATE DATABASE TABLES
# ==================================================

Base.metadata.create_all(bind=engine)


# ==================================================
# FASTAPI APPLICATION
# ==================================================

app = FastAPI(
    title="Healthcare AI",
    description="AI-powered Diabetes Risk Prediction System",
    version="1.0.0"
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
        "https://healthcare-ai-new-rw65.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==================================================
# CORS CONFIGURATION
# ==================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://healthcare-ai-new-rw65.vercel.app",

    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


# ==================================================
# REQUEST MODELS
# ==================================================

class RegisterRequest(BaseModel):

    full_name: str = Field(
        min_length=2,
        max_length=100
    )

    email: EmailStr

    password: str = Field(
        min_length=6,
        max_length=100
    )


class LoginRequest(BaseModel):

    email: EmailStr
    password: str


class ForgotPasswordRequest(BaseModel):

    email: EmailStr


class VerifyOTPRequest(BaseModel):

    email: EmailStr

    otp_code: str = Field(
        min_length=6,
        max_length=6
    )


class ResetPasswordRequest(BaseModel):

    email: EmailStr

    otp_code: str = Field(
        min_length=6,
        max_length=6
    )

    new_password: str = Field(
        min_length=6,
        max_length=100
    )


class PredictionRequest(BaseModel):

    pregnancies: float = Field(ge=0, le=30)
    glucose: float = Field(ge=0, le=300)
    blood_pressure: float = Field(ge=0, le=200)
    skin_thickness: float = Field(ge=0, le=150)
    insulin: float = Field(ge=0, le=1000)
    bmi: float = Field(ge=0, le=100)
    diabetes_pedigree: float = Field(ge=0, le=5)
    age: float = Field(ge=1, le=120)


# ==================================================
# HOME API
# ==================================================

@app.get("/")
def home():

    return {
        "message": "Healthcare AI Backend is Running",
        "status": "success"
    }


# ==================================================
# HEALTH CHECK
# ==================================================

@app.get("/health")
def health_check():

    return {
        "status": "healthy",
        "service": "Healthcare AI Backend"
    }


# ==================================================
# REGISTER USER
# ==================================================

@app.post("/register")
def register_user(

    user_data: RegisterRequest,

    db: Session = Depends(get_db)

):

    existing_user = db.query(User).filter(
        User.email == user_data.email
    ).first()

    if existing_user:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    hashed_password = hash_password(
        user_data.password
    )

    new_user = User(
        full_name=user_data.full_name,
        email=user_data.email,
        password=hashed_password
    )

    db.add(new_user)

    db.commit()

    db.refresh(new_user)

    return {

        "message": "Account created successfully",

        "user": {

            "id": new_user.id,

            "full_name": new_user.full_name,

            "email": new_user.email

        }

    }


# ==================================================
# LOGIN USER
# ==================================================

@app.post("/login")
def login_user(

    login_data: LoginRequest,

    db: Session = Depends(get_db)

):

    user = db.query(User).filter(
        User.email == login_data.email
    ).first()

    if not user:

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    password_valid = verify_password(
        login_data.password,
        user.password
    )

    if not password_valid:

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    access_token = create_access_token(
        user.id
    )

    return {

        "message": "Login successful",

        "access_token": access_token,

        "token_type": "bearer",

        "user": {

            "id": user.id,

            "full_name": user.full_name,

            "email": user.email

        }

    }


# ==================================================
# FORGOT PASSWORD - GENERATE OTP
# ==================================================

@app.post("/forgot-password")
def forgot_password(

    data: ForgotPasswordRequest,

    db: Session = Depends(get_db)

):

    user = db.query(User).filter(
        User.email == data.email
    ).first()

    # Do not reveal whether the email exists
    if not user:

        return {
            "message":
                "If an account exists for this email, "
                "a reset OTP has been generated."
        }

    # Generate six-digit OTP
    otp_code = str(
        random.randint(
            100000,
            999999
        )
    )

    # OTP valid for 10 minutes
    expires_at = (
        datetime.utcnow()
        +
        timedelta(minutes=10)
    )

    # Delete old reset OTPs
    db.query(OTP).filter(
        OTP.email == data.email,
        OTP.purpose == "password_reset"
    ).delete()

    # Create new OTP
    new_otp = OTP(
        email=data.email,
        otp_code=otp_code,
        purpose="password_reset",
        expires_at=expires_at
    )

    db.add(new_otp)

    db.commit()


    # ==========================================
    # SEND OTP TO USER EMAIL
    # ==========================================

    try:

        send_otp_email(
            receiver_email=data.email,
            otp=otp_code
        )

    except Exception as e:

        print("\nEMAIL ERROR:", str(e), "\n")

        raise HTTPException(
            status_code=500,
            detail="Failed to send OTP email"
        )


    # DEVELOPMENT MODE - ALSO PRINT OTP
    print("\n" + "=" * 55)
    print("HEALTHCARE AI PASSWORD RESET OTP")
    print(f"EMAIL: {data.email}")
    print(f"OTP: {otp_code}")
    print("VALID FOR: 10 MINUTES")
    print("=" * 55 + "\n")


    return {

        "message":
            "OTP sent successfully. Please check your email."

    }


# ==================================================
# VERIFY OTP
# ==================================================

@app.post("/verify-otp")
def verify_otp(

    data: VerifyOTPRequest,

    db: Session = Depends(get_db)

):

    otp = db.query(OTP).filter(

        OTP.email == data.email,

        OTP.otp_code == data.otp_code,

        OTP.purpose == "password_reset"

    ).first()

    if not otp:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid OTP"
        )

    if datetime.utcnow() > otp.expires_at:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="OTP has expired"
        )

    return {
        "message": "OTP verified successfully"
    }


# ==================================================
# RESET PASSWORD
# ==================================================

@app.post("/reset-password")
def reset_password(

    data: ResetPasswordRequest,

    db: Session = Depends(get_db)

):

    otp = db.query(OTP).filter(

        OTP.email == data.email,

        OTP.otp_code == data.otp_code,

        OTP.purpose == "password_reset"

    ).first()

    if not otp:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid OTP"
        )

    if datetime.utcnow() > otp.expires_at:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="OTP has expired"
        )

    user = db.query(User).filter(
        User.email == data.email
    ).first()

    if not user:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    user.password = hash_password(
        data.new_password
    )

    db.delete(otp)

    db.commit()

    return {
        "message": "Password reset successfully"
    }


# ==================================================
# GET CURRENT USER PROFILE
# ==================================================

@app.get("/profile")
def get_profile(

    current_user: User = Depends(
        get_current_user
    )

):

    return {

        "id": current_user.id,

        "full_name": current_user.full_name,

        "email": current_user.email,

        "created_at": current_user.created_at

    }
# ==================================================
# PREDICT DIABETES RISK
# ==================================================

@app.post("/predict")
def predict_risk(

    prediction_data: PredictionRequest,

    current_user: User = Depends(
        get_current_user
    ),

    db: Session = Depends(
        get_db
    )

):

    try:

        # ==========================================
        # CONVERT PYDANTIC OBJECT TO DICTIONARY
        # ==========================================

        ml_input = {

            "Pregnancies":
                prediction_data.pregnancies,

            "Glucose":
                prediction_data.glucose,

            "BloodPressure":
                prediction_data.blood_pressure,

            "SkinThickness":
                prediction_data.skin_thickness,

            "Insulin":
                prediction_data.insulin,

            "BMI":
                prediction_data.bmi,

            "DiabetesPedigreeFunction":
                prediction_data.diabetes_pedigree,

            "Age":
                prediction_data.age

        }


        # ==========================================
        # DEBUG INPUT
        # ==========================================

        print("\nML INPUT:")
        print(ml_input)
        print("\n")


        # ==========================================
        # CALL ML SERVICE
        # ==========================================

        result = predict_diabetes(
            ml_input
        )


        # ==========================================
        # DEBUG RESULT
        # ==========================================

        print("\nML PREDICTION RESULT:")
        print(result)
        print("\n")


        # ==========================================
        # VALIDATE RESULT
        # ==========================================

        if not isinstance(result, dict):

            raise HTTPException(

                status_code=500,

                detail=(
                    "Invalid prediction result "
                    "returned by ML service"
                )

            )


        # ==========================================
        # GET PREDICTION
        # ==========================================

        prediction = result.get(
            "prediction"
        )


        # ==========================================
        # GET RISK PROBABILITY
        # ==========================================

        risk_probability = result.get(
            "risk_probability"
        )


        if risk_probability is None:

            risk_probability = result.get(
                "risk_percentage"
            )


        if risk_probability is None:

            risk_probability = result.get(
                "probability"
            )


        # ==========================================
        # GET RISK CATEGORY
        # ==========================================

        risk_category = result.get(
            "risk_category"
        )


        if risk_category is None:

            risk_category = result.get(
                "risk_level"
            )


        # ==========================================
        # VALIDATE PREDICTION
        # ==========================================

        if prediction is None:

            raise HTTPException(

                status_code=500,

                detail=(
                    "ML service did not "
                    "return prediction"
                )

            )


        # ==========================================
        # VALIDATE RISK PROBABILITY
        # ==========================================

        if risk_probability is None:

            raise HTTPException(

                status_code=500,

                detail=(
                    "ML service did not "
                    "return risk probability"
                )

            )


        # ==========================================
        # CONVERT VALUES
        # ==========================================

        prediction = int(
            prediction
        )


        risk_probability = float(
            risk_probability
        )


        # ==========================================
        # AUTOMATIC RISK CATEGORY
        # ==========================================

        if risk_category is None:

            if prediction == 1:

                risk_category = (
                    "High Risk"
                )

            else:

                risk_category = (
                    "Low Risk"
                )


        # ==========================================
        # SAVE TO DATABASE
        # ==========================================

        new_assessment = Assessment(

            user_id=current_user.id,


            pregnancies=
                prediction_data.pregnancies,


            glucose=
                prediction_data.glucose,


            blood_pressure=
                prediction_data.blood_pressure,


            skin_thickness=
                prediction_data.skin_thickness,


            insulin=
                prediction_data.insulin,


            bmi=
                prediction_data.bmi,


            diabetes_pedigree=
                prediction_data.diabetes_pedigree,


            age=
                prediction_data.age,


            risk_probability=
                risk_probability,


            risk_category=
                risk_category,


            prediction=
                prediction

        )


        # ==========================================
        # ADD TO DATABASE
        # ==========================================

        db.add(
            new_assessment
        )


        db.commit()


        db.refresh(
            new_assessment
        )


        # ==========================================
        # SUCCESS RESPONSE
        # ==========================================

        return {

            "message":
                "Prediction completed successfully",


            "assessment_id":
                new_assessment.id,


            "prediction":
                prediction,


            "risk_category":
                risk_category,


            "risk_probability":
                round(
                    risk_probability,
                    2
                )

        }


    # ==============================================
    # HANDLE FASTAPI ERRORS
    # ==============================================

    except HTTPException:

        raise


    # ==============================================
    # HANDLE ALL OTHER ERRORS
    # ==============================================

    except Exception as error:

        print(
            "\n========== PREDICTION ERROR =========="
        )


        print(
            type(error).__name__
        )


        print(
            str(error)
        )


        print(
            "======================================\n"
        )


        raise HTTPException(

            status_code=500,

            detail=str(error)

        )
# ==================================================
# USER ASSESSMENT HISTORY
# ==================================================

@app.get("/history")
def get_history(

    current_user: User = Depends(
        get_current_user
    ),

    db: Session = Depends(
        get_db
    )

):

    assessments = db.query(
        Assessment
    ).filter(

        Assessment.user_id ==
        current_user.id

    ).order_by(

        Assessment.created_at.desc()

    ).all()

    history = []

    for assessment in assessments:

        history.append({

            "id":
                assessment.id,

            "pregnancies":
                assessment.pregnancies,

            "glucose":
                assessment.glucose,

            "blood_pressure":
                assessment.blood_pressure,

            "skin_thickness":
                assessment.skin_thickness,

            "insulin":
                assessment.insulin,

            "bmi":
                assessment.bmi,

            "diabetes_pedigree":
                assessment.diabetes_pedigree,

            "age":
                assessment.age,

            "risk_probability":
                assessment.risk_probability,

            "risk_category":
                assessment.risk_category,

            "prediction":
                assessment.prediction,

            "created_at":
                assessment.created_at

        })

    return {

        "total_assessments":
            len(history),

        "history":
            history

    }


# ==================================================
# DOWNLOAD MEDICAL REPORT
# ==================================================

@app.get("/report/{assessment_id}")
def download_report(

    assessment_id: int,

    current_user: User = Depends(
        get_current_user
    ),

    db: Session = Depends(
        get_db
    )

):

    # Get assessment
    assessment = db.query(
        Assessment
    ).filter(

        Assessment.id == assessment_id,

        Assessment.user_id == current_user.id

    ).first()


    # Ensure this assessment belongs to
    # the currently logged-in user
    if not assessment:

        raise HTTPException(

            status_code=status.HTTP_404_NOT_FOUND,

            detail="Assessment not found"

        )


    try:

        # Generate PDF
        file_path = generate_medical_report(

            current_user,

            assessment

        )


        # Return downloadable PDF
        return FileResponse(

            path=file_path,

            media_type="application/pdf",

            filename=(
                f"Healthcare_AI_Report_"
                f"{assessment_id}.pdf"
            )

        )


    except Exception as error:

        raise HTTPException(

            status_code=500,

            detail=str(error)

        )
    # ==================================================
# GET USER ASSESSMENT HISTORY
# ==================================================

@app.get("/assessments")
def get_assessment_history(

    current_user: User = Depends(
        get_current_user
    ),

    db: Session = Depends(
        get_db
    )

):

    assessments = db.query(
        Assessment
    ).filter(

        Assessment.user_id == current_user.id

    ).order_by(

        Assessment.created_at.desc()

    ).all()


    return [

        {

            "assessment_id": assessment.id,

            "pregnancies": assessment.pregnancies,

            "glucose": assessment.glucose,

            "blood_pressure": assessment.blood_pressure,

            "skin_thickness": assessment.skin_thickness,

            "insulin": assessment.insulin,

            "bmi": assessment.bmi,

            "diabetes_pedigree": assessment.diabetes_pedigree,

            "age": assessment.age,

            "prediction": assessment.prediction,

            "risk_category": assessment.risk_category,

            "risk_probability": assessment.risk_probability,

            "created_at": assessment.created_at

        }

        for assessment in assessments

    ]
# ==================================================
# DELETE ASSESSMENT
# ==================================================

@app.delete("/assessment/{assessment_id}")
def delete_assessment(

    assessment_id: int,

    current_user: User = Depends(
        get_current_user
    ),

    db: Session = Depends(
        get_db
    )

):

    assessment = db.query(
        Assessment
    ).filter(

        Assessment.id == assessment_id,

        Assessment.user_id ==
        current_user.id

    ).first()


    if not assessment:

        raise HTTPException(

            status_code=status.HTTP_404_NOT_FOUND,

            detail="Assessment not found"

        )


    db.delete(
        assessment
    )

    db.commit()


    return {

        "message":
            "Assessment deleted successfully",

        "assessment_id":
            assessment_id

    }