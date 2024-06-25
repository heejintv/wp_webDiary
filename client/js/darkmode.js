export function setupDarkMode() {
  document.addEventListener("DOMContentLoaded", function () {
    function toggleDarkMode() {
      document.body.classList.toggle("dark-mode");
      const isDarkMode = document.body.classList.contains("dark-mode");
      localStorage.setItem("darkMode", isDarkMode);
      updateDarkModeElements(isDarkMode);
    }

    function updateDarkModeElements(isDarkMode) {
      const darkModeElements = document.querySelectorAll(
        "#logout-button, nav a, form, #schedule-list li, #search-input, .month, .day"
      );
      darkModeElements.forEach((element) => {
        if (isDarkMode) {
          element.classList.add("dark-mode");
        } else {
          element.classList.remove("dark-mode");
        }
      });
    }

    const darkModeToggle = document.getElementById("dark-mode-toggle");
    const darkModeToggleLoggedIn = document.getElementById(
      "dark-mode-toggle-logged-in"
    );

    if (darkModeToggle) {
      darkModeToggle.addEventListener("click", toggleDarkMode);
    }
    if (darkModeToggleLoggedIn) {
      darkModeToggleLoggedIn.addEventListener("click", toggleDarkMode);
    }

    const darkModeSetting = localStorage.getItem("darkMode") === "true";
    if (darkModeSetting) {
      document.body.classList.add("dark-mode");
      updateDarkModeElements(true);
    }
  });
}
