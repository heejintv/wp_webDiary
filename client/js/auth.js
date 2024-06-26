import { clearSchedules } from "./schedule.js";
import { setupAnnualPlan, clearAnnualPlans } from "./annual_plan.js";
import { setupWeeklyPlan, clearWeeklyPlans } from "./weekly_plan.js";

export function setupAuth() {
  document.addEventListener("DOMContentLoaded", function () {
    const signupForm = document.getElementById("signup-form");
    if (signupForm) {
      signupForm.addEventListener("submit", async function (e) {
        e.preventDefault();
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const nickname = document.getElementById("nickname").value;

        console.log(
          `Signing up with email: ${email}, password: ${password}, nickname: ${nickname}`
        );

        const response = await fetch("http://localhost:3000/api/users/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password, nickname }),
        });

        if (response.ok) {
          console.log("Signup response: Success");
          window.location.href = "login.html";
        } else {
          console.log("Signup response: Failed");
          alert("Signup failed!");
        }
      });
    }

    const loginForm = document.getElementById("login-form");
    if (loginForm) {
      loginForm.addEventListener("submit", async function (e) {
        e.preventDefault();
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        console.log(`Logging in with email: ${email}, password: ${password}`);

        const response = await fetch("http://localhost:3000/api/users/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
          const data = await response.json();
          console.log("Login response: Success");
          localStorage.setItem("userId", data.userId); // 사용자 ID 저장
          localStorage.setItem("nickname", data.nickname); // 닉네임 저장
          window.location.href = "index.html";
        } else {
          console.log("Login response: Failed");
          alert("Login failed!");
        }
      });
    }

    function updateUI() {
      const nickname = localStorage.getItem("nickname");
      const nav = document.querySelector("nav");
      const userInfo = document.getElementById("user-info");
      const welcomeMessage = document.getElementById("welcome-message");
      const scheduleHeader = document.getElementById("schedule-header");
      const searchInput = document.getElementById("search-input");
      const loginPrompt = document.getElementById("login-prompt");
      const annualPlanSection = document.getElementById("annual-plan");
      const weeklyPlanSection = document.getElementById("weekly-plan");

      if (nickname) {
        welcomeMessage.textContent = `${nickname}님 환영합니다!`;

        if (nav) {
          nav.style.display = "none";
        }
        if (userInfo) {
          userInfo.style.display = "block";
        }
        if (scheduleHeader) {
          scheduleHeader.style.display = "block";
        }
        if (searchInput) {
          searchInput.style.display = "block";
        }
        if (loginPrompt) {
          loginPrompt.style.display = "none";
        }
        if (annualPlanSection) {
          annualPlanSection.style.display = "block";
        }
        if (weeklyPlanSection) {
          weeklyPlanSection.style.display = "block";
        }
      } else {
        if (nav) {
          nav.style.display = "flex";
        }
        if (userInfo) {
          userInfo.style.display = "none";
        }
        if (scheduleHeader) {
          scheduleHeader.style.display = "none";
        }
        if (searchInput) {
          searchInput.style.display = "none";
        }
        if (loginPrompt) {
          loginPrompt.style.display = "block";
        }
        if (annualPlanSection) {
          annualPlanSection.style.display = "none";
        }
        if (weeklyPlanSection) {
          weeklyPlanSection.style.display = "none";
        }
      }
    }

    updateUI();

    const logoutButton = document.getElementById("logout-button");
    if (logoutButton) {
      logoutButton.addEventListener("click", function () {
        console.log("Logging out");
        localStorage.removeItem("userId");
        localStorage.removeItem("nickname");
        clearSchedules(); // 스케줄 클리어
        clearAnnualPlans(); // 연간 계획 클리어
        clearWeeklyPlans(); // 주간 계획 클리어
        updateUI();
        window.location.href = "login.html"; // 로그아웃 후 로그인 페이지로 리디렉션
      });
    }
  });
}
