const mongoose = require("mongoose");

const collaboratorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, default: "Member" },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
});

module.exports = mongoose.model("Collaborator", collaboratorSchema);
