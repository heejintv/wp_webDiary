const express = require("express");
const router = express.Router();
const db = require("../models/user");

// 연간 계획 추가 API
router.post("/", (req, res) => {
  const { userId, month, title, description } = req.body;
  const sql =
    "INSERT INTO annual_plan (user_id, month, title, description) VALUES (?, ?, ?, ?)";
  db.run(sql, [userId, month, title, description], (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(200).json({ message: "Annual plan added successfully" });
    }
  });
});

// 연간 계획 조회 API
router.get("/", (req, res) => {
  const { userId } = req.query;
  const sql = "SELECT * FROM annual_plan WHERE user_id = ?";
  db.all(sql, [userId], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(200).json(rows);
    }
  });
});

// 연간 계획 수정 API
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { month, title, description } = req.body;
  const sql =
    "UPDATE annual_plan SET month = ?, title = ?, description = ? WHERE id = ?";
  db.run(sql, [month, title, description, id], (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(200).json({ message: "Annual plan updated successfully" });
    }
  });
});

// 연간 계획 삭제 API
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM annual_plan WHERE id = ?";
  db.run(sql, [id], (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(200).json({ message: "Annual plan deleted successfully" });
    }
  });
});

module.exports = router;
