const express = require("express");
const router = express.Router();
const db = require("../models/user");

// 회원가입 API
router.post("/signup", (req, res) => {
  const { email, password, nickname } = req.body;
  const sql = "INSERT INTO users (email, password, nickname) VALUES (?, ?, ?)";
  db.run(sql, [email, password, nickname], (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(200).json({ message: "User registered successfully" });
    }
  });
});

// 로그인 API
router.post("/login", (req, res) => {
  const { email, password } = req.body;
  const sql = "SELECT id, nickname FROM users WHERE email = ? AND password = ?";
  db.get(sql, [email, password], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (row) {
      res.status(200).json({ userId: row.id, nickname: row.nickname });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  });
});

module.exports = router;
