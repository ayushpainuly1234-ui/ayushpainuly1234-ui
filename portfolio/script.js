(() => {
  const toggle = document.querySelector(".menu-toggle");
  const links = document.querySelector(".nav-links");
  const year = document.getElementById("year");

  if (year) year.textContent = new Date().getFullYear();

  // Load a small additive stylesheet without changing the existing page structure.
  const polish = document.createElement("link");
  polish.rel = "stylesheet";
  polish.href = "polish.css";
  document.head.appendChild(polish);

  if (toggle && links) {
    toggle.addEventListener("click", () => {
      const expanded = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!expanded));
      toggle.setAttribute("aria-label", expanded ? "Open navigation" : "Close navigation");
      links.classList.toggle("is-open", !expanded);
    });

    links.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        links.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Open navigation");
      });
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        links.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Open navigation");
      }
    });
  }

  // Keep the homepage focused on DSA and give every major topic a direct repository link.
  if (document.querySelector(".hero") && !document.querySelector(".dsa-highlight")) {
    const section = document.createElement("section");
    section.className = "dsa-highlight wrap";
    section.id = "dsa-focus";
    section.innerHTML = `
      <p class="eyebrow">CORE STRENGTH · JAVA PROBLEM SOLVING</p>
      <h2>Data Structures &amp; Algorithms <span class="gradient-text">first.</span></h2>
      <p class="dsa-lede">Explore the roadmap topic by topic, open the matching Java practice folders, and track your interview-preparation progress. The existing roadmap checklist and its problem links are preserved.</p>
      <div class="dsa-topic-grid">
        <a class="dsa-topic" href="https://github.com/ayushpainuly1234-ui/advanced-java-dsa/tree/main/graphs" target="_blank" rel="noreferrer"><strong>Graphs</strong><span>BFS · DFS · shortest paths ↗</span></a>
        <a class="dsa-topic" href="https://github.com/ayushpainuly1234-ui/advanced-java-dsa/tree/main/dp" target="_blank" rel="noreferrer"><strong>Dynamic Programming</strong><span>States · transitions · patterns ↗</span></a>
        <a class="dsa-topic" href="https://github.com/ayushpainuly1234-ui/advanced-java-dsa/tree/main/backtracking" target="_blank" rel="noreferrer"><strong>Backtracking</strong><span>Choices · recursion · pruning ↗</span></a>
        <a class="dsa-topic" href="https://github.com/ayushpainuly1234-ui/advanced-java-dsa/tree/main/trees" target="_blank" rel="noreferrer"><strong>Trees &amp; BST</strong><span>Traversal · structure · search ↗</span></a>
      </div>
      <div class="dsa-actions">
        <a class="button button-primary" href="roadmap.html">Open full DSA roadmap ↗</a>
        <a class="button button-secondary" href="https://github.com/ayushpainuly1234-ui/advanced-java-dsa" target="_blank" rel="noreferrer">All Java DSA files ↗</a>
        <a class="button button-secondary" href="https://leetcode.com/u/CodeForRadheKrishna/" target="_blank" rel="noreferrer">Original LeetCode profile ↗</a>
      </div>
      <div class="profile-links" aria-label="Developer profiles">
        <a href="https://github.com/ayushpainuly1234-ui" target="_blank" rel="noreferrer">GitHub ↗</a>
        <a href="https://leetcode.com/u/CodeForRadheKrishna/" target="_blank" rel="noreferrer">LeetCode ↗</a>
        <a href="https://github.com/ayushpainuly1234-ui/java-dsa-practice" target="_blank" rel="noreferrer">Java DSA Practice ↗</a>
      </div>`;
    const hero = document.querySelector(".hero");
    hero.insertAdjacentElement("afterend", section);
  }

  // Keep the listed programming languages aligned with the user's confirmed skills.
  document.querySelectorAll(".toolkit-card").forEach((card) => {
    const heading = card.querySelector("h3");
    const details = card.querySelector("p");
    if (heading && details && heading.textContent.trim() === "Languages") {
      details.textContent = "Java · C";
    }
  });
})();