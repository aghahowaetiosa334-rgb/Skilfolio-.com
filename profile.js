
"use strict";

// ========================================
// SKILLFOLIO — PROFILE PAGE
// ========================================

// 1. Sample posts shown until you create your own.

const samplePosts = [
  {
    id: "sample-1",
    title: "Creative Brand Identity",
    description: "Exploring typography, colour, and visual identity.",
    category: "Design",
    image:
      "https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=900&q=85"
  },
  {
    id: "sample-2",
    title: "My Creative Workspace",
    description: "A look at the tools and ideas behind my work.",
    category: "Behind the Scenes",
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=85"
  },
  {
    id: "sample-3",
    title: "Design Inspiration",
    description: "Collecting ideas for future projects.",
    category: "Inspiration",
    image:
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=900&q=85"
  }
];

// 2. Sample portfolio projects.

const profilePortfolio = [
  {
    id: "project-1",
    title: "Brand Identity System",
    description: "A complete visual identity concept for a modern brand.",
    category: "Completed Project",
    image:
      "https://images.unsplash.com/photo-1634942536790-2534b4c4b4e6?auto=format&fit=crop&w=900&q=85"
  },
  {
    id: "project-2",
    title: "Website Interface Design",
    description: "A clean interface concept focused on usability.",
    category: "Completed Project",
    image:
      "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?auto=format&fit=crop&w=900&q=85"
  },
  {
    id: "project-3",
    title: "Creative Poster Design",
    description: "An experimental visual composition using bold shapes.",
    category: "Completed Project",
    image:
      "https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&w=900&q=85"
  }
];

// 3. Find page elements.

const profileContent = document.querySelector("#profile-content");
const profileTabs = document.querySelectorAll(".profile-tab");
const profileEmptyState = document.querySelector("#profile-empty-state");
const profilePostCount = document.querySelector("#post-count");

const PROFILE_STORAGE_KEY = "skillfolioProfile";
const SIGNUP_STORAGE_KEY = "skillfolioSignupProfile";
const POSTS_STORAGE_KEY = "skillfolioPosts";

// 4. Safely read saved browser data.

function readSavedData(key) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : null;
  } catch (error) {
    console.error(`Could not read ${key}:`, error);
    return null;
  }
}

// 5. Load the user's saved profile.

function loadSavedProfile() {
  const profile =
    readSavedData(PROFILE_STORAGE_KEY) ||
    readSavedData(SIGNUP_STORAGE_KEY);

  if (!profile || typeof profile !== "object") {
    return;
  }

  const nameElement = document.querySelector("#creator-name");
  const usernameElement = document.querySelector(".creator-username");
  const bioElement = document.querySelector("#creator-bio");
  const avatarElement = document.querySelector(".creator-avatar");
  const skillsElement = document.querySelector("#profile-skills");

  if (nameElement && profile.fullName) {
    nameElement.textContent = profile.fullName;
  }

  if (usernameElement && profile.username) {
    usernameElement.textContent =
      "@" + String(profile.username).replace(/^@+/, "");
  }

  if (bioElement && typeof profile.bio === "string") {
    bioElement.textContent = profile.bio;
  }

  if (avatarElement && profile.profilePicture) {
    avatarElement.src = profile.profilePicture;
    avatarElement.alt = "Your profile picture";
  }

  if (skillsElement && typeof profile.skills === "string") {
    const skills = profile.skills
      .split(",")
      .map(skill => skill.trim())
      .filter(Boolean);

    skillsElement.replaceChildren();

    skills.forEach(skill => {
      const tag = document.createElement("span");
      tag.className = "profile-skill";
      tag.textContent = skill;
      skillsElement.appendChild(tag);
    });
  }
}

// 6. Load posts created using the Create Post page.

function getUserPosts() {
  const savedPosts = readSavedData(POSTS_STORAGE_KEY);

  if (!Array.isArray(savedPosts)) {
    return [];
  }

  return savedPosts
    .filter(post => post && typeof post === "object")
    .map((post, index) => {
      const caption =
        typeof post.caption === "string" ? post.caption.trim() : "";

      return {
        id: post.id ?? `user-post-${index}`,
        title: caption
          ? caption.slice(0, 65)
          : "My Skillfolio Post",
        description: caption,
        category:
          typeof post.category === "string" && post.category.trim()
            ? post.category
            : "My Work",
        mediaType: post.mediaType || "text",
        mediaData: post.mediaData || "",
        image: post.image || ""
      };
    })
    .reverse();
}

// 7. Safely escape text and HTML attributes.

function escapeProfileHTML(value) {
  return String(value).replace(/[&<>"']/g, character => {
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

// 8. Display the image or video attached to a post.

function createProfileMedia(item) {
  const media = item.mediaData || item.image || "";

  if (!media) {
    return "";
  }

  // Accept only supported image, video, or HTTPS media sources.
  const isImage =
    media.startsWith("data:image/") ||
    (media.startsWith("https://") &&
      item.mediaType !== "video");

  const isVideo =
    media.startsWith("data:video/") ||
    (media.startsWith("https://") &&
      item.mediaType === "video");

  if (isImage) {
    return `
      <div class="profile-work-image">
        <img
          src="${escapeProfileHTML(media)}"
          alt="${escapeProfileHTML(item.title)}"
          loading="lazy"
        >
      </div>
    `;
  }

  if (isVideo) {
    return `
      <div class="profile-work-image">
        <video controls preload="metadata">
          <source src="${escapeProfileHTML(media)}">
          Your browser does not support video playback.
        </video>
      </div>
    `;
  }

  return "";
}

// 9. Create a post or portfolio card.

function createProfileWorkCard(item) {
  return `
    <article class="profile-work-card">
      ${createProfileMedia(item)}

      <div class="profile-work-details">
        <span class="profile-work-label">
          ${escapeProfileHTML(item.category)}
        </span>

        <h3>${escapeProfileHTML(item.title)}</h3>

        <p>${escapeProfileHTML(item.description)}</p>
      </div>
    </article>
  `;
}

// 10. Display My Posts or Portfolio.

let activeProfileTab = "posts";

function renderProfileContent() {
  if (!profileContent) {
    return;
  }

  const userPosts = getUserPosts();

  // Show actual posts when available.
  // Otherwise, retain the sample posts for the demo.
  const postsToDisplay =
    userPosts.length > 0 ? userPosts : samplePosts;

  const items =
    activeProfileTab === "posts"
      ? postsToDisplay
      : profilePortfolio;

  profileContent.innerHTML = items
    .map(createProfileWorkCard)
    .join("");

  if (profileEmptyState) {
    profileEmptyState.hidden = items.length !== 0;
  }

  profileTabs.forEach(tab => {
    const isActive = tab.dataset.tab === activeProfileTab;

    tab.classList.toggle("active", isActive);
    tab.setAttribute("aria-selected", String(isActive));
    tab.tabIndex = isActive ? 0 : -1;
  });

  profileContent.setAttribute(
    "aria-labelledby",
    activeProfileTab === "posts"
      ? "posts-tab"
      : "portfolio-tab"
  );

  // Update the post count.
  if (profilePostCount) {
    profilePostCount.textContent = postsToDisplay.length;
  }
}

// 11. Switch between My Posts and Portfolio.

profileTabs.forEach(tab => {
  tab.addEventListener("click", () => {
    activeProfileTab = tab.dataset.tab;
    renderProfileContent();
  });
});

// 12. Load everything when the page opens.

loadSavedProfile();
renderProfileContent();

console.log("Skillfolio Profile page is ready!");
