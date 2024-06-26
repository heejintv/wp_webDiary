export function setupWeeklyPlan() {
  document.addEventListener("DOMContentLoaded", function () {
    const weeklyPlanContainer = document.getElementById(
      "weekly-plan-container"
    );
    const daysOfWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    daysOfWeek.forEach((day, index) => {
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
      const userId = localStorage.getItem("userId");

      const response = await fetch("http://localhost:3000/api/weekly_plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, day, title, description }),
      });

      if (response.ok) {
        console.log("Weekly plan added successfully!");
        weeklyPlanModal.style.display = "none";
        loadWeeklyPlans();
      } else {
        const errorData = await response.json();
        console.error(errorData.error);
        console.log("Failed to add weekly plan!");
        alert("Failed to add weekly plan!");
      }
    });

    async function loadWeeklyPlans() {
      const userId = localStorage.getItem("userId");
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
        dayDiv.innerHTML += `<p>${plan.title}: ${plan.description}
                  <button onclick="deleteWeeklyPlan(${plan.id})">Delete</button></p>`;
      });
    }

    function openWeeklyPlanModal(day) {
      const dayInput = document.getElementById("weekly-day");
      const titleInput = document.getElementById("weekly-title");
      const descriptionInput = document.getElementById("weekly-description");
      const submitButton = document.getElementById("weekly-plan-submit");

      if (dayInput && titleInput && descriptionInput && submitButton) {
        dayInput.value = day;
        titleInput.value = "";
        descriptionInput.value = "";
        submitButton.textContent = "Add Plan";

        weeklyPlanModal.style.display = "block";
      } else {
        console.error("Modal elements not found");
      }
    }

    window.deleteWeeklyPlan = async function (id) {
      const response = await fetch(
        `http://localhost:3000/api/weekly_plan/${id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        console.log("Weekly plan deleted successfully!");
        loadWeeklyPlans();
      } else {
        console.log("Failed to delete weekly plan!");
        alert("Failed to delete weekly plan!");
      }
    };

    loadWeeklyPlans();
  });
}

export function clearWeeklyPlans() {
  const weeklyPlanContainer = document.getElementById("weekly-plan-container");
  if (weeklyPlanContainer) {
    weeklyPlanContainer.innerHTML = "";
  }
}
