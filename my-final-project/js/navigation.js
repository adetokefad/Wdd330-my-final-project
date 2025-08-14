// Dark mode toggle functionality
const darkModeToggle = document.getElementById("dark-mode");
if (darkModeToggle) {
  darkModeToggle.addEventListener("change", () => {
    document.body.classList.toggle("dark-mode");

    // Save preference to localStorage
    if (document.body.classList.contains("dark-mode")) {
      localStorage.setItem("darkMode", "enabled");
    } else {
      localStorage.setItem("darkMode", "disabled");
    }
  });

  // Check for saved preference
  if (localStorage.getItem("darkMode") === "enabled") {
    document.body.classList.add("dark-mode");
    darkModeToggle.checked = true;
  }
}
