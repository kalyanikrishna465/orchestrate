const express = require("express");
const router = express.Router();
const Collaborator = require("../models/Collaborator");

router.post("/", async (req, res) => {
  try {
    const newCollaborator = new Collaborator(req.body);
    const savedCollaborator = await newCollaborator.save();
    res.json(savedCollaborator);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get("/:projectId", async (req, res) => {
  try {
    const collaborators = await Collaborator.find({ projectId: req.params.projectId });
    res.json(collaborators);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
