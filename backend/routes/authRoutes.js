const express = require("express");

const router = express.Router();

router.post("/login", (req, res) => {
  const { employeeID, password } = req.body;

  // ✅ Always allow login for now
  if (employeeID && password) {
    res.json({ success: true, message: "✅ Login Successful!" });
  } else {
    res.status(400).json({ success: false, message: "❌ Employee ID and Password required!" });
  }
});

module.exports = router;
