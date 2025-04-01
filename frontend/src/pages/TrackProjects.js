import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

const TrackProjects = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);

  // Fetch projects from backend
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("http://localhost:5000/projects");
        const data = await response.json();
        setProjects(data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, []);

  return (
    <>
      <Header />
      <div style={styles.container}>
        <h1 style={styles.title}>Track Your Projects</h1>
        <p style={styles.subtitle}>Select a project to manage:</p>

        <ul style={styles.list}>
          {projects.length > 0 ? (
            projects.map((project) => (
              <li key={project._id} style={styles.listItem}>
                <button
                  style={styles.projectButton}
                  onClick={() => navigate(`/project/${project._id}`)}
                >
                  {project.name}
                </button>
              </li>
            ))
          ) : (
            <p>No projects found.</p>
          )}
        </ul>
      </div>
      <Footer />
    </>
  );
};

// 🎨 Styles
const styles = {
  container: { textAlign: "center", padding: "30px", backgroundColor: "#568265", minHeight: "80vh" },
  title: { fontSize: "32px", fontWeight: "bold", color: "#F2F6EB" },
  subtitle: { fontSize: "18px", marginBottom: "30px", color: "#333" },
  list: { listStyleType: "none", padding: 0 },
  listItem: { margin: "10px 0" },
  projectButton: {
    backgroundColor: "#92C3A4",
    color: "white",
    padding: "10px 20px",
    border: "none",
    borderRadius: "8px",
    fontSize: "18px",
    cursor: "pointer",
  },
};

export default TrackProjects;
