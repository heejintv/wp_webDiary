const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// DB 경로 설정
const dbPath = path.resolve(__dirname, "../db/database.sqlite");
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  // 사용자 테이블 생성
  db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE,
        password TEXT,
        nickname TEXT
    )`);

  // 다이어리 테이블 생성
  db.run(`CREATE TABLE IF NOT EXISTS diary (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        title TEXT,
        description TEXT,
        date TEXT,
        FOREIGN KEY(user_id) REFERENCES users(id)
    )`);

  // 연간 계획 테이블 생성
  db.run(`CREATE TABLE IF NOT EXISTS annual_plan (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        month INTEGER,
        title TEXT,
        description TEXT
    )`);

  // 주간 계획 테이블 생성
  db.run(`CREATE TABLE IF NOT EXISTS weekly_plan (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        day INTEGER,
        title TEXT,
        description TEXT
    )`);
});

module.exports = db;
