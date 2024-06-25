import { clearSchedules } from "./schedule.js";
import { setupAnnualPlan } from "./annual_plan.js";
import { setupWeeklyPlan } from "./weekly_plan.js";

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

        // 사용자별 연간 계획과 주간 계획 로드
        setupAnnualPlan();
        setupWeeklyPlan();
      } else {
        if (nav) {
          nav.style.display = "block";
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

        // 연간 계획과 주간 계획 클리어
        clearAnnualPlans();
        clearWeeklyPlans();
      }
    }

    function logout() {
      localStorage.removeItem("userId");
      localStorage.removeItem("nickname");
      clearSchedules();
      updateUI();
      window.location.href = "login.html";
    }

    const logoutButton = document.getElementById("logout-button");
    if (logoutButton) {
      logoutButton.addEventListener("click", logout);
    }

    updateUI();
  });
}
