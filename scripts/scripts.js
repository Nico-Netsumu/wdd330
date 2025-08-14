// script.js

const skillPool = [
  "Learn Basic Cooking",
  "Start Drawing with Pencils",
  "Practice Public Speaking",
  "Learn HTML & CSS",
  "Try Digital Photography",
  "Write a Short Story",
  "Practice Meditation",
  "Learn a New Language Basics",
  "Try Calligraphy",
  "Do Basic Woodworking",
  "Learn Guitar Chords",
  "Start Gardening",
  "Practice Origami",
  "Learn Python Programming",
  "Create a Personal Budget",
  "Learn Basic Sewing",
  "Practice Yoga",
  "Learn Video Editing",
  "Build a Birdhouse",
  "Study World Geography"
];

function generateYearlySkills() {
  const shuffled = [...skillPool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 12);
}

function displayYearlyPlan() {
  const planContainer = document.getElementById("yearly-plan");
  planContainer.innerHTML = "";

  const skills = generateYearlySkills();
  skills.forEach((skill, index) => {
    const monthItem = document.createElement("li");
    monthItem.textContent = `Month ${index + 1}: ${skill}`;
    planContainer.appendChild(monthItem);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  displayYearlyPlan();
});

<section id="year-plan-section">
  <h2>12-Month Skill Plan</h2>
  <ul id="yearly-plan"></ul>
</section>

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

  // 🔗 Fetch both APIs when displaying skill
  getMotivationalQuote();
  getDevToArticles(skillData.name);
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
// ====== 7. FETCH RELATED ARTICLES FROM DEV.TO ======
async function getDevToArticles(skillName) {
  const articleList = document.getElementById("article-list");
  articleList.innerHTML = "<li>Loading articles...</li>";

  const tag = encodeURIComponent(skillName.toLowerCase());
  const url = `https://dev.to/api/articles?tag=${tag}&per_page=5`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch articles");

    const articles = await response.json();

    if (articles.length === 0) {
      articleList.innerHTML = `<li>No related articles found for "${skillName}".</li>`;
      return;
    }

    articleList.innerHTML = "";
    articles.forEach((article) => {
      const li = document.createElement("li");
      li.innerHTML = `<a href="${article.url}" target="_blank">${article.title}</a>`;
      articleList.appendChild(li);
    });

    document.getElementById("articles-section").classList.remove("hidden");

  } catch (error) {
    articleList.innerHTML = `<li>Unable to load articles.</li>`;
    console.error(error);
  }
}
