(() => {
  const tasks = [...document.querySelectorAll("[data-task-id]")];
  const sections = [...document.querySelectorAll(".roadmap-category")];
  const search = document.getElementById("roadmap-search");
  const progressLabel = document.getElementById("roadmap-progress-label");
  const progressBar = document.getElementById("roadmap-progress-bar");
  const progressTrack = document.querySelector(".roadmap-progress-track");
  const resetButton = document.getElementById("reset-progress");
  const filterButtons = [...document.querySelectorAll(".roadmap-filter")];
  const storageKey = "ujjwal-dsa-roadmap-progress-v1";
  let activeFilter = "all";

  const polish = document.createElement("link");
  polish.rel = "stylesheet";
  polish.href = "roadmap-polish.css";
  document.head.appendChild(polish);

  // Add a direct profile link without disturbing any existing roadmap topics.
  const actions = document.querySelector(".roadmap-actions");
  if (actions && !actions.querySelector('[data-original-leetcode]')) {
    const profileLink = document.createElement("a");
    profileLink.className = "button button-secondary";
    profileLink.href = "https://leetcode.com/u/CodeForRadheKrishna/";
    profileLink.target = "_blank";
    profileLink.rel = "noreferrer";
    profileLink.dataset.originalLeetcode = "true";
    profileLink.textContent = "Original LeetCode profile ↗";
    actions.appendChild(profileLink);
  }

  let saved = {};
  try { saved = JSON.parse(localStorage.getItem(storageKey) || "{}"); } catch { saved = {}; }
  tasks.forEach((task) => {
    task.checked = Boolean(saved[task.dataset.taskId]);
    task.addEventListener("change", () => {
      saved[task.dataset.taskId] = task.checked;
      try { localStorage.setItem(storageKey, JSON.stringify(saved)); } catch { /* progress still works for this page */ }
      updateProgress();
    });
  });

  function updateProgress() {
    const done = tasks.filter((task) => task.checked).length;
    if (progressLabel) progressLabel.textContent = `${done} of ${tasks.length} completed`;
    if (progressBar) progressBar.style.width = `${tasks.length ? (done / tasks.length) * 100 : 0}%`;
    if (progressTrack) {
      progressTrack.setAttribute("aria-valuemax", String(tasks.length));
      progressTrack.setAttribute("aria-valuenow", String(done));
    }
    sections.forEach((section) => {
      const all = [...section.querySelectorAll("[data-task-id]")];
      const complete = all.filter((task) => task.checked).length;
      const label = section.querySelector(".category-progress");
      if (label) label.textContent = `${complete}/${all.length}`;
    });
  }

  function applyFilters() {
    const query = (search?.value || "").trim().toLowerCase();
    sections.forEach((section) => {
      const matchesGroup = activeFilter === "all" || section.dataset.group === activeFilter;
      let visible = 0;
      section.querySelectorAll(".roadmap-task").forEach((row) => {
        const haystack = (row.dataset.search || row.textContent || "").toLowerCase();
        const matchesText = !query || haystack.includes(query);
        row.hidden = !(matchesGroup && matchesText);
        if (!row.hidden) visible++;
      });
      section.hidden = !matchesGroup || visible === 0;
    });
  }

  if (search) search.addEventListener("input", applyFilters);
  filterButtons.forEach((button) => button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    filterButtons.forEach((other) => {
      const active = other === button;
      other.classList.toggle("is-active", active);
      other.setAttribute("aria-pressed", String(active));
    });
    applyFilters();
  }));
  filterButtons.forEach((button) => button.setAttribute("aria-pressed", String(button.classList.contains("is-active"))));

  if (resetButton) resetButton.addEventListener("click", () => {
    if (!window.confirm("Reset all saved DSA checklist progress in this browser?")) return;
    tasks.forEach((task) => { task.checked = false; });
    saved = {};
    try { localStorage.removeItem(storageKey); } catch { /* in-memory reset still applies */ }
    updateProgress();
  });

  updateProgress();
  applyFilters();
})();