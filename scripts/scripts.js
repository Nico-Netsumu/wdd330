// script.js
document.addEventListener("DOMContentLoaded", () => {
  const skillForm = document.getElementById("skill-form");
  const skillNameInput = document.getElementById("skill-name");
  const skillGoalsInput = document.getElementById("skill-goals");
  const currentSkillTitle = document.getElementById("current-skill-title");
  const goalList = document.getElementById("goal-list");
  const logPracticeBtn = document.getElementById("log-practice");
  const streakInfo = document.getElementById("streak-info");
  const quoteEl = document.getElementById("quote");
  const quoteAuthorEl = document.getElementById("quote-author");
  const articleList = document.getElementById("article-list");

  const progressSection = document.getElementById("progress-section");
  const articlesSection = document.getElementById("articles-section");

  // 12 skill suggestions (one for each month)
  const defaultSkills = [
    "Learn Guitar Basics",
    "Practice Public Speaking",
    "Master Excel Shortcuts",
    "Start Yoga",
    "Cook 5 New Recipes",
    "Learn Photoshop Basics",
    "Improve Writing Skills",
    "Basic Spanish Phrases",
    "Meditation Practice",
    "Photography Essentials",
    "Learn HTML & CSS",
    "Gardening Skills"
  ];

  // === Local Storage Helpers ===
  function saveData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  function loadData(key) {
    return JSON.parse(localStorage.getItem(key));
  }

  // === Initialize App ===
  function init() {
    loadQuoteOfTheDay();
    loadCurrentSkill();
    suggestMonthlySkill();
  }

  // === Suggest a Skill Based on Month ===
  function suggestMonthlySkill() {
    const monthIndex = new Date().getMonth(); // 0-11
    const suggestion = defaultSkills[monthIndex];
    if (!loadData("currentSkill")) {
      skillNameInput.placeholder = `Try: ${suggestion}`;
    }
  }

  // === Load Current Skill ===
  function loadCurrentSkill() {
    const skillData = loadData("currentSkill");
    if (skillData) {
      currentSkillTitle.textContent = skillData.name;
      goalList.innerHTML = "";
      skillData.goals.forEach(goal => {
        const li = document.createElement("li");
        li.textContent = goal;
        goalList.appendChild(li);
      });
      progressSection.classList.remove("hidden");
      articlesSection.classList.remove("hidden");
      updateStreakInfo(skillData);
      loadArticles(skillData.name);
    }
  }

  // === Start New Skill ===
  skillForm.addEventListener("submit", e => {
    e.preventDefault();
    const skillName = skillNameInput.value.trim();
    const goals = skillGoalsInput.value.trim().split("\n").filter(Boolean);

    if (!skillName || goals.length === 0) {
      alert("Please enter a skill name and at least one goal.");
      return;
    }

    const skillData = {
      name: skillName,
      goals: goals,
      streak: 0,
      lastPractice: null
    };

    saveData("currentSkill", skillData);
    loadCurrentSkill();
    skillForm.reset();
  });

  // === Log Practice ===
  logPracticeBtn.addEventListener("click", () => {
    const skillData = loadData("currentSkill");
    const today = new Date().toDateString();

    if (skillData.lastPractice !== today) {
      skillData.streak++;
      skillData.lastPractice = today;
      saveData("currentSkill", skillData);
      updateStreakInfo(skillData);
    } else {
      alert("You already logged practice today!");
    }
  });

  // === Update Streak Info ===
  function updateStreakInfo(skillData) {
    streakInfo.textContent = `🔥 Streak: ${skillData.streak} days`;
  }

  // === Load Motivation Quote ===
  function loadQuoteOfTheDay() {
    fetch("https://api.quotable.io/random")
      .then(res => res.json())
      .then(data => {
        quoteEl.textContent = `"${data.content}"`;
        quoteAuthorEl.textContent = `– ${data.author}`;
      })
      .catch(() => {
        quoteEl.textContent = "Stay consistent, success will follow.";
        quoteAuthorEl.textContent = "– SkillForge";
      });
  }

  // === Load Related Articles ===
  function loadArticles(skill) {
    fetch(`https://dev.to/api/articles?tag=${encodeURIComponent(skill)}&per_page=3`)
      .then(res => res.json())
      .then(data => {
        articleList.innerHTML = "";
        data.forEach(article => {
          const li = document.createElement("li");
          const link = document.createElement("a");
          link.href = article.url;
          link.target = "_blank";
          link.textContent = article.title;
          li.appendChild(link);
          articleList.appendChild(li);
        });
      })
      .catch(() => {
        articleList.innerHTML = "<li>No related articles found.</li>";
      });
  }

  init();
});
