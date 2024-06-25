export function setupSchedule() {
  document.addEventListener("DOMContentLoaded", function () {
    const calendarEl = document.getElementById("calendar-container");
    window.calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: "dayGridMonth",
      events: [], // 초기 이벤트 목록을 비워둡니다.
      dateClick: function (info) {
        const dateInput = document.getElementById("date");
        dateInput.value = info.dateStr;
        document.getElementById("add-schedule").style.display = "block";
      },
      eventColor: "#378006", // 스케줄 색상 설정
    });
    calendar.render();

    const scheduleForm = document.getElementById("schedule-form");
    if (scheduleForm) {
      scheduleForm.addEventListener("submit", async function (e) {
        e.preventDefault();
        const userId = localStorage.getItem("userId");
        const title = document.getElementById("title").value;
        const description = document.getElementById("description").value;
        const date = document.getElementById("date").value;

        console.log(
          `Adding schedule with title: ${title}, description: ${description}, date: ${date}`
        );

        const response = await fetch("http://localhost:3000/api/diary", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId, title, description, date }),
        });

        if (response.ok) {
          console.log("Schedule added successfully!");
          document.getElementById("add-schedule").style.display = "none";
          loadSchedules(); // 스케줄 목록 및 달력 갱신
        } else {
          console.log("Failed to add schedule!");
          alert("Failed to add schedule!");
        }
      });
    }

    const editScheduleForm = document.getElementById("edit-schedule-form");
    if (editScheduleForm) {
      editScheduleForm.addEventListener("submit", async function (e) {
        e.preventDefault();
        const id = document.getElementById("edit-id").value;
        const title = document.getElementById("edit-title").value;
        const description = document.getElementById("edit-description").value;
        const date = document.getElementById("edit-date").value;

        console.log(
          `Editing schedule with id: ${id}, title: ${title}, description: ${description}, date: ${date}`
        );

        const response = await fetch(`http://localhost:3000/api/diary/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ title, description, date }),
        });

        if (response.ok) {
          console.log("Schedule updated successfully!");
          document.getElementById("edit-schedule").style.display = "none";
          loadSchedules(); // 스케줄 목록 및 달력 갱신
        } else {
          console.log("Failed to update schedule!");
          alert("Failed to update schedule!");
        }
      });
    }

    async function loadSchedules() {
      const userId = localStorage.getItem("userId");
      const response = await fetch(
        `http://localhost:3000/api/diary?userId=${userId}`
      );
      const schedules = await response.json();
      displaySchedules(schedules); // 초기 스케줄 목록 표시
      calendar.removeAllEvents(); // 기존 이벤트 제거
      schedules.forEach((schedule) => {
        calendar.addEvent({
          id: schedule.id,
          title: schedule.title,
          start: schedule.date,
          description: schedule.description,
          color: "#378006", // 스케줄 색상 설정
        });
      });

      const searchInput = document.getElementById("search-input");
      searchInput.addEventListener("input", function () {
        const query = searchInput.value.toLowerCase();
        const filteredSchedules = schedules.filter(
          (schedule) =>
            schedule.title.toLowerCase().includes(query) ||
            schedule.date.includes(query)
        );
        displaySchedules(filteredSchedules);
      });
    }

    function displaySchedules(schedules) {
      const scheduleList = document.getElementById("schedule-list");
      scheduleList.innerHTML = "";
      schedules.forEach((schedule) => {
        const li = document.createElement("li");
        li.innerHTML = `
                  <span>${schedule.date}: ${schedule.title} - ${schedule.description}</span>
                  <div>
                      <button onclick="editSchedule(${schedule.id}, '${schedule.title}', '${schedule.description}', '${schedule.date}')">Edit</button>
                      <button onclick="deleteSchedule(${schedule.id})">Delete</button>
                  </div>
              `;
        if (document.body.classList.contains("dark-mode")) {
          li.classList.add("dark-mode");
        }
        scheduleList.appendChild(li);
      });
    }

    window.editSchedule = function (id, title, description, date) {
      document.getElementById("edit-id").value = id;
      document.getElementById("edit-title").value = title;
      document.getElementById("edit-description").value = description;
      document.getElementById("edit-date").value = date;
      document.getElementById("edit-schedule").style.display = "block";
    };

    window.deleteSchedule = function (id) {
      fetch(`http://localhost:3000/api/diary/${id}`, {
        method: "DELETE",
      }).then((response) => {
        if (response.ok) {
          loadSchedules(); // 스케줄 목록 및 달력 갱신
        } else {
          alert("Failed to delete schedule!");
        }
      });
    };

    loadSchedules(); // 페이지 로드 시 스케줄 목록 및 달력 갱신
  });
}

export function clearSchedules() {
  const scheduleList = document.getElementById("schedule-list");
  if (scheduleList) {
    scheduleList.innerHTML = "";
  }
  calendar.removeAllEvents();
}
