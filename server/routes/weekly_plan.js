const express = require("express");
const router = express.Router();
const db = require("../models/user");

// 주간 계획 추가 API
router.post("/", (req, res) => {
  const { userId, day, title, description } = req.body;
  const sql =
    "INSERT INTO weekly_plan (user_id, day, title, description) VALUES (?, ?, ?, ?)";
  db.run(sql, [userId, day, title, description], (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(200).json({ message: "Weekly plan added successfully" });
    }
  });
});

// 주간 계획 조회 API
router.get("/", (req, res) => {
  const { userId } = req.query;
  const sql = "SELECT * FROM weekly_plan WHERE user_id = ?";
  db.all(sql, [userId], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(200).json(rows);
    }
  });
});

// 주간 계획 수정 API
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { day, title, description } = req.body;
  const sql =
    "UPDATE weekly_plan SET day = ?, title = ?, description = ? WHERE id = ?";
  db.run(sql, [day, title, description, id], (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(200).json({ message: "Weekly plan updated successfully" });
    }
  });
});

// 주간 계획 삭제 API
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM weekly_plan WHERE id = ?";
  db.run(sql, [id], (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(200).json({ message: "Weekly plan deleted successfully" });
    }
  });
});

module.exports = router;
