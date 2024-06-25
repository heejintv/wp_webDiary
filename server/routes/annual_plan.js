const express = require("express");
const router = express.Router();
const db = require("../models/user");

// 연간 계획 추가 API
router.post("/", (req, res) => {
  const { month, title, description } = req.body;
  const sql =
    "INSERT INTO annual_plan (month, title, description) VALUES (?, ?, ?)";
  db.run(sql, [month, title, description], (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(200).json({ message: "Annual plan added successfully" });
    }
  });
});

// 연간 계획 조회 API
router.get("/", (req, res) => {
  const sql = "SELECT * FROM annual_plan";
  db.all(sql, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(200).json(rows);
    }
  });
});

module.exports = router;
