import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Projects from "./pages/Projects";
import TrackProjects from "./pages/TrackProjects";
import ProjectDetails from "./pages/ProjectDetails";
import Chat from "./pages/Chat"; // Import Chat Component

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/track-project" element={<TrackProjects />} />
        <Route path="/project/:id" element={<ProjectDetails />} />
        <Route path="/chat" element={<Chat />} /> {/* Chat Route */}
      </Routes>
    </Router>
  );
};

export default App;
