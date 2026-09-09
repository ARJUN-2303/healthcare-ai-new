const API_URL = "https://healthcare-ai-new-twae.onrender.com";


// ==========================================
// GET AUTH TOKEN
// ==========================================

const getToken = () => {

  return localStorage.getItem(
    "access_token"
  );

};


// ==========================================
// COMMON AUTH HEADERS
// ==========================================

const getAuthHeaders = () => {

  const token = getToken();

  return {

    "Content-Type": "application/json",

    "Authorization":
      `Bearer ${token}`

  };

};


// ==========================================
// LOGIN USER
// ==========================================

export const loginUser = async (

  email,
  password

) => {

  const response = await fetch(

    `${API_URL}/login`,

    {

      method: "POST",

      headers: {

        "Content-Type":
          "application/json"

      },

      body: JSON.stringify({

        email,
        password

      })

    }

  );


  const data =
    await response.json();


  if (!response.ok) {

    throw new Error(

      data.detail ||
      "Login failed"

    );

  }


  // Save JWT token

  localStorage.setItem(

    "access_token",

    data.access_token

  );


  return data;

};



// ==========================================
// REGISTER USER
// ==========================================

export const registerUser = async (

  full_name,
  email,
  password

) => {

  const response = await fetch(

    `${API_URL}/register`,

    {

      method: "POST",

      headers: {

        "Content-Type":
          "application/json"

      },

      body: JSON.stringify({

        full_name,
        email,
        password

      })

    }

  );


  const data =
    await response.json();


  if (!response.ok) {

    throw new Error(

      data.detail ||
      "Registration failed"

    );

  }


  return data;

};



// ==========================================
// PREDICT DIABETES RISK
// ==========================================

export const predictRisk = async (

  healthData

) => {

  const response = await fetch(

    `${API_URL}/predict`,

    {

      method: "POST",

      headers:

        getAuthHeaders(),


      body:

        JSON.stringify({

          pregnancies:
            Number(
              healthData.pregnancies
            ),

          glucose:
            Number(
              healthData.glucose
            ),

          blood_pressure:
            Number(
              healthData.blood_pressure
            ),

          skin_thickness:
            Number(
              healthData.skin_thickness
            ),

          insulin:
            Number(
              healthData.insulin
            ),

          bmi:
            Number(
              healthData.bmi
            ),

          diabetes_pedigree:
            Number(
              healthData.diabetes_pedigree
            ),

          age:
            Number(
              healthData.age
            )

        })

    }

  );


  const data =
    await response.json();


  if (!response.ok) {

    throw new Error(

      data.detail ||
      "Prediction failed"

    );

  }


  return data;

};



// ==========================================
// GET ASSESSMENT HISTORY
// ==========================================

export const getHistory = async () => {

  const response = await fetch(

    `${API_URL}/history`,

    {

      method: "GET",

      headers:

        getAuthHeaders()

    }

  );


  const data =
    await response.json();


  if (!response.ok) {

    throw new Error(

      data.detail ||
      "Failed to load history"

    );

  }


  return data;

};



// ==========================================
// DOWNLOAD PDF REPORT
// ==========================================

export const downloadReport = async (

  assessmentId

) => {

  const token =
    getToken();


  const response = await fetch(

    `${API_URL}/report/${assessmentId}`,

    {

      method: "GET",

      headers: {

        "Authorization":

          `Bearer ${token}`

      }

    }

  );


  if (!response.ok) {

    const error =
      await response.json();

    throw new Error(

      error.detail ||
      "Report download failed"

    );

  }


  // Convert response to PDF blob

  const blob =
    await response.blob();


  // Create temporary download URL

  const url =
    window.URL.createObjectURL(

      blob

    );


  // Create download link

  const link =
    document.createElement(

      "a"

    );


  link.href =
    url;


  link.download =
    `Healthcare_AI_Report_${assessmentId}.pdf`;


  document.body.appendChild(

    link

  );


  link.click();


  document.body.removeChild(

    link

  );


  window.URL.revokeObjectURL(

    url

  );

};



// ==========================================
// LOGOUT USER
// ==========================================

export const logoutUser = () => {

  localStorage.removeItem(

    "access_token"

  );

};