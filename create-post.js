
"use strict";

// ========================================
// SKILLFOLIO — CREATE POST
// ========================================

const postForm = document.querySelector("#create-post-form");
const mediaInput = document.querySelector("#post-media");
const uploadArea = document.querySelector("#media-upload-area");
const mediaPreview = document.querySelector("#media-preview");
const previewImage = document.querySelector("#preview-image");
const previewVideo = document.querySelector("#preview-video");
const removeMediaButton = document.querySelector("#remove-media");

const captionInput = document.querySelector("#post-caption");
const captionCount = document.querySelector("#caption-count");
const categoryInput = document.querySelector("#post-category");
const formMessage = document.querySelector("#form-message");

const previewCardMedia = document.querySelector("#preview-card-media");
const previewCardCaption = document.querySelector("#preview-card-caption");
const previewCardCategory = document.querySelector("#preview-card-category");
const previewPostButton = document.querySelector("#preview-post-button");

const POSTS_STORAGE_KEY = "skillfolioPosts";
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const MAX_CAPTION_LENGTH = 500;

let selectedMediaUrl = "";
let selectedMediaType = "";
let selectedMediaData = "";
let mediaReadInProgress = false;
let isPublishing = false;

// ========================================
// HELPER: SHOW A MESSAGE
// ========================================

function showMessage(message, type = "info") {
  formMessage.textContent = message;
  formMessage.dataset.type = type;
}

// ========================================
// LIVE POST PREVIEW
// ========================================

function updateLivePreview() {
  const caption = captionInput.value.trim();
  const category = categoryInput.value;

  captionCount.textContent =
    `${captionInput.value.length} / ${MAX_CAPTION_LENGTH}`;

  previewCardCaption.textContent =
    caption || "Your caption will appear here as you type.";

  previewCardCategory.textContent =
    category || "Select a category";
}

// ========================================
// CLEAR SELECTED MEDIA
// ========================================

function clearSelectedMedia() {
  if (selectedMediaUrl) {
    URL.revokeObjectURL(selectedMediaUrl);
  }

  selectedMediaUrl = "";
  selectedMediaType = "";
  selectedMediaData = "";
  mediaReadInProgress = false;

  mediaInput.value = "";

  mediaPreview.hidden = true;
  previewImage.hidden = true;
  previewVideo.hidden = true;

  previewImage.removeAttribute("src");
  previewVideo.removeAttribute("src");

  previewCardMedia.replaceChildren();

  const placeholder = document.createElement("span");
  placeholder.textContent = "Your work will appear here";
  previewCardMedia.append(placeholder);

  uploadArea.hidden = false;
}

// ========================================
// HANDLE IMAGE AND VIDEO SELECTION
// ========================================

function handleMediaSelection() {
  const file = mediaInput.files[0];

  if (!file) return;

  const allowedType =
    file.type.startsWith("image/") ||
    file.type.startsWith("video/");

  if (!allowedType) {
    clearSelectedMedia();
    showMessage("Please choose a valid image or video file.", "error");
    return;
  }

  if (file.size > MAX_FILE_SIZE) {
    clearSelectedMedia();

    showMessage(
      "Please choose a file smaller than 5 MB for this browser demo.",
      "error"
    );

    return;
  }

  clearSelectedMedia();

  selectedMediaType = file.type.startsWith("image/")
    ? "image"
    : "video";

  selectedMediaUrl = URL.createObjectURL(file);

  mediaPreview.hidden = false;
  uploadArea.hidden = true;

  showMessage("Preparing your media...", "info");

  if (selectedMediaType === "image") {
    previewImage.src = selectedMediaUrl;
    previewImage.alt = "Your selected image";
    previewImage.hidden = false;
  } else {
    previewVideo.src = selectedMediaUrl;
    previewVideo.controls = true;
    previewVideo.hidden = false;
  }

  const cardMedia = document.createElement(
    selectedMediaType === "image" ? "img" : "video"
  );

  cardMedia.src = selectedMediaUrl;

  if (selectedMediaType === "image") {
    cardMedia.alt = "Post media preview";
  } else {
    cardMedia.controls = true;
  }

  previewCardMedia.replaceChildren(cardMedia);

  mediaReadInProgress = true;

  const reader = new FileReader();

  reader.onload = () => {
    selectedMediaData = reader.result;
    mediaReadInProgress = false;

    showMessage(
      "Media is ready. You can publish your post.",
      "success"
    );
  };

  reader.onerror = () => {
    selectedMediaData = "";
    mediaReadInProgress = false;

    showMessage(
      "We couldn't read that file. Please select it again.",
      "error"
    );
  };

  reader.readAsDataURL(file);
}

// ========================================
// SAVE POST TO THIS BROWSER
// ========================================

function savePost(mediaData = null) {
  const newPost = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    caption: captionInput.value.trim(),
    category: categoryInput.value,
    mediaType: selectedMediaType || null,
    mediaData,
    createdAt: new Date().toISOString()
  };

  try {
    const storedData = localStorage.getItem(POSTS_STORAGE_KEY);
    const savedPosts = storedData ? JSON.parse(storedData) : [];

    if (!Array.isArray(savedPosts)) {
      throw new Error("The saved posts data is invalid.");
    }

    savedPosts.unshift(newPost);

    localStorage.setItem(
      POSTS_STORAGE_KEY,
      JSON.stringify(savedPosts)
    );

    showMessage(
      "Your post was published successfully! Opening your Home feed...",
      "success"
    );

    // Prevent duplicate submissions.
    isPublishing = true;

    const publishButton = postForm.querySelector(
      'button[type="submit"]'
    );

    if (publishButton) {
      publishButton.disabled = true;
      publishButton.textContent = "Published!";
    }

    // FIX: Open Skillfolio's actual Home feed,
    // not the welcome page.
    window.location.href = "home.html";

  } catch (error) {
    console.error("Unable to save the Skillfolio post:", error);

    isPublishing = false;

    const publishButton = postForm.querySelector(
      'button[type="submit"]'
    );

    if (publishButton) {
      publishButton.disabled = false;
      publishButton.textContent = "Publish Post";
    }

    showMessage(
      "We couldn't save your post. Try a smaller file or remove the media and publish with text only.",
      "error"
    );
  }
}

// ========================================
// MEDIA EVENTS
// ========================================

mediaInput.addEventListener("change", handleMediaSelection);

removeMediaButton.addEventListener("click", () => {
  if (isPublishing) return;

  clearSelectedMedia();
  showMessage("Media removed.", "info");
});

// ========================================
// LIVE PREVIEW EVENTS
// ========================================

captionInput.addEventListener("input", updateLivePreview);
categoryInput.addEventListener("change", updateLivePreview);

previewPostButton.addEventListener("click", () => {
  if (isPublishing) return;

  if (!postForm.reportValidity()) return;

  if (mediaReadInProgress) {
    showMessage(
      "Please wait for your media to finish loading.",
      "info"
    );
    return;
  }

  updateLivePreview();

  showMessage(
    "Preview updated. Review your post before publishing.",
    "success"
  );

  previewCardCaption.scrollIntoView({
    behavior: "smooth",
    block: "nearest"
  });
});

// ========================================
// PUBLISH POST
// ========================================

postForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (isPublishing) return;

  if (!postForm.reportValidity()) return;

  if (captionInput.value.length > MAX_CAPTION_LENGTH) {
    showMessage(
      "Your caption must be 500 characters or fewer.",
      "error"
    );
    return;
  }

  if (mediaReadInProgress) {
    showMessage(
      "Please wait for your media to finish loading, then publish again.",
      "info"
    );
    return;
  }

  if (mediaInput.files.length > 0 && !selectedMediaData) {
    showMessage(
      "Your media isn't ready yet. Please select the file again.",
      "error"
    );
    return;
  }

  savePost(selectedMediaData || null);
});

// ========================================
// INITIALIZE PAGE
// ========================================

updateLivePreview();

console.log("Skillfolio Create Post page is ready.");
