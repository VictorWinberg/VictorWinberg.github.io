(function () {
  const GITHUB_USER = "VictorWinberg";
  const DATA_URL = "../data/projects.json";
  const DESCRIPTION_LIMIT = 120;
  const CATEGORY_ORDER = ["web-apps", "games", "competitions", "tools", "experiments"];
  const CATEGORY_LABELS = {
    "web-apps": "Web apps",
    games: "Games",
    competitions: "Competitions",
    tools: "Tools",
    experiments: "Experiments",
  };

  const container = document.getElementById("projects-list");
  const statusEl = document.getElementById("projects-status");

  if (!container) return;

  function setStatus(message) {
    if (!statusEl) return;
    statusEl.textContent = message;
    statusEl.hidden = !message;
  }

  function truncateDescription(text) {
    const clean = text.trim();
    if (!clean) return "No description provided.";
    if (clean.length <= DESCRIPTION_LIMIT) return clean;
    return `${clean.slice(0, DESCRIPTION_LIMIT).trimEnd()}…`;
  }

  async function fetchGithubUpdatedAt() {
    const updatedByName = new Map();
    let page = 1;

    while (true) {
      const res = await fetch(
        `https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&page=${page}&sort=updated&type=owner`
      );
      if (!res.ok) return updatedByName;

      const batch = await res.json();
      if (!Array.isArray(batch) || batch.length === 0) break;

      for (const repo of batch) {
        updatedByName.set(repo.name.toLowerCase(), repo.updated_at);
      }

      if (batch.length < 100) break;
      page += 1;
    }

    return updatedByName;
  }

  async function loadProjects() {
    const res = await fetch(DATA_URL);
    if (!res.ok) {
      throw new Error("Could not load projects data.");
    }

    const projects = await res.json();
    if (!Array.isArray(projects)) {
      throw new Error("Projects data must be an array.");
    }

    const updatedByName = await fetchGithubUpdatedAt();

    return projects
      .filter((project) => !project.hide)
      .map((project) => ({
        name: project.name,
        description: project.description || "",
        url: project.url || "",
        repo: project.repo || "",
        language: project.language || "",
        category: project.category || "",
        updated_at: updatedByName.get(project.name.toLowerCase()) || "",
      }))
      .sort((a, b) => Date.parse(b.updated_at) - Date.parse(a.updated_at));
  }

  function groupProjectsByCategory(projects) {
    const grouped = new Map();

    for (const project of projects) {
      const category = project.category || "other";
      if (!grouped.has(category)) {
        grouped.set(category, []);
      }
      grouped.get(category).push(project);
    }

    const orderedCategories = [
      ...CATEGORY_ORDER.filter((category) => grouped.has(category)),
      ...[...grouped.keys()].filter((category) => !CATEGORY_ORDER.includes(category)).sort(),
    ];

    return orderedCategories.map((category) => ({
      category,
      label: CATEGORY_LABELS[category] || category,
      projects: grouped.get(category),
    }));
  }

  function createIconLink(href, iconSrc, label) {
    const link = document.createElement("a");
    link.href = href;
    link.className = "project-card__link";
    link.rel = "noopener noreferrer";
    link.target = "_blank";
    link.setAttribute("aria-label", label);

    const icon = document.createElement("img");
    icon.src = iconSrc;
    icon.alt = "";
    icon.className = "project-card__link-icon";
    icon.setAttribute("aria-hidden", "true");
    link.appendChild(icon);

    return link;
  }

  function createProjectCard(project) {
    const card = document.createElement("article");
    card.className = "project-card";

    const header = document.createElement("div");
    header.className = "project-card__header";

    const title = document.createElement("h3");
    title.className = "project-card__title";
    title.textContent = project.name;
    header.appendChild(title);

    if (project.url || project.repo) {
      const links = document.createElement("div");
      links.className = "project-card__links";

      if (project.url) {
        links.appendChild(createIconLink(project.url, "../img/icons/www.svg", "View site"));
      }

      if (project.repo) {
        links.appendChild(createIconLink(project.repo, "../img/icons/github.svg", "View repo"));
      }

      header.appendChild(links);
    }

    card.appendChild(header);

    if (project.language) {
      const meta = document.createElement("p");
      meta.className = "project-card__meta";
      meta.textContent = project.language;
      card.appendChild(meta);
    }

    const description = document.createElement("p");
    description.className = "project-card__description";
    description.textContent = truncateDescription(project.description);
    card.appendChild(description);

    return card;
  }

  function renderProjects(projects) {
    container.replaceChildren();

    if (!projects.length) {
      const empty = document.createElement("p");
      empty.className = "projects-empty";
      empty.textContent = "No projects to show.";
      container.appendChild(empty);
      return;
    }

    for (const group of groupProjectsByCategory(projects)) {
      const section = document.createElement("section");
      section.className = "projects-section";

      const heading = document.createElement("h2");
      heading.className = "projects-section__title";
      heading.textContent = group.label;
      section.appendChild(heading);

      const grid = document.createElement("div");
      grid.className = "projects-grid";

      for (const project of group.projects) {
        grid.appendChild(createProjectCard(project));
      }

      section.appendChild(grid);
      container.appendChild(section);
    }
  }

  async function init() {
    setStatus("Loading projects…");

    try {
      const projects = await loadProjects();
      setStatus("");
      renderProjects(projects);
    } catch (error) {
      setStatus(error.message || "Failed to load projects.");
      container.replaceChildren();
      const errorMessage = document.createElement("p");
      errorMessage.className = "projects-empty";
      errorMessage.textContent = "Projects data could not be loaded.";
      container.appendChild(errorMessage);
    }
  }

  init();
})();
