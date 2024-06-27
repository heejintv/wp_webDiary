export function setupSchedule() {
  document.addEventListener("DOMContentLoaded", function () {
    const calendarEl = document.getElementById("calendar-container");
    window.calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: "dayGridMonth",
      events: [],
      dateClick: function (info) {
        const dateInput = document.getElementById("date");
        dateInput.value = info.dateStr;
        document.getElementById("add-schedule").style.display = "block";
      },
      eventClick: function (info) {
        editSchedule(
          info.event.id,
          info.event.title,
          info.event.extendedProps.description,
          info.event.startStr
        );
      },
      eventColor: "#378006",
      datesSet: function (info) {
        loadSchedules(info.start, info.end); // 새로운 날짜 범위에 대한 스케줄 로드
      },
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

        const response = await fetch(
          "https://port-0-wp-webdiary-1pgyr2mlvnorwju.sel5.cloudtype.app/api/diary",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId, title, description, date }),
          }
        );

        if (response.ok) {
          console.log("Schedule added successfully!");
          document.getElementById("add-schedule").style.display = "none";
          loadSchedules(calendar.view.activeStart, calendar.view.activeEnd); // 스케줄 목록 및 달력 갱신
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

        const response = await fetch(
          `https://port-0-wp-webdiary-1pgyr2mlvnorwju.sel5.cloudtype.app/api/diary/${id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ title, description, date }),
          }
        );

        if (response.ok) {
          console.log("Schedule updated successfully!");
          document.getElementById("edit-schedule").style.display = "none";
          loadSchedules(calendar.view.activeStart, calendar.view.activeEnd); // 스케줄 목록 및 달력 갱신
        } else {
          console.log("Failed to update schedule!");
          alert("Failed to update schedule!");
        }
      });
    }

    async function loadSchedules(startDate, endDate) {
      const userId = localStorage.getItem("userId");
      const response = await fetch(
        `https://port-0-wp-webdiary-1pgyr2mlvnorwju.sel5.cloudtype.app/api/diary?userId=${userId}`
      );
      const schedules = await response.json();
      const filteredSchedules = schedules.filter((schedule) => {
        const scheduleDate = new Date(schedule.date);
        return scheduleDate >= startDate && scheduleDate <= endDate;
      });
      filteredSchedules.sort((a, b) => new Date(a.date) - new Date(b.date)); // 날짜 순으로 정렬
      displaySchedules(filteredSchedules); // 필터된 스케줄 목록 표시
      calendar.removeAllEvents(); // 기존 이벤트 제거
      filteredSchedules.forEach((schedule) => {
        calendar.addEvent({
          id: schedule.id,
          title: schedule.title,
          start: schedule.date,
          description: schedule.description,
          color: "#378006",
        });
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
      fetch(
        `https://port-0-wp-webdiary-1pgyr2mlvnorwju.sel5.cloudtype.app/api/diary/${id}`,
        {
          method: "DELETE",
        }
      ).then((response) => {
        if (response.ok) {
          loadSchedules(calendar.view.activeStart, calendar.view.activeEnd); // 스케줄 목록 및 달력 갱신
        } else {
          alert("Failed to delete schedule!");
        }
      });
    };

    loadSchedules(calendar.view.activeStart, calendar.view.activeEnd); // 페이지 로드 시 스케줄 목록 및 달력 갱신
  });
}

export function clearSchedules() {
  const scheduleList = document.getElementById("schedule-list");
  if (scheduleList) {
    scheduleList.innerHTML = "";
  }
  calendar.removeAllEvents();
}
