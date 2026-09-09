import os

from datetime import datetime

from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import (
    getSampleStyleSheet,
    ParagraphStyle
)
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.units import inch

from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle
)


# ==================================================
# PATH CONFIGURATION
# ==================================================

BASE_DIR = os.path.dirname(
    os.path.abspath(__file__)
)

REPORT_DIR = os.path.join(
    BASE_DIR,
    "reports"
)


# ==================================================
# CREATE REPORT DIRECTORY
# ==================================================

os.makedirs(
    REPORT_DIR,
    exist_ok=True
)


# ==================================================
# GENERATE PDF REPORT
# ==================================================

def generate_medical_report(
    user,
    assessment
):

    file_name = (
        f"healthcare_ai_report_"
        f"{assessment.id}.pdf"
    )

    file_path = os.path.join(
        REPORT_DIR,
        file_name
    )


    # Create PDF
    document = SimpleDocTemplate(

        file_path,

        pagesize=A4,

        rightMargin=40,

        leftMargin=40,

        topMargin=40,

        bottomMargin=40

    )


    styles = getSampleStyleSheet()

    story = []


    # ==================================================
    # CUSTOM STYLES
    # ==================================================

    title_style = ParagraphStyle(

        "HealthcareTitle",

        parent=styles["Title"],

        alignment=TA_CENTER,

        fontSize=24,

        spaceAfter=10

    )


    subtitle_style = ParagraphStyle(

        "HealthcareSubtitle",

        parent=styles["Normal"],

        alignment=TA_CENTER,

        fontSize=11,

        textColor=colors.grey,

        spaceAfter=25

    )


    heading_style = ParagraphStyle(

        "SectionHeading",

        parent=styles["Heading2"],

        spaceBefore=15,

        spaceAfter=10

    )


    normal_style = styles["Normal"]


    # ==================================================
    # REPORT HEADER
    # ==================================================

    story.append(

        Paragraph(
            "Healthcare AI",
            title_style
        )

    )


    story.append(

        Paragraph(
            "AI-Powered Diabetes Risk Assessment Report",
            subtitle_style
        )

    )


    # ==================================================
    # USER INFORMATION
    # ==================================================

    story.append(

        Paragraph(
            "Patient Information",
            heading_style
        )

    )


    patient_data = [

        [
            "Full Name",
            user.full_name
        ],

        [
            "Email",
            user.email
        ],

        [
            "Assessment ID",
            str(assessment.id)
        ],

        [
            "Assessment Date",
            assessment.created_at.strftime(
                "%d %B %Y, %I:%M %p"
            )
        ]

    ]


    patient_table = Table(

        patient_data,

        colWidths=[
            2.2 * inch,
            4.5 * inch
        ]

    )


    patient_table.setStyle(

        TableStyle([

            (
                "BACKGROUND",
                (0, 0),
                (0, -1),
                colors.HexColor("#E8F3F1")
            ),

            (
                "TEXTCOLOR",
                (0, 0),
                (0, -1),
                colors.HexColor("#1F2937")
            ),

            (
                "GRID",
                (0, 0),
                (-1, -1),
                0.5,
                colors.lightgrey
            ),

            (
                "FONTNAME",
                (0, 0),
                (0, -1),
                "Helvetica-Bold"
            ),

            (
                "VALIGN",
                (0, 0),
                (-1, -1),
                "MIDDLE"
            ),

            (
                "PADDING",
                (0, 0),
                (-1, -1),
                8
            )

        ])

    )


    story.append(
        patient_table
    )


    story.append(
        Spacer(1, 20)
    )


    # ==================================================
    # HEALTH PARAMETERS
    # ==================================================

    story.append(

        Paragraph(
            "Health Parameters",
            heading_style
        )

    )


    health_data = [

        [
            "Parameter",
            "Value"
        ],

        [
            "Pregnancies",
            str(assessment.pregnancies)
        ],

        [
            "Glucose",
            f"{assessment.glucose} mg/dL"
        ],

        [
            "Blood Pressure",
            f"{assessment.blood_pressure} mm Hg"
        ],

        [
            "Skin Thickness",
            f"{assessment.skin_thickness} mm"
        ],

        [
            "Insulin",
            f"{assessment.insulin} μU/mL"
        ],

        [
            "BMI",
            str(assessment.bmi)
        ],

        [
            "Diabetes Pedigree Function",
            str(
                assessment.diabetes_pedigree
            )
        ],

        [
            "Age",
            f"{assessment.age} years"
        ]

    ]


    health_table = Table(

        health_data,

        colWidths=[
            3.5 * inch,
            3.2 * inch
        ]

    )


    health_table.setStyle(

        TableStyle([

            (
                "BACKGROUND",
                (0, 0),
                (-1, 0),
                colors.HexColor("#2F6F62")
            ),

            (
                "TEXTCOLOR",
                (0, 0),
                (-1, 0),
                colors.white
            ),

            (
                "FONTNAME",
                (0, 0),
                (-1, 0),
                "Helvetica-Bold"
            ),

            (
                "GRID",
                (0, 0),
                (-1, -1),
                0.5,
                colors.lightgrey
            ),

            (
                "ROWBACKGROUNDS",
                (0, 1),
                (-1, -1),
                [
                    colors.white,
                    colors.HexColor("#F7FAF9")
                ]
            ),

            (
                "PADDING",
                (0, 0),
                (-1, -1),
                8
            )

        ])

    )


    story.append(
        health_table
    )


    story.append(
        Spacer(1, 20)
    )


    # ==================================================
    # AI RESULT
    # ==================================================

    story.append(

        Paragraph(
            "AI Risk Assessment Result",
            heading_style
        )

    )


    prediction_text = (

        "Diabetes Risk Detected"

        if assessment.prediction == 1

        else

        "No Diabetes Risk Detected"

    )


    result_data = [

        [
            "AI Prediction",
            prediction_text
        ],

        [
            "Risk Probability",
            f"{assessment.risk_probability:.2f}%"
        ],

        [
            "Risk Category",
            assessment.risk_category
        ]

    ]


    result_table = Table(

        result_data,

        colWidths=[
            2.5 * inch,
            4.2 * inch
        ]

    )


    result_table.setStyle(

        TableStyle([

            (
                "BACKGROUND",
                (0, 0),
                (0, -1),
                colors.HexColor("#DCEDE9")
            ),

            (
                "FONTNAME",
                (0, 0),
                (0, -1),
                "Helvetica-Bold"
            ),

            (
                "GRID",
                (0, 0),
                (-1, -1),
                0.5,
                colors.lightgrey
            ),

            (
                "PADDING",
                (0, 0),
                (-1, -1),
                10
            )

        ])

    )


    story.append(
        result_table
    )


    story.append(
        Spacer(1, 25)
    )


    # ==================================================
    # DISCLAIMER
    # ==================================================

    story.append(

        Paragraph(
            "Medical Disclaimer",
            heading_style
        )

    )


    disclaimer = (

        "This report is generated using a machine learning model "
        "for educational and screening purposes only. "
        "It is not a medical diagnosis and should not replace "
        "professional medical advice, diagnosis, or treatment. "
        "Please consult a qualified healthcare professional "
        "for medical concerns."

    )


    story.append(

        Paragraph(
            disclaimer,
            normal_style
        )

    )


    story.append(
        Spacer(1, 15)
    )


    story.append(

        Paragraph(
            f"Report generated by Healthcare AI on "
            f"{datetime.now().strftime('%d %B %Y, %I:%M %p')}",
            subtitle_style
        )

    )


    # ==================================================
    # BUILD PDF
    # ==================================================

    document.build(
        story
    )


    return file_path