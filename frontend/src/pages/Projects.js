import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

const Projects = () => {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [projectData, setProjectData] = useState({
    name: "",
    description: "",
    deadline: "",
  });

  const handleChange = (e) => {
    setProjectData({ ...projectData, [e.target.name]: e.target.value });
  };

  const saveProject = async () => {
    try {
      const response = await fetch("http://localhost:5000/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(projectData),
      });

      if (response.ok) {
        alert("✅ Project created successfully!");
        navigate(`/projects`); // Redirect to project details
      } else {
        const errorData = await response.json();
        alert(`❌ Error: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("❌ Failed to connect to the server.");
    }
  };

  return (
    <>
      <Header />
      <div style={styles.container}>
        <h1 style={styles.title}>Manage Your Projects</h1>
        <p style={styles.subtitle}>Choose an option to proceed:</p>

        <div style={styles.buttonContainer}>
          <button style={styles.button} onClick={() => setShowForm(true)}>
            Start a New Project
          </button>
          <button style={styles.button} onClick={() => navigate("/track-project")}>
            Track an Existing Project
          </button>

        </div>

        {/* New Project Form */}
        {showForm && (
          <div style={styles.formContainer}>
            <h2 style={styles.formTitle}>Enter Project Details</h2>
            <input
              type="text"
              name="name"
              placeholder="Project Name"
              value={projectData.name}
              onChange={handleChange}
              style={styles.input}
              required
            />
            <textarea
              name="description"
              placeholder="Project Description"
              value={projectData.description}
              onChange={handleChange}
              style={styles.input}
              required
            />
            <input
              type="date"
              name="deadline"
              value={projectData.deadline}
              onChange={handleChange}
              style={styles.input}
              required
            />
            <button style={styles.saveButton} onClick={saveProject}>
              Save Project
            </button>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

// 🎨 Styling
const styles = {
  container: {
    textAlign: "center",
    padding: "30px",
    backgroundColor: "#568265",
    minHeight: "80vh",
  },
  title: {
    fontSize: "32px",
    fontWeight: "bold",
    color: "#F2F6EB",
  },
  subtitle: {
    fontSize: "18px",
    marginBottom: "30px",
    color: "#333",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    marginTop: "20px",
    marginBottom:"40px"
  },
  button: {
    backgroundColor: "#92C3A4",
    color: "white",
    padding: "15px 25px",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    cursor: "pointer",
    transition: "0.3s",
  },
  formContainer: {
    marginTop: "90px",
    padding: "50px",
    backgroundColor: "#92C3A4",
    borderRadius: "20px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
    width: "50%",
    margin: "auto",
    marginBottom: "80px",
  },
  formTitle: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "15px",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "15px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "16px",
  },
  saveButton: {
    backgroundColor: "#B85042",
    color: "white",
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    fontSize: "16px",
    cursor: "pointer",
  },
};

export default Projects;
