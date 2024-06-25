export function setupAnnualPlan() {
  document.addEventListener("DOMContentLoaded", function () {
    const annualPlanContainer = document.getElementById(
      "annual-plan-container"
    );
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    months.forEach((month, index) => {
      const monthDiv = document.createElement("div");
      monthDiv.className = "month";
      monthDiv.innerHTML = `<h3>${month}</h3>`;
      monthDiv.addEventListener("click", () => openAnnualPlanModal(index));
      annualPlanContainer.appendChild(monthDiv);
    });

    const annualPlanModal = document.getElementById("annual-plan-modal");
    const closeAnnualPlanModal = document.getElementById(
      "close-annual-plan-modal"
    );
    closeAnnualPlanModal.addEventListener("click", () => {
      annualPlanModal.style.display = "none";
    });

    const annualPlanForm = document.getElementById("annual-plan-form");
    annualPlanForm.addEventListener("submit", async function (e) {
      e.preventDefault();
      const month = document.getElementById("annual-month").value;
      const title = document.getElementById("annual-title").value;
      const description = document.getElementById("annual-description").value;
      const userId = localStorage.getItem("userId");

      console.log(
        `Adding annual plan for month ${month} with title: ${title}, description: ${description}`
      );

      const response = await fetch("http://localhost:3000/api/annual_plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, month, title, description }),
      });
      if (response.ok) {
        console.log("Annual plan added successfully!");
        annualPlanModal.style.display = "none";
        loadAnnualPlans();
      } else {
        const errorData = await response.json();
        console.error(errorData.error); // 오류 메시지 로그에 출력
        console.log("Failed to add annual plan!");
        alert("Failed to add annual plan!");
      }
    });

    async function loadAnnualPlans() {
      const userId = localStorage.getItem("userId");
      const response = await fetch(
        `http://localhost:3000/api/annual_plan?userId=${userId}`
      );
      const plans = await response.json();
      const monthDivs = document.querySelectorAll(".month");
      monthDivs.forEach((div) => {
        div.innerHTML = `<h3>${div.querySelector("h3").textContent}</h3>`;
      });
      plans.forEach((plan) => {
        const monthDiv = monthDivs[plan.month];
        monthDiv.innerHTML += `<p>${plan.title}: ${plan.description}</p>`;
      });
    }

    function openAnnualPlanModal(month) {
      const monthInput = document.getElementById("annual-month");
      monthInput.value = month;
      annualPlanModal.style.display = "block";
    }

    loadAnnualPlans();
  });
}
