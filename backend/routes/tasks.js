const express = require("express");
const router = express.Router();
const Task = require("../models/Task");

// Get all tasks for a project
router.get("/:projectId", async (req, res) => {
  try {
    const tasks = await Task.find({ projectId: req.params.projectId }).sort("startDate");
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a new task
router.post("/", async (req, res) => {
  try {
    const { projectId, name, startDate, endDate, priority, dependencies } = req.body;

    if (!projectId || !name || !startDate || !endDate) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newTask = new Task({
      projectId,
      name,
      startDate,
      endDate,
      priority: priority || "Medium",
      dependencies: dependencies ? dependencies.split(",").map((id) => id.trim()) : [],
      status: "Pending"
    });

    const savedTask = await newTask.save();
    res.json(savedTask);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update task status
router.put("/:taskId/status", async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    task.status = req.body.status || "Pending";
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a task
router.delete("/:taskId", async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.taskId);
    if (!deletedTask) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.json({ message: "Task deleted successfully", deletedTask });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
