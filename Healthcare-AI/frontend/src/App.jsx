import { useState, useEffect } from "react";
import healthMonitoring from "./assets/health-monitoring.png";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";
import "./App.css";
import healthDataImage from "./assets/image.png";
import glucoseImage from "./assets/glucose-chart.png";
import bloodPressureImage from "./assets/blood-pressure.png";
import insulinImage from "./assets/insulin.png";
import bmiImage from "./assets/bmi.png";
import pregnancyImage from "./assets/pregnancy.png";
import healthMonitoringImage from "./assets/health-monitoring.png";


const API_URL = "https://healthcare-ai-new-twae.onrender.com";
// ==================================================
// NAVBAR
// ==================================================

function Navbar() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  // Get logged-in user details
  let user = {};

  try {
    user = JSON.parse(localStorage.getItem("user") || "{}");
  } catch (error) {
    user = {};
  }

  // Show user's first name in navbar
  const userName =
    user.full_name?.split(" ")[0] ||
    user.name?.split(" ")[0] ||
    "Profile";

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("latestPrediction");

    navigate("/login");
  }

  return (
    <nav className="navbar">

      {/* LEFT SIDE */}
      <div className="navbar-left">

        {/* LOGO + BRAND */}
        <Link to="/" className="brand">

          <div className="logo">
            ♡
          </div>

          <div className="brand-text">

            <div className="brand-title">
              HEALTHCARE <span>AI</span>
            </div>

            <div className="brand-subtitle">
              INTELLIGENT HEALTH SYSTEM
            </div>

          </div>

        </Link>


        {/* NAVIGATION LINKS */}
        <div className="nav-links">

          <Link to="/">
            Home
          </Link>

          <a href="/#features">
            Features
          </a>

          <a href="/#about">
            About
          </a>


          {token ? (
            <>
              <Link to="/dashboard">
                Dashboard
              </Link>

              {/* USER NAME INSTEAD OF PROFILE */}
              <Link to="/profile">
                {userName}
              </Link>
            </>
          ) : (
            <Link to="/login">
              Login
            </Link>
          )}

        </div>

      </div>


      {/* RIGHT SIDE */}
      <div className="navbar-right">

        {token && (
          <button
            onClick={handleLogout}
            className="nav-logout"
          >
            Logout
          </button>
        )}


        {token ? (

          <Link
            to="/assessment"
            className="nav-button"
          >
            New Assessment →
          </Link>

        ) : (

          <Link
            to="/register"
            className="nav-button"
          >
            Get Started →
          </Link>

        )}

      </div>

    </nav>
  );
}

// ==================================================
// HOME
// ==================================================

function Home() {
  return (
    <>
      <Navbar />

      <main className="home-main">
        <section className="hero">
          <div className="hero-left">
            <div className="tag">
              <span></span>
              AI-POWERED HEALTH ANALYTICS
            </div>

            <h1>
              Smarter
              <br />

              Insights.
              <br />

              <span>Better Health</span>
              <br />

              Decisions.
            </h1>

            <p>
              Healthcare AI uses machine learning
              to analyze health data and provide
              intelligent diabetes risk assessments
              with personalized insights.
            </p>

            <div className="hero-buttons">
              <Link
                to="/assessment"
                className="primary-button"
              >
                Start Health Assessment →
              </Link>

              <a
                href="#features"
                className="secondary-button"
              >
                Learn More
              </a>
            </div>

            <div className="stats">
              <div>
                <h3>AI</h3>
                <p>Powered Analysis</p>
              </div>

              <div className="divider"></div>

              <div>
                <h3>24/7</h3>
                <p>Accessible Platform</p>
              </div>

              <div className="divider"></div>

              <div>
                <h3>100%</h3>
                <p>Personal Records</p>
              </div>
            </div>
          </div>

          <div className="ai-card">
            <div className="card-label">
              HEALTH ANALYSIS
            </div>

            <h2>Diabetes Risk</h2>

            <div className="ai-circle">
              <strong>AI</strong>
              <span>ANALYSIS</span>
            </div>

            <p>
              Intelligent prediction ready
            </p>
          </div>
        </section>


        <section
          id="features"
          className="features-section"
        >
          <div className="section-tag">
            OUR PLATFORM
          </div>

          <h2>
            Everything You Need for
            <br />
            Intelligent Health Analysis
          </h2>

          <div className="feature-grid">

            <div className="feature-card">
              <div className="feature-icon">
                ⌘
              </div>

              <h3>AI Prediction</h3>

              <p>
                Machine learning analyzes health
                parameters and estimates diabetes
                risk intelligently.
              </p>
            </div>


            <div className="feature-card">
              <div className="feature-icon">
                ▥
              </div>

              <h3>Health Analytics</h3>

              <p>
                Visualize your assessment results
                with meaningful health insights.
              </p>
            </div>


            <div className="feature-card">
              <div className="feature-icon">
                ▤
              </div>

              <h3>Medical Reports</h3>

              <p>
                Download professional assessment
                reports and maintain your health
                history.
              </p>
            </div>


            <div className="feature-card">
              <div className="feature-icon">
                ♙
              </div>

              <h3>Personal Account</h3>

              <p>
                Every user gets a secure account
                with private prediction history
                and reports.
              </p>
            </div>

          </div>
        </section>


      <section id="about" className="about-section">

  {/* ================= ABOUT INTRO ================= */}

  <div className="about-intro">

    <div className="section-tag">
      AI-POWERED ANALYSIS
    </div>

    <h2>
      Intelligent Diabetes Risk Prediction
    </h2>

    <p>
      Healthcare AI uses machine learning algorithms trained on healthcare
      data to identify meaningful patterns and estimate potential diabetes risk.
    </p>

    <p>
      Our goal is to support early awareness and help users better understand
      their health information through simple and accessible technology.
    </p>

  </div>


  {/* ================= MEDICAL PARAMETERS ================= */}

  <div className="medical-section">

    <div className="medical-content">

      <div className="section-tag">
        HEALTH DATA ANALYSIS
      </div>

      <h2>
        Important Medical Parameters
      </h2>

      <p>
        Our diabetes risk prediction system analyzes important medical and
        health parameters to provide intelligent risk assessment.
      </p>


      <div className="parameter-list">

        <div>✓ Glucose Level</div>
        <div>✓ Blood Pressure</div>

        <div>✓ BMI</div>
        <div>✓ Insulin</div>

        <div>✓ Skin Thickness</div>
        <div>✓ Pregnancies</div>

        <div>✓ Age</div>
        <div>✓ Diabetes Pedigree Function</div>

      </div>

    </div>


    {/* MAIN IMAGE */}

    <div className="medical-image">

      <img
  src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d"
  alt="Health Monitoring"
/>

    </div>

  </div>


  {/* ================= IMAGE GALLERY ================= */}

 <div className="diabetes-gallery">

  <img
    src={glucoseImage}
    alt="Glucose Level"
  />

  <img
    src={bloodPressureImage}
    alt="Blood Pressure"
  />

  <img
    src={bmiImage}
    alt="Body Mass Index"
  />

  <img
    src={insulinImage}
    alt="Insulin"
  />

  <img
    src={pregnancyImage}
    alt="Pregnancy"
  />

</div>


  {/* ================= FOOTER ================= */}

  <div className="about-footer">

    <h3>
      ♡ HEALTHCARE <span>AI</span>
    </h3>

    <p>
      AI-Powered Diabetes Risk Prediction System
    </p>

    <p>
      © 2026 Healthcare AI. Educational Medical Technology Project.
    </p>

  </div>

</section>

      </main>

      <Footer />
    </>
  );
}


// ==================================================
// LOGIN
// ==================================================

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");


  async function handleLogin(e) {
    e.preventDefault();

    try {
      const response = await fetch(
        `${API_URL}/login`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data =
        await response.json();

      if (response.ok) {
        localStorage.setItem(
          "token",
          data.access_token
        );

        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );

        navigate("/dashboard");
      } else {
        alert(
          data.detail ||
          "Login failed"
        );
      }
    } catch (error) {
      console.error(error);

      alert(
        "Cannot connect to backend."
      );
    }
  }


  return (
    <div className="auth-page">

      <Link
        to="/"
        className="auth-brand"
      >
        ← HEALTHCARE <span>AI</span>
      </Link>


      <div className="auth-container">
        <div className="auth-box">

          <div className="auth-icon">
            ♡
          </div>

          <h1>
            Welcome Back
          </h1>

          <p>
            Login to access your personal
            health dashboard.
          </p>


          <form onSubmit={handleLogin}>

            <label>
              Email Address
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
            />


            <label>
              Password
            </label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              required
            />


            <div className="forgot-row">
              <Link to="/forgot-password">
                Forgot Password?
              </Link>
            </div>


            <button
              className="primary-button full-button"
            >
              Login →
            </button>

          </form>


          <p className="switch-page">
            Don't have an account?{" "}

            <Link to="/register">
              Create Account
            </Link>
          </p>

        </div>
      </div>

    </div>
  );
}


// ==================================================
// REGISTER
// ==================================================

function Register() {
  const navigate = useNavigate();

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");


  async function handleRegister(e) {
    e.preventDefault();

    try {
      const response = await fetch(
        `${API_URL}/register`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            full_name: name,
            email: email,
            password: password,
          }),
        }
      );

      const data =
        await response.json();

      if (response.ok) {
        alert(
          "Account created successfully!"
        );

        navigate("/login");
      } else {
        alert(
          data.detail ||
          "Registration failed"
        );
      }

    } catch (error) {
      console.error(
        "Registration error:",
        error
      );

      alert(
        "Cannot connect to backend. Make sure FastAPI is running."
      );
    }
  }


  return (
    <div className="auth-page">

      <Link
        to="/"
        className="auth-brand"
      >
        ← HEALTHCARE <span>AI</span>
      </Link>


      <div className="auth-container">
        <div className="auth-box">

          <div className="auth-icon">
            ♡
          </div>

          <h1>
            Create Account
          </h1>

          <p>
            Create your personal Healthcare AI
            account.
          </p>


          <form
            onSubmit={handleRegister}
          >

            <label>
              Full Name
            </label>

            <input
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              required
            />


            <label>
              Email Address
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
            />


            <label>
              Create Password
            </label>

            <input
              type="password"
              placeholder="Create a strong password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              required
            />


            <button
              className="primary-button full-button"
            >
              Create Account →
            </button>

          </form>


          <p className="switch-page">
            Already have an account?{" "}

            <Link to="/login">
              Login
            </Link>
          </p>

        </div>
      </div>

    </div>
  );
}


// ==================================================
// FORGOT PASSWORD
// ==================================================

function ForgotPassword() {
  const [email, setEmail] =
    useState("");


  function handleSubmit(e) {
    e.preventDefault();

    alert(
      `OTP request will be sent to ${email}.`
    );
  }


  return (
    <div className="auth-page">

      <Link
        to="/"
        className="auth-brand"
      >
        ← HEALTHCARE <span>AI</span>
      </Link>


      <div className="auth-container">
        <div className="auth-box">

          <div className="auth-icon">
            ⌁
          </div>

          <h1>
            Forgot Password?
          </h1>

          <p>
            Enter your registered email address.
          </p>


          <form onSubmit={handleSubmit}>

            <label>
              Email Address
            </label>

            <input
              type="email"
              placeholder="Enter your registered email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
            />


            <button
              className="primary-button full-button"
            >
              Send OTP →
            </button>

          </form>


          <p className="switch-page">
            <Link to="/login">
              ← Back to Login
            </Link>
          </p>

        </div>
      </div>

    </div>
  );
}


// ==================================================
// ASSESSMENT
// ==================================================

function Assessment() {
  const navigate = useNavigate();


  const [formData, setFormData] =
    useState({
      pregnancies: "",
      glucose: "",
      bloodPressure: "",
      skinThickness: "",
      insulin: "",
      bmi: "",
      diabetesPedigree: "",
      age: "",
    });


  function handleChange(e) {
    setFormData({
      ...formData,

      [e.target.name]:
        e.target.value,
    });
  }


  async function handleSubmit(e) {
    e.preventDefault();

    const token =
      localStorage.getItem("token");


    if (!token) {
      alert(
        "Please login first."
      );

      navigate("/login");

      return;
    }


    try {
      const response = await fetch(
        `${API_URL}/predict`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify({

            pregnancies:
              Number(
                formData.pregnancies
              ),

            glucose:
              Number(
                formData.glucose
              ),

            blood_pressure:
              Number(
                formData.bloodPressure
              ),

            skin_thickness:
              Number(
                formData.skinThickness
              ),

            insulin:
              Number(
                formData.insulin
              ),

            bmi:
              Number(
                formData.bmi
              ),

            diabetes_pedigree:
              Number(
                formData.diabetesPedigree
              ),

            age:
              Number(
                formData.age
              ),
          }),
        }
      );


      const data =
        await response.json();


      if (response.ok) {

        localStorage.setItem(
          "latestPrediction",
          JSON.stringify(data)
        );

        navigate("/dashboard");

      } else {

        console.log(data);

        alert(
          typeof data.detail === "object"

            ? JSON.stringify(
                data.detail,
                null,
                2
              )

            : data.detail ||
              "Prediction failed"
        );
      }

    } catch (error) {

      console.error(
        "Prediction error:",
        error
      );

      alert(
        "Cannot connect to prediction backend."
      );
    }
  }


  return (
    <div className="dashboard-page">

      <Navbar />


      <div className="assessment-container">

        <div className="assessment-header">

          <div>

            <div className="section-tag">
              HEALTH ASSESSMENT
            </div>

            <h1>
              Diabetes Risk Analysis
            </h1>

            <p>
              Enter your health parameters for
              AI-powered risk assessment.
            </p>

          </div>

        </div>


        <form
          className="assessment-form"
          onSubmit={handleSubmit}
        >

          <div className="form-grid">

            <Input
              label="Pregnancies"
              name="pregnancies"
              value={
                formData.pregnancies
              }
              onChange={handleChange}
            />


            <Input
              label="Glucose Level"
              name="glucose"
              value={
                formData.glucose
              }
              onChange={handleChange}
            />


            <Input
              label="Blood Pressure"
              name="bloodPressure"
              value={
                formData.bloodPressure
              }
              onChange={handleChange}
            />


            <Input
              label="Skin Thickness"
              name="skinThickness"
              value={
                formData.skinThickness
              }
              onChange={handleChange}
            />


            <Input
              label="Insulin"
              name="insulin"
              value={
                formData.insulin
              }
              onChange={handleChange}
            />


            <Input
              label="BMI"
              name="bmi"
              value={
                formData.bmi
              }
              onChange={handleChange}
            />


            <Input
              label="Diabetes Pedigree"
              name="diabetesPedigree"
              value={
                formData.diabetesPedigree
              }
              onChange={handleChange}
            />


            <Input
              label="Age"
              name="age"
              value={
                formData.age
              }
              onChange={handleChange}
            />

          </div>


          <button
            className="primary-button prediction-button"
          >
            Analyze Health Data →
          </button>

        </form>

      </div>

    </div>
  );
}


// ==================================================
// INPUT
// ==================================================

function Input({
  label,
  name,
  value,
  onChange,
}) {
  return (
    <div className="input-group">

      <label>
        {label}
      </label>

      <input
        type="number"
        step="any"
        name={name}
        value={value}
        onChange={onChange}
        required
      />

    </div>
  );
}


// ==================================================
// DASHBOARD
// ==================================================

function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const profileName = user.full_name || user.name || "Profile";
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHistory() {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/history`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.detail || "Unable to load history");
        setHistory(data.history || []);
      } catch (error) {
        console.error("History error:", error);
      } finally {
        setLoading(false);
      }
    }
    loadHistory();
  }, []);

  async function downloadReport(assessmentId) {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${API_URL}/report/${assessmentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        const error = await response.json();
        alert(error.detail || "Unable to download report");
        return;
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Healthcare_AI_Report_${assessmentId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download error:", error);
      alert("Error downloading report.");
    }
  }

  const latestAssessment = history.length > 0 ? history[0] : null;

  return (
    <div className="dashboard-page">
      <Navbar />

      <div className="dashboard-container">
        <div className="dashboard-header">
          <div>
            <div className="section-tag">PERSONAL DASHBOARD</div>
            <h1>
              Welcome, {user.full_name || user.name || "User"} 👋
            </h1>
            <p>View your latest health assessment and AI-powered insights.</p>
          </div>

          <div className="dashboard-actions">
            <Link to="/profile" className="secondary-button">
              {profileName} 👤
            </Link>
            <Link to="/assessment" className="primary-button">
              New Assessment →
            </Link>
          </div>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-card">
            <div className="card-label">LATEST ASSESSMENT</div>
            <h2>
              {loading
                ? "Loading..."
                : latestAssessment
                ? latestAssessment.risk_category
                : "No Assessment Yet"}
            </h2>
            <p>
              {latestAssessment
                ? `Risk Probability: ${latestAssessment.risk_probability}%`
                : "Start your first health assessment."}
            </p>
          </div>

          <div className="dashboard-card">
            <div className="card-label">HEALTH ANALYTICS</div>
            <div className="chart-placeholder">
              <div className="bar b1"></div>
              <div className="bar b2"></div>
              <div className="bar b3"></div>
              <div className="bar b4"></div>
              <div className="bar b5"></div>
            </div>
            <p>AI-powered health analytics.</p>
          </div>

          <div className="dashboard-card">
            <div className="card-label">MEDICAL REPORT</div>
            <h2>PDF Report</h2>
            <p>Download your latest assessment.</p>
            <button
              className="secondary-button report-button"
              disabled={!latestAssessment}
              onClick={() =>
                latestAssessment && downloadReport(latestAssessment.id)
              }
            >
              Download Report ↓
            </button>
          </div>
        </div>

        <div
          style={{
            marginTop: "28px",
            padding: "24px",
            border: "1px solid rgba(126, 198, 225, 0.18)",
            borderRadius: "18px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "20px",
            flexWrap: "wrap",
          }}
        >
          <div>
            <div className="section-tag">ASSESSMENT HISTORY</div>
            <h2 style={{ margin: "8px 0 6px" }}>
              Your complete assessment history
            </h2>
            <p style={{ margin: 0 }}>
              All previous assessments, health data, PDF downloads and delete
              options are available only in your Profile page.
            </p>
          </div>

          <Link to="/profile" className="primary-button">
            Open My Profile →
          </Link>
        </div>
      </div>
    </div>
  );
}


// ==================================================
// PROFILE
// ==================================================

function Profile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setLoading(true);

      const profileResponse = await fetch(`${API_URL}/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const historyResponse = await fetch(`${API_URL}/history`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const profileData = await profileResponse.json();
      const historyData = await historyResponse.json();

      if (!profileResponse.ok) {
        throw new Error(profileData.detail || "Unable to load profile");
      }

      if (!historyResponse.ok) {
        throw new Error(
          historyData.detail || "Unable to load assessment history"
        );
      }

      setProfile(profileData);
      setHistory(historyData.history || []);
    } catch (error) {
      console.error("Profile error:", error);
      alert("Unable to load profile.");
    } finally {
      setLoading(false);
    }
  }

  async function downloadReport(assessmentId) {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${API_URL}/report/${assessmentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.detail || "Unable to download report");
        return;
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = `Healthcare_AI_Report_${assessmentId}.pdf`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download error:", error);
      alert("Error downloading report.");
    }
  }

  async function deleteAssessment(assessmentId) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this assessment?"
    );

    if (!confirmDelete) return;

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `${API_URL}/assessment/${assessmentId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.detail || "Unable to delete assessment");
        return;
      }

      setHistory((currentHistory) =>
        currentHistory.filter(
          (assessment) => assessment.id !== assessmentId
        )
      );

      alert("Assessment deleted successfully.");
    } catch (error) {
      console.error("Delete error:", error);
      alert("Error deleting assessment.");
    }
  }

  if (loading) {
    return (
      <div className="dashboard-page">
        <Navbar />
        <div className="profile-container">
          Loading profile...
        </div>
      </div>
    );
  }

  const latestAssessment =
    history.length > 0 ? history[0] : null;

  const healthFields = [
    ["Pregnancies", "pregnancies"],
    ["Glucose", "glucose"],
    ["Blood Pressure", "blood_pressure"],
    ["Skin Thickness", "skin_thickness"],
    ["Insulin", "insulin"],
    ["BMI", "bmi"],
    ["Pedigree", "diabetes_pedigree"],
    ["Age", "age"],
  ];

  return (
    <div className="dashboard-page">
      <Navbar />

      <div className="profile-container">
        <div className="profile-header">
          <div>
            <div className="section-tag">MY ACCOUNT</div>
            <h1>My Profile 👤</h1>
            <p>
              Manage your Healthcare AI account and complete assessment history.
            </p>
          </div>

          <div className="profile-actions">
            <Link to="/dashboard" className="secondary-button">
              ← Dashboard
            </Link>

            <Link to="/assessment" className="primary-button">
              New Assessment →
            </Link>
          </div>
        </div>

        <div className="profile-summary-grid">
          <div className="profile-card account-card">
            <div className="profile-avatar">
              {profile?.full_name?.charAt(0)?.toUpperCase() || "U"}
            </div>

            <h2>{profile?.full_name || "User"}</h2>
            <p>{profile?.email || "-"}</p>

            <div className="profile-info">
              <div>
                <span>Account ID</span>
                <strong>#{profile?.id ?? "-"}</strong>
              </div>

              <div>
                <span>Total Assessments</span>
                <strong>{history.length}</strong>
              </div>
            </div>
          </div>

          <div className="profile-card activity-card">
            <div className="card-label">HEALTH ACTIVITY</div>

            <div className="profile-stats">
              <div>
                <h2>{history.length}</h2>
                <p>Total Assessments</p>
              </div>

              <div>
                <h2>
                  {latestAssessment
                    ? `${latestAssessment.risk_probability}%`
                    : "0%"}
                </h2>
                <p>Latest Risk</p>
              </div>
            </div>

            {latestAssessment && (
              <div className="latest-profile-result">
                <h3>Latest Assessment</h3>
                <p>{latestAssessment.risk_category}</p>
                <span>Assessment #{latestAssessment.id}</span>
              </div>
            )}
          </div>
        </div>

        <section style={{ marginTop: "36px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              gap: "20px",
              marginBottom: "24px",
              flexWrap: "wrap",
            }}
          >
            <div>
              <div className="section-tag">ASSESSMENT HISTORY</div>
              <h2 style={{ margin: "8px 0 0" }}>
                Your Previous Assessments
              </h2>
              <p style={{ marginTop: "8px" }}>
                Total: {history.length}
              </p>
            </div>
          </div>

          {history.length === 0 ? (
            <div
              className="profile-card"
              style={{ textAlign: "center" }}
            >
              <h3>No assessments yet</h3>
              <p>
                Complete your first health assessment to see it here.
              </p>
              <Link to="/assessment" className="primary-button">
                Start Assessment →
              </Link>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(340px, 1fr))",
                gap: "24px",
                alignItems: "stretch",
              }}
            >
              {history.map((assessment) => (
                <article
                  key={assessment.id}
                  style={{
                    background: "rgba(28, 53, 67, 0.82)",
                    border:
                      "1px solid rgba(126, 198, 225, 0.18)",
                    borderRadius: "18px",
                    padding: "24px",
                    minWidth: 0,
                    display: "flex",
                    flexDirection: "column",
                    gap: "18px",
                    textAlign: "left",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: "16px",
                      flexWrap: "wrap",
                    }}
                  >
                    <div>
                      <div className="card-label">ASSESSMENT</div>
                      <h3 style={{ margin: "8px 0 0" }}>
                        Assessment #{assessment.id}
                      </h3>
                    </div>

                    <span
                      style={{
                        padding: "8px 12px",
                        borderRadius: "999px",
                        border:
                          "1px solid rgba(126, 198, 225, 0.25)",
                        whiteSpace: "nowrap",
                        fontWeight: "700",
                      }}
                    >
                      {assessment.risk_category}
                    </span>
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr auto",
                      gap: "12px 20px",
                      alignItems: "center",
                    }}
                  >
                    <span>📅 Date</span>
                    <strong>
                      {assessment.created_at
                        ? new Date(
                            assessment.created_at
                          ).toLocaleString()
                        : "-"}
                    </strong>

                    <span>Risk Probability</span>
                    <strong>{assessment.risk_probability}%</strong>
                  </div>

                  <div
                    style={{
                      borderTop:
                        "1px solid rgba(126, 198, 225, 0.14)",
                      paddingTop: "18px",
                    }}
                  >
                    <h4 style={{ margin: "0 0 14px" }}>
                      Health Data
                    </h4>

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(2, minmax(0, 1fr))",
                        gap: "12px",
                      }}
                    >
                      {healthFields.map(([label, field]) => (
                        <div
                          key={field}
                          style={{
                            padding: "12px",
                            borderRadius: "12px",
                            background:
                              "rgba(10, 25, 35, 0.34)",
                            border:
                              "1px solid rgba(126, 198, 225, 0.10)",
                          }}
                        >
                          <span
                            style={{
                              display: "block",
                              fontSize: "12px",
                              letterSpacing: "0.05em",
                              opacity: 0.72,
                              marginBottom: "5px",
                            }}
                          >
                            {label}
                          </span>

                          <strong>
                            {assessment[field] === null ||
                            assessment[field] === undefined
                              ? "-"
                              : assessment[field]}
                          </strong>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap: "12px",
                      flexWrap: "wrap",
                      marginTop: "auto",
                    }}
                  >
                    <button
                      className="secondary-button"
                      onClick={() =>
                        downloadReport(assessment.id)
                      }
                    >
                      Download PDF ↓
                    </button>

                    <button
                      className="delete-button"
                      onClick={() =>
                        deleteAssessment(assessment.id)
                      }
                    >
                      Delete 🗑️
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}


// ==================================================
// FOOTER
// ==================================================

function Footer() {
  return (
    <footer>

      <div className="footer-brand">
        ♡ HEALTHCARE <span>AI</span>
      </div>

      <p>
        AI-Powered Diabetes Risk Prediction System
      </p>

      <p>
        © 2026 Healthcare AI.
        Educational Medical Technology Project.
      </p>

    </footer>
  );
}


// ==================================================
// APP
// ==================================================

function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        <Route
          path="/assessment"
          element={<Assessment />}
        />

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/profile"
          element={<Profile />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;