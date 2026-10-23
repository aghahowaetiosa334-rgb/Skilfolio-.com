
/* ========================================
   SKILLFOLIO — SAMPLE CONTENT
======================================== */

const samplePosts = [
  {
    id: "sample-1",
    creator: "Amara Okafor",
    username: "@amara.designs",
    initial: "A",
    avatar: "avatar-purple",
    skill: "Design",
    title: "Exploring bold visual identities",
    caption:
      "Experimenting with colour, typography, and layouts to create memorable brands. What do you think of this direction?",
    image:
      "https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=900&q=80",
    likes: 128,
    comments: 14,
    isSample: true
  },
  {
    id: "sample-2",
    creator: "Daniel Mensah",
    username: "@daniel.builds",
    initial: "D",
    avatar: "avatar-blue",
    skill: "Development",
    title: "Building my next web project",
    caption:
      "Every project teaches me something new. This week I'm focusing on cleaner layouts and better user experiences.",
    image:
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=900&q=80",
    likes: 96,
    comments: 8,
    isSample: true
  },
  {
    id: "sample-3",
    creator: "Zara Williams",
    username: "@zara.creates",
    initial: "Z",
    avatar: "avatar-pink",
    skill: "Photography",
    title: "Finding beauty in everyday moments",
    caption:
      "Photography reminds me to slow down and notice the little details. Sharing a few creative experiments from this week.",
    image:
      "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?auto=format&fit=crop&w=900&q=80",
    likes: 214,
    comments: 21,
    isSample: true
  },
  {
    id: "sample-4",
    creator: "Michael Adeyemi",
    username: "@mike.studio",
    initial: "M",
    avatar: "avatar-orange",
    skill: "Fashion",
    title: "Ideas turning into designs",
    caption:
      "Working on new concepts and learning how to turn a rough sketch into something with its own identity.",
    image:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80",
    likes: 173,
    comments: 17,
    isSample: true
  }
];

const creators = [
  {
    name: "Amara Okafor",
    username: "@amara.designs",
    initial: "A",
    avatar: "avatar-purple",
    skill: "Graphic designer"
  },
  {
    name: "Daniel Mensah",
    username: "@daniel.builds",
    initial: "D",
    avatar: "avatar-blue",
    skill: "Web developer"
  },
  {
    name: "Zara Williams",
    username: "@zara.creates",
    initial: "Z",
    avatar: "avatar-pink",
    skill: "Photographer"
  }
];

/* ========================================
   SELECT HTML ELEMENTS
======================================== */

const feedGrid = document.querySelector("#feed-grid");
const creatorsList = document.querySelector("#suggested-creators");
const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");
const emptyState = document.querySelector("#empty-state");

let selectedCategory = "All";

/* ========================================
   SAFELY DISPLAY USER TEXT
======================================== */

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => {
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

/* ========================================
   LOAD POSTS CREATED BY THE USER
======================================== */

function getSavedPosts() {
  try {
    const savedData = localStorage.getItem("skillfolioPosts");
    const parsedData = savedData ? JSON.parse(savedData) : [];

    if (!Array.isArray(parsedData)) {
      return [];
    }

    let profile = {};
    let signupProfile = {};

    try {
      profile = JSON.parse(
        localStorage.getItem("skillfolioProfile") || "{}"
      );
    } catch {
      profile = {};
    }

    try {
      signupProfile = JSON.parse(
        localStorage.getItem("skillfolioSignupProfile") || "{}"
      );
    } catch {
      signupProfile = {};
    }

    const fullName =
      profile.fullName ||
      signupProfile.fullName ||
      "Skillfolio Creator";

    const rawUsername =
      profile.username ||
      signupProfile.username ||
      "creator";

    const username = rawUsername.startsWith("@")
      ? rawUsername
      : `@${rawUsername}`;

    return parsedData.map((post, index) => {
      const category = post.category || "Other";
      const caption = post.caption || "";

      return {
        id: `user-${post.id ?? index}`,
        creator: fullName,
        username: username,
        initial: fullName.charAt(0).toUpperCase() || "Y",
        avatar: "avatar-purple",
        skill: category,
        title: caption.trim()
          ? caption.trim().slice(0, 70)
          : "A new Skillfolio post",
        caption: caption,
        mediaType: post.mediaType || "text",
        mediaData: post.mediaData || "",
        likes: Number(post.likes) || 0,
        comments: Number(post.comments) || 0,
        createdAt: post.createdAt || "",
        isSample: false
      };
    });
  } catch (error) {
    console.error("Could not load saved Skillfolio posts:", error);
    return [];
  }
}

/* ========================================
   GET ALL POSTS
   New posts appear before sample posts.
======================================== */

function getAllPosts() {
  return [...getSavedPosts().reverse(), ...samplePosts];
}

/* ========================================
   CREATE POST MEDIA
======================================== */

function createPostMedia(post) {
  if (post.isSample) {
    return `
      <img
        src="${escapeHTML(post.image)}"
        alt="${escapeHTML(post.title)}"
        loading="lazy"
      >
    `;
  }

  const mediaData = post.mediaData || "";

  if (post.mediaType === "image" && mediaData.startsWith("data:image/")) {
    return `
      <img
        src="${escapeHTML(mediaData)}"
        alt="${escapeHTML(post.title)}"
        loading="lazy"
      >
    `;
  }

  if (post.mediaType === "video" && mediaData.startsWith("data:video/")) {
    return `
      <video controls preload="metadata">
        <source src="${escapeHTML(mediaData)}">
        Your browser does not support video playback.
      </video>
    `;
  }

  return `
    <div class="text-post-preview">
      <span>SKILLFOLIO POST</span>
      <p>${escapeHTML(post.caption || "Sharing something new.")}</p>
    </div>
  `;
}

/* ========================================
   CREATE A POST CARD
======================================== */

function createPostCard(post) {
  const article = document.createElement("article");

  article.className = "post-card";
  article.dataset.category = post.skill;

  const creatorLabel = post.isSample
    ? "Sample creator"
    : "Creator";

  article.innerHTML = `
    <div class="post-image">
      ${createPostMedia(post)}
      <span class="post-category">${escapeHTML(post.skill)}</span>
    </div>

    <div class="post-body">
      <div class="post-author">
        <div class="avatar ${escapeHTML(post.avatar)}">
          ${escapeHTML(post.initial)}
        </div>

        <div class="author-info">
          <strong>${escapeHTML(post.creator)}</strong>
          <span>${escapeHTML(post.username)} · ${creatorLabel}</span>
        </div>
      </div>

      <h3 class="post-title">${escapeHTML(post.title)}</h3>
      <p class="post-caption">${escapeHTML(post.caption)}</p>

      <div class="post-actions">
        <button
          class="post-action like-action"
          type="button"
          aria-label="Like post"
          aria-pressed="false"
        >
          ♡ <span>${post.likes}</span>
        </button>

        <button
          class="post-action comment-action"
          type="button"
          aria-label="View comments"
        >
          ◯ <span>${post.comments}</span>
        </button>

        <button
          class="post-action save-action"
          type="button"
          aria-label="Save post"
          aria-pressed="false"
        >
          ♧
        </button>
      </div>
    </div>
  `;

  return article;
}

/* ========================================
   DISPLAY POSTS
======================================== */

function renderPosts() {
  if (!feedGrid || !searchInput || !emptyState) {
    console.error("Some Skillfolio feed elements are missing.");
    return;
  }

  const query = searchInput.value.trim().toLowerCase();
  const allPosts = getAllPosts();

  const filteredPosts = allPosts.filter((post) => {
    const matchesCategory =
      selectedCategory === "All" ||
      post.skill.toLowerCase() === selectedCategory.toLowerCase();

    const searchableText = [
      post.creator,
      post.username,
      post.skill,
      post.title,
      post.caption
    ].join(" ").toLowerCase();

    return matchesCategory && searchableText.includes(query);
  });

  feedGrid.replaceChildren();

  filteredPosts.forEach((post) => {
    feedGrid.appendChild(createPostCard(post));
  });

  emptyState.hidden = filteredPosts.length > 0;
}

/* ========================================
   DISPLAY SUGGESTED CREATORS
======================================== */

function renderCreators() {
  if (!creatorsList) return;

  creatorsList.replaceChildren();

  creators.forEach((creator) => {
    const row = document.createElement("div");
    row.className = "creator-row";

    row.innerHTML = `
      <div class="avatar ${escapeHTML(creator.avatar)}">
        ${escapeHTML(creator.initial)}
      </div>

      <div class="creator-info">
        <strong>${escapeHTML(creator.name)}</strong>
        <span>${escapeHTML(creator.skill)}</span>
      </div>

      <button class="follow-button" type="button">
        Follow
      </button>
    `;

    creatorsList.appendChild(row);
  });
}

/* ========================================
   CATEGORY FILTERS
======================================== */

document.querySelectorAll(".category-chip").forEach((button) => {
  button.addEventListener("click", () => {
    selectedCategory = button.dataset.category || "All";

    document.querySelectorAll(".category-chip").forEach((chip) => {
      const isSelected = chip === button;

      chip.classList.toggle("selected", isSelected);
      chip.setAttribute("aria-pressed", String(isSelected));
    });

    renderPosts();
  });
});

/* ========================================
   SEARCH
======================================== */

if (searchForm) {
  searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    renderPosts();
  });
}

if (searchInput) {
  searchInput.addEventListener("input", renderPosts);
}

/* ========================================
   LIKE, SAVE AND FOLLOW
======================================== */

document.addEventListener("click", (event) => {
  if (!(event.target instanceof Element)) return;

  const likeButton = event.target.closest(".like-action");

  if (likeButton) {
    const count = likeButton.querySelector("span");
    if (!count) return;

    const isLiked = likeButton.classList.toggle("is-liked");
    const currentCount = Number(count.textContent) || 0;

    count.textContent = String(
      Math.max(0, currentCount + (isLiked ? 1 : -1))
    );

    likeButton.setAttribute("aria-pressed", String(isLiked));
    likeButton.firstChild.textContent = isLiked ? "♥ " : "♡ ";
    return;
  }

  const saveButton = event.target.closest(".save-action");

  if (saveButton) {
    const isSaved = saveButton.classList.toggle("is-active");

    saveButton.textContent = isSaved ? "▣" : "♧";
    saveButton.setAttribute("aria-pressed", String(isSaved));
    saveButton.setAttribute(
      "aria-label",
      isSaved ? "Unsave post" : "Save post"
    );
    return;
  }

  const followButton = event.target.closest(".follow-button");

  if (followButton) {
    const isFollowing = followButton.classList.toggle("is-following");

    followButton.textContent = isFollowing ? "Following" : "Follow";
  }
});

/* ========================================
   OPEN CREATE POST PAGE
======================================== */

function openCreatePostPage() {
  window.location.href = "create-post.html";
}

const createPostButton = document.querySelector("#create-post-button");
const mobileCreateButton = document.querySelector("#mobile-create-button");

if (createPostButton) {
  createPostButton.addEventListener("click", openCreatePostPage);
}

if (mobileCreateButton) {
  mobileCreateButton.addEventListener("click", openCreatePostPage);
}

/* ========================================
   INITIALIZE HOMEPAGE
======================================== */

renderPosts();
renderCreators();

console.log("Skillfolio homepage initialized!");
