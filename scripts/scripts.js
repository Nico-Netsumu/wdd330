// script.js

// ====== 1. COPYRIGHT DATE ======
const footer = document.querySelector("footer");
const year = new Date().getFullYear();
footer.innerHTML += `<br><small>&copy; ${year}</small>`;

// ====== 2. FETCH A QUOTE FROM ZENQUOTES API ======
async function getMotivationalQuote() {
  try {
    const response = await fetch("https://zenquotes.io/api/random");
    const data = await response.json();
    document.getElementById("quote").textContent = `"${data[0].q}"`;
    document.getElementById("quote-author").textContent = `— ${data[0].a}`;
  } catch (error) {
    document.getElementById("quote").textContent = "Stay focused and keep going!";
    document.getElementById("quote-author").textContent = "";
  }
}
getMotivationalQuote();

// ====== 3. HANDLE SKILL FORM ======
const skillForm = document.getElementById("skill-form");
const skillNameInput = document.getElementById("skill-name");
const skillGoalsInput = document.getElementById("skill-goals");

skillForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const skillName = skillNameInput.value.trim();
  const goals = skillGoalsInput.value
    .split("\n")
    .map((goal) => goal.trim())
    .filter((goal) => goal !== "");

  if (!skillName || goals.length < 1) {
    alert("Please enter a skill and at least one micro-goal.");
    return;
  }

  const skillData = {
    name: skillName,
    goals,
    log: [],
    startDate: new Date().toISOString(),
  };

  localStorage.setItem("skillForge_currentSkill", JSON.stringify(skillData));
  displaySkill(skillData);
  skillForm.reset();
  document.getElementById("progress-section").classList.remove("hidden");
});

// ====== 4. DISPLAY CURRENT SKILL & GOALS ======
function displaySkill(skillData) {
  const title = document.getElementById("current-skill-title");
  const list = document.getElementById("goal-list");

  title.textContent = skillData.name;
  list.innerHTML = "";

  skillData.goals.forEach((goal) => {
    const li = document.createElement("li");
    li.textContent = goal;
    list.appendChild(li);
  });

  updateStreak(skillData);
}

// ====== 5. LOG PRACTICE & UPDATE STREAK ======
const logBtn = document.getElementById("log-practice");
logBtn.addEventListener("click", () => {
  const skillData = JSON.parse(localStorage.getItem("skillForge_currentSkill"));

  const today = new Date().toISOString().split("T")[0];
  if (!skillData.log.includes(today)) {
    skillData.log.push(today);
    localStorage.setItem("skillForge_currentSkill", JSON.stringify(skillData));
    updateStreak(skillData);
  } else {
    alert("You've already logged practice today!");
  }
});

function updateStreak(skillData) {
  const streakInfo = document.getElementById("streak-info");

  const logDates = skillData.log.map((date) => new Date(date));
  logDates.sort((a, b) => b - a); // newest first

  let streak = 0;
  let currentDate = new Date();

  for (let i = 0; i < logDates.length; i++) {
    const diff = (currentDate - logDates[i]) / (1000 * 60 * 60 * 24);
    if (diff <= 1) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }

  streakInfo.textContent = `🔥 Streak: ${streak} day(s) in a row`;
}

// ====== 6. LOAD DATA IF ALREADY STORED ======
window.addEventListener("DOMContentLoaded", () => {
  const saved = localStorage.getItem("skillForge_currentSkill");
  if (saved) {
    const skillData = JSON.parse(saved);
    displaySkill(skillData);
    document.getElementById("progress-section").classList.remove("hidden");
  }
});