export function setupWeeklyPlan() {
  document.addEventListener("DOMContentLoaded", function () {
    const weeklyPlanContainer = document.getElementById(
      "weekly-plan-container"
    );
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    days.forEach((day, index) => {
      const dayDiv = document.createElement("div");
      dayDiv.className = "day";
      dayDiv.innerHTML = `<h3>${day}</h3>`;
      dayDiv.addEventListener("click", () => openWeeklyPlanModal(index));
      weeklyPlanContainer.appendChild(dayDiv);
    });

    const weeklyPlanModal = document.getElementById("weekly-plan-modal");
    const closeWeeklyPlanModal = document.getElementById(
      "close-weekly-plan-modal"
    );
    closeWeeklyPlanModal.addEventListener("click", () => {
      weeklyPlanModal.style.display = "none";
    });

    const weeklyPlanForm = document.getElementById("weekly-plan-form");
    weeklyPlanForm.addEventListener("submit", async function (e) {
      e.preventDefault();
      const day = document.getElementById("weekly-day").value;
      const title = document.getElementById("weekly-title").value;
      const description = document.getElementById("weekly-description").value;
      const userId = localStorage.getItem("userId"); // 사용자 ID 가져오기

      console.log(
        `Adding weekly plan for day ${day} with title: ${title}, description: ${description}`
      );

      const response = await fetch("http://localhost:3000/api/weekly_plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, day, title, description }), // 사용자 ID 포함
      });
      if (response.ok) {
        console.log("Weekly plan added successfully!");
        weeklyPlanModal.style.display = "none";
        loadWeeklyPlans(); // 주간 계획을 다시 로드합니다.
      } else {
        console.log("Failed to add weekly plan!");
        alert("Failed to add weekly plan!");
      }
    });

    async function loadWeeklyPlans() {
      const userId = localStorage.getItem("userId"); // 사용자 ID 가져오기
      const response = await fetch(
        `http://localhost:3000/api/weekly_plan?userId=${userId}`
      );
      const plans = await response.json();
      const dayDivs = document.querySelectorAll(".day");
      dayDivs.forEach((div) => {
        div.innerHTML = `<h3>${div.querySelector("h3").textContent}</h3>`;
      });
      plans.forEach((plan) => {
        const dayDiv = dayDivs[plan.day];
        dayDiv.innerHTML += `<p>${plan.title}: ${plan.description}</p>`;
      });
    }

    function openWeeklyPlanModal(day) {
      const dayInput = document.getElementById("weekly-day");
      dayInput.value = day;
      weeklyPlanModal.style.display = "block";
    }

    // 페이지 로드 시 주간 계획을 로드합니다.
    loadWeeklyPlans();
  });
}
