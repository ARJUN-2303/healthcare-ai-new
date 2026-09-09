from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    DateTime,
    ForeignKey
)

from sqlalchemy.orm import relationship

from datetime import datetime

from database import Base


# ==========================================
# USER TABLE
# ==========================================

class User(Base):

    __tablename__ = "users"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    full_name = Column(
        String,
        nullable=False
    )

    email = Column(
        String,
        unique=True,
        index=True,
        nullable=False
    )

    password = Column(
        String,
        nullable=False
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )

    assessments = relationship(
        "Assessment",
        back_populates="user",
        cascade="all, delete-orphan"
    )


# ==========================================
# OTP TABLE
# ==========================================

class OTP(Base):

    __tablename__ = "otps"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    email = Column(
        String,
        index=True,
        nullable=False
    )

    otp_code = Column(
        String,
        nullable=False
    )

    purpose = Column(
        String,
        nullable=False
    )

    expires_at = Column(
        DateTime,
        nullable=False
    )


# ==========================================
# DIABETES ASSESSMENT TABLE
# ==========================================

class Assessment(Base):

    __tablename__ = "assessments"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    pregnancies = Column(Float)

    glucose = Column(Float)

    blood_pressure = Column(Float)

    skin_thickness = Column(Float)

    insulin = Column(Float)

    bmi = Column(Float)

    diabetes_pedigree = Column(Float)

    age = Column(Float)

    risk_probability = Column(Float)

    risk_category = Column(String)

    prediction = Column(Integer)

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )

    user = relationship(
        "User",
        back_populates="assessments"
    )