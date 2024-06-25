const express = require("express");
const router = express.Router();
const db = require("../models/user");

// 스케줄 추가 API
router.post("/", (req, res) => {
  const { userId, title, description, date } = req.body;
  const sql =
    "INSERT INTO diary (user_id, title, description, date) VALUES (?, ?, ?, ?)";
  db.run(sql, [userId, title, description, date], (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(200).json({ message: "Schedule added successfully" });
    }
  });
});

// 스케줄 조회 API
router.get("/", (req, res) => {
  const { userId } = req.query;
  const sql = "SELECT * FROM diary WHERE user_id = ?";
  db.all(sql, [userId], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(200).json(rows);
    }
  });
});

// 스케줄 삭제 API
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM diary WHERE id = ?";
  db.run(sql, [id], (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(200).json({ message: "Schedule deleted successfully" });
    }
  });
});

// 스케줄 수정 API
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { title, description, date } = req.body;
  const sql =
    "UPDATE diary SET title = ?, description = ?, date = ? WHERE id = ?";
  db.run(sql, [title, description, date, id], (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(200).json({ message: "Schedule updated successfully" });
    }
  });
});

module.exports = router;
