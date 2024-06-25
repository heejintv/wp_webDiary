const express = require("express");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const cors = require("cors");

const app = express();
const port = 3000;

// CORS 미들웨어 추가
app.use(cors());

// DB 경로 설정
const dbPath = path.resolve(__dirname, "db/database.sqlite");

// DB 연결
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Failed to connect to the database.", err);
  } else {
    console.log("Connected to the database.");
  }
});

// JSON 파싱 미들웨어
app.use(bodyParser.json());

// 정적 파일 제공
app.use(express.static(path.join(__dirname, "../client")));

// API 라우팅 설정
const userRoutes = require("./routes/user");
const diaryRoutes = require("./routes/diary");
const annualPlanRoutes = require("./routes/annual_plan");
const weeklyPlanRoutes = require("./routes/weekly_plan");

app.use("/api/users", userRoutes);
app.use("/api/diary", diaryRoutes);
app.use("/api/annual_plan", annualPlanRoutes);
app.use("/api/weekly_plan", weeklyPlanRoutes);

// 서버 실행
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
