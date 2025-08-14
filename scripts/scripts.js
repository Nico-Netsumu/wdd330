/* script.js */
/* © SkillForge - 2025 */

// -------------------- Variables --------------------
const skillForm = document.getElementById("skill-form");
const skillNameInput = document.getElementById("skill-name");
const skillGoalsInput = document.getElementById("skill-goals");
const currentSkillTitle = document.getElementById("current-skill-title");
const goalList = document.getElementById("goal-list");
const progressSection = document.getElementById("progress-section");
const logPracticeBtn = document.getElementById("log-practice");
const streakInfo = document.getElementById("streak-info");
const quoteEl = document.getElementById("quote");
const quoteAuthorEl = document.getElementById("quote-author");
const articleSection = document.getElementById("articles-section");
const articleList = document.getElementById("article-list");
const monthlySkillsList = document.getElementById("monthly-skills-list");
const yearEl = document.getElementById("year");

// -------------------- Data --------------------
const skillPool = [
  "Learn Guitar",
  "Master Excel",
  "Photography Basics",
  "Intro to Coding",
  "Cooking International Dishes",
  "Speed Reading",
  "Public Speaking",
  "Meditation & Mindfulness",
  "Drawing & Sketching",
  "Basic Car Maintenance",
  "Yoga",
  "Creative Writing",
  "First Aid",
  "Sign Language",
  "Salsa Dancing",
  "Gardening",
  "3D Printing",
  "Podcasting",
  "Video Editing",
  "Chess Strategy"
];

// -------------------- Init --------------------
document.addEventListener("DOMContentLoaded", () => {
  yearEl.textContent = new Date().getFullYear();
  generateMonthlySkills();
  fetchMotivation();
});

// -------------------- Generate 12 Random Skills --------------------
function generateMonthlySkills() {
  const shuffled = skillPool.sort(() => 0.5 - Math.random());
  const chosen = shuffled.slice(0, 12);
  monthlySkillsList.innerHTML = "";
  chosen.forEach((skill, i) => {
    const li = document.createElement("li");
    li.textContent = `Month ${i + 1}: ${skill}`;
    monthlySkillsList.appendChild(li);
  });
}

// -------------------- Form Submit --------------------
skillForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const skillName = skillNameInput.value.trim();
  const goals = skillGoalsInput.value.trim().split("\n");

  if (!skillName || goals.length === 0) return;

  currentSkillTitle.textContent = skillName;
  goalList.innerHTML = "";
  goals.forEach((g) => {
    const li = document.createElement("li");
    li.textContent = g;
    goalList.appendChild(li);
  });

  progressSection.classList.remove("hidden");
  skillForm.reset();
  fetchArticles(skillName);
});

// -------------------- Practice Tracker --------------------
let streak = 0;
logPracticeBtn.addEventListener("click", () => {
  streak++;
  streakInfo.textContent = `🔥 Streak: ${streak} day(s) in a row`;
});

// -------------------- Fetch Motivation Quote --------------------
function fetchMotivation() {
  fetch("https://type.fit/api/quotes")
    .then((res) => res.json())
    .then((data) => {
      const randomQuote = data[Math.floor(Math.random() * data.length)];
      quoteEl.textContent = randomQuote.text;
      quoteAuthorEl.textContent = randomQuote.author || "Unknown";
    })
    .catch(() => {
      quoteEl.textContent = "Keep pushing, your future self will thank you.";
      quoteAuthorEl.textContent = "SkillForge";
    });
}

// -------------------- Fetch Related Articles --------------------
function fetchArticles(skill) {
  fetch(`https://dev.to/api/articles?tag=${encodeURIComponent(skill)}`)
    .then((res) => res.json())
    .then((data) => {
      articleList.innerHTML = "";
      if (data.length > 0) {
        articleSection.classList.remove("hidden");
        data.slice(0, 5).forEach((article) => {
          const li = document.createElement("li");
          li.innerHTML = `<a href="${article.url}" target="_blank">${article.title}</a>`;
          articleList.appendChild(li);
        });
      } else {
        articleSection.classList.add("hidden");
      }
    })
    .catch(() => {
      articleSection.classList.add("hidden");
    });
}