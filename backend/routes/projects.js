const express = require("express");
const router = express.Router();
const Project = require("../models/Project"); // Ensure you have the Project model

// Get all projects
router.get("/", async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a specific project by ID
router.get("/:projectId", async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }
    res.json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a new project
router.post("/", async (req, res) => {
  const { name, description, deadline } = req.body;
  
  if (!name || !description || !deadline) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const newProject = new Project({
    name,
    description,
    deadline,
  });

  try {
    const savedProject = await newProject.save();
    res.json(savedProject);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a project
router.delete("/:projectId", async (req, res) => {
  try {
    const deletedProject = await Project.findByIdAndDelete(req.params.projectId);
    if (!deletedProject) {
      return res.status(404).json({ error: "Project not found" });
    }
    res.json({ message: "Project deleted successfully", deletedProject });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Export the router
module.exports = router;
