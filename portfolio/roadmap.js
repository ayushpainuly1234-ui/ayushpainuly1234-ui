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
    progressLabel.textContent = `${done} of ${tasks.length} completed`;
    progressBar.style.width = `${tasks.length ? (done / tasks.length) * 100 : 0}%`;
    progressTrack.setAttribute("aria-valuemax", String(tasks.length));
    progressTrack.setAttribute("aria-valuenow", String(done));
    sections.forEach((section) => {
      const all = [...section.querySelectorAll("[data-task-id]")];
      const complete = all.filter((task) => task.checked).length;
      section.querySelector(".category-progress").textContent = `${complete}/${all.length}`;
    });
  }

  function applyFilters() {
    const query = (search.value || "").trim().toLowerCase();
    sections.forEach((section) => {
      const matchesGroup = activeFilter === "all" || section.dataset.group === activeFilter;
      let visible = 0;
      section.querySelectorAll(".roadmap-task").forEach((row) => {
        const matchesText = !query || row.dataset.search.includes(query);
        row.hidden = !(matchesGroup && matchesText);
        if (!row.hidden) visible++;
      });
      section.hidden = !matchesGroup || visible === 0;
    });
  }

  search.addEventListener("input", applyFilters);
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

  resetButton.addEventListener("click", () => {
    if (!window.confirm("Reset all saved DSA checklist progress in this browser?")) return;
    tasks.forEach((task) => { task.checked = false; });
    saved = {};
    try { localStorage.removeItem(storageKey); } catch { /* in-memory reset still applies */ }
    updateProgress();
  });

  updateProgress();
  applyFilters();
})();