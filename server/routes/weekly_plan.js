const express = require("express");
const router = express.Router();
const db = require("../models/user");

// 주간 계획 추가 API
router.post("/", (req, res) => {
  const { day, title, description } = req.body;
  const sql =
    "INSERT INTO weekly_plan (day, title, description) VALUES (?, ?, ?)";
  db.run(sql, [day, title, description], (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(200).json({ message: "Weekly plan added successfully" });
    }
  });
});

// 주간 계획 조회 API
router.get("/", (req, res) => {
  const sql = "SELECT * FROM weekly_plan";
  db.all(sql, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(200).json(rows);
    }
  });
});

module.exports = router;
