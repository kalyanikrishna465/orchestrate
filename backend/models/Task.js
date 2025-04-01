const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Project" },
  name: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  priority: { type: String, enum: ["High", "Medium", "Low"], default: "Medium" },
  dependencies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
  status: { type: String, enum: ["Pending", "In Progress", "Completed"], default: "Pending" }
}, { timestamps: true });

TaskSchema.pre("validate", function(next) {
  if (this.endDate <= this.startDate) {
    next(new Error("End date must be after start date"));
  } else {
    next();
  }
});

module.exports = mongoose.model("Task", TaskSchema);
