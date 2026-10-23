
/* ========================================
   SKILLFOLIO — EXPLORE PAGE
   ======================================== */

// 1. Sample projects to display on Explore.

const exploreProjects = [
  {
    id: 1,
    title: "Creative Brand Identity",
    description: "A modern visual identity concept for a creative brand.",
    category: "Design",
    creator: "Amara Okafor",
    image:
      "https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=900&q=85",
    likes: 124
  },
  {
    id: 2,
    title: "Personal Portfolio Website",
    description: "A clean, responsive portfolio made for a developer.",
    category: "Development",
    creator: "Daniel Mensah",
    image:
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=900&q=85",
    likes: 98
  },
  {
    id: 3,
    title: "Golden Hour Photography",
    description: "A photography study focused on light and composition.",
    category: "Photography",
    creator: "Zara Williams",
    image:
      "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?auto=format&fit=crop&w=900&q=85",
    likes: 216
  },
  {
    id: 4,
    title: "Streetwear Collection",
    description: "An experimental streetwear concept with bold details.",
    category: "Fashion",
    creator: "Michael Adeyemi",
    image:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=85",
    likes: 173
  },
  {
    id: 5,
    title: "Digital Art Experiments",
    description: "Exploring colour, shapes, and digital illustration.",
    category: "Design",
    creator: "Amara Okafor",
    image:
      "https://images.unsplash.com/photo-1541961017774-22349e4a1262?auto=format&fit=crop&w=900&q=85",
    likes: 87
  },
  {
    id: 6,
    title: "Music Production Session",
    description: "A behind-the-scenes look at a music production setup.",
    category: "Music",
    creator: "Jay Carter",
    image:
      "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=900&q=85",
    likes: 145
  },
  {
    id: 7,
    title: "Minimal Web Interface",
    description: "A dark interface concept with a simple user experience.",
    category: "Development",
    creator: "Daniel Mensah",
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=85",
    likes: 109
  },
  {
    id: 8,
    title: "Modern Fashion Editorial",
    description: "A fashion editorial exploring contemporary style.",
    category: "Fashion",
    creator: "Michael Adeyemi",
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=85",
    likes: 192
  },
  {
    id: 9,
    title: "Portrait Photography",
    description: "A portrait project focused on expression and storytelling.",
    category: "Photography",
    creator: "Zara Williams",
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=900&q=85",
    likes: 156
  }
];

// 2. Find the HTML elements we need.

const projectGrid = document.querySelector("#explore-project-grid");
const searchForm = document.querySelector("#explore-search-form");
const searchInput = document.querySelector("#explore-search-input");
const categoryButtons = document.querySelectorAll(".explore-category");
const resultsCount = document.querySelector("#explore-results-count");
const emptyState = document.querySelector("#explore-empty-state");

// 3. Keep track of the current filter and liked projects.

let selectedExploreCategory = "All";
const likedProjects = new Set();

// 4. Create a safe HTML representation of text.

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    };

    return entities[character];
  });
}

// 5. Build one project card.

function createExploreCard(project) {
  const creatorInitials = project.creator
    .split(" ")
    .map((name) => name[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const isLiked = likedProjects.has(project.id);
  const displayedLikes =
    project.likes + (isLiked ? 1 : 0);

  return `
    <article class="explore-project-card">

      <div class="explore-project-image">
        <img
          src="${project.image}"
          alt="${escapeHTML(project.title)}"
          loading="lazy"
        >

        <span class="explore-project-category">
          ${escapeHTML(project.category)}
        </span>
      </div>

      <div class="explore-project-info">

        <h3>${escapeHTML(project.title)}</h3>

        <p class="explore-project-description">
          ${escapeHTML(project.description)}
        </p>

        <div class="explore-project-meta">

          <div class="explore-creator">
            <span class="explore-creator-avatar"
                  aria-hidden="true">
              ${escapeHTML(creatorInitials)}
            </span>

            <span class="explore-creator-name">
              ${escapeHTML(project.creator)}
            </span>
          </div>

          <button
            class="explore-like-button ${isLiked ? "liked" : ""}"
            type="button"
            data-like-id="${project.id}"
            aria-pressed="${isLiked}"
            aria-label="${isLiked ? "Unlike" : "Like"} ${escapeHTML(project.title)}"
          >
            ${isLiked ? "♥" : "♡"} ${displayedLikes}
          </button>

        </div>
      </div>
    </article>
  `;
}

// 6. Filter and display projects.

function renderExploreProjects() {
  const searchTerm = searchInput.value
    .trim()
    .toLowerCase();

  const filteredProjects = exploreProjects.filter((project) => {
    const matchesCategory =
      selectedExploreCategory === "All" ||
      project.category === selectedExploreCategory;

    const searchableText = [
      project.title,
      project.description,
      project.category,
      project.creator
    ]
      .join(" ")
      .toLowerCase();

    const matchesSearch = searchableText.includes(searchTerm);

    return matchesCategory && matchesSearch;
  });

  projectGrid.innerHTML = filteredProjects
    .map(createExploreCard)
    .join("");

  resultsCount.textContent =
    `${filteredProjects.length} ${
      filteredProjects.length === 1 ? "project" : "projects"
    }`;

  emptyState.hidden = filteredProjects.length !== 0;
}

// 7. Make category buttons work.

categoryButtons.forEach((button) => {
  button.addEventListener("click", () => {
    selectedExploreCategory = button.dataset.category;

    categoryButtons.forEach((categoryButton) => {
      const isSelected =
        categoryButton === button;

      categoryButton.classList.toggle("active", isSelected);
      categoryButton.setAttribute(
        "aria-pressed",
        String(isSelected)
      );
    });

    renderExploreProjects();
  });
});

// 8. Make the search form work.

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  renderExploreProjects();
});

searchInput.addEventListener("input", () => {
  renderExploreProjects();
});

// 9. Handle likes without losing state when cards rerender.

projectGrid.addEventListener("click", (event) => {
  const likeButton = event.target.closest("[data-like-id]");

  if (!likeButton) {
    return;
  }

  const projectId = Number(likeButton.dataset.likeId);

  if (likedProjects.has(projectId)) {
    likedProjects.delete(projectId);
  } else {
    likedProjects.add(projectId);
  }

  renderExploreProjects();
});

// 10. Display the initial projects.

renderExploreProjects();

console.log("Skillfolio Explore page is ready!");
