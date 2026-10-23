
"use strict";

// ========================================
// SKILLFOLIO — NOTIFICATIONS
// ========================================

// 1. Find page elements.

const notificationsList = document.querySelector("#notifications-list");
const emptyState = document.querySelector("#notifications-empty");
const filterButtons = document.querySelectorAll(".notification-tab");
const markAllReadButton = document.querySelector("#mark-all-read");
const summary = document.querySelector("#notifications-summary");
const unreadTabCount = document.querySelector("#unread-tab-count");
const sidebarUnreadCount = document.querySelector("#sidebar-unread-count");

const STORAGE_KEY = "skillfolioNotifications";

// 2. Default sample notifications.

const sampleNotifications = [
  {
    id: 1,
    initials: "AK",
    avatarClass: "avatar-purple",
    name: "Amara Okafor",
    message: "liked your project",
    detail: "Modern Brand Identity",
    time: "5 minutes ago",
    unread: true,
    action: "View post",
    type: "post"
  },
  {
    id: 2,
    initials: "JD",
    avatarClass: "avatar-blue",
    name: "James David",
    message: "started following you.",
    detail: "",
    time: "20 minutes ago",
    unread: true,
    action: "Follow back",
    type: "follow"
  },
  {
    id: 3,
    initials: "ZM",
    avatarClass: "avatar-pink",
    name: "Zara Musa",
    message: "commented on your project:",
    detail: '"Love the creativity in this work!"',
    time: "1 hour ago",
    unread: true,
    action: "View post",
    type: "post"
  },
  {
    id: 4,
    initials: "TO",
    avatarClass: "avatar-orange",
    name: "Tobi Okafor",
    message: "saved your project",
    detail: "Website Interface Design",
    time: "3 hours ago",
    unread: false,
    action: "View post",
    type: "post"
  },
  {
    id: 5,
    initials: "FN",
    avatarClass: "avatar-green",
    name: "Faith Nwosu",
    message: "shared a new creative project.",
    detail: "Photography collection",
    time: "Yesterday",
    unread: false,
    action: "View profile",
    type: "profile"
  }
];

// 3. Load saved notifications, or use the samples on first visit.

function loadNotifications() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved !== null) {
      const parsed = JSON.parse(saved);

      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (error) {
    console.error("Could not load saved notifications:", error);
  }

  return sampleNotifications.map(item => ({ ...item }));
}

let notifications = loadNotifications();
let activeFilter = "all";

// 4. Save notification changes to browser storage.

function saveNotifications() {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(notifications)
    );
  } catch (error) {
    console.error("Could not save notifications:", error);
  }
}

// 5. Count unread notifications.

function getUnreadCount() {
  return notifications.filter(item => item.unread).length;
}

// 6. Update all unread counters and buttons.

function updateNotificationCounts() {
  const unreadCount = getUnreadCount();

  unreadTabCount.textContent = unreadCount;
  sidebarUnreadCount.textContent = unreadCount;

  unreadTabCount.hidden = unreadCount === 0;
  sidebarUnreadCount.hidden = unreadCount === 0;

  markAllReadButton.disabled = unreadCount === 0;
}

// 7. Create a notification item.

function createNotificationElement(item) {
  const article = document.createElement("article");

  article.className = item.unread
    ? "notification-item unread"
    : "notification-item";

  article.dataset.id = item.id;

  const avatar = document.createElement("div");
  avatar.className =
    `notification-avatar ${item.avatarClass || "avatar-purple"}`;
  avatar.textContent = item.initials || "?";
  avatar.setAttribute("aria-hidden", "true");

  const content = document.createElement("div");
  content.className = "notification-content";

  const message = document.createElement("p");
  message.className = "notification-message";

  const name = document.createElement("strong");
  name.textContent = item.name || "Skillfolio user";

  message.append(
    name,
    document.createTextNode(` ${item.message || ""}`)
  );

  if (item.detail) {
    message.append(document.createTextNode(` ${item.detail}`));
  }

  const time = document.createElement("span");
  time.className = "notification-time";
  time.textContent = item.time || "Recently";

  content.append(message, time);

  const actionButton = document.createElement("button");
  actionButton.type = "button";
  actionButton.className = "notification-action";
  actionButton.textContent = item.following
    ? "Following"
    : item.action || "View";

  actionButton.dataset.action = item.type || "post";

  if (item.following) {
    actionButton.disabled = true;
  }

  article.append(avatar, content, actionButton);

  if (item.unread) {
    const unreadDot = document.createElement("span");
    unreadDot.className = "notification-unread-dot";
    unreadDot.setAttribute("aria-label", "Unread");
    article.append(unreadDot);
  }

  return article;
}

// 8. Render the selected notification list.

function renderNotifications() {
  const visibleNotifications = notifications.filter(item => {
    return activeFilter === "all" || item.unread;
  });

  notificationsList.replaceChildren();

  visibleNotifications.forEach(item => {
    notificationsList.append(
      createNotificationElement(item)
    );
  });

  emptyState.hidden = visibleNotifications.length > 0;
  notificationsList.hidden = visibleNotifications.length === 0;

  summary.textContent =
    `${visibleNotifications.length} notification` +
    `${visibleNotifications.length === 1 ? "" : "s"}`;

  filterButtons.forEach(button => {
    const isActive = button.dataset.filter === activeFilter;

    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  updateNotificationCounts();
}

// 9. Mark one notification as read.

function markNotificationAsRead(id) {
  const notification = notifications.find(
    item => String(item.id) === String(id)
  );

  if (notification) {
    notification.unread = false;
  }
}

// 10. Switch between All and Unread.

filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    renderNotifications();
  });
});

// 11. Mark every notification as read.

markAllReadButton.addEventListener("click", () => {
  notifications.forEach(item => {
    item.unread = false;
  });

  saveNotifications();
  renderNotifications();
});

// 12. Handle notification actions.

notificationsList.addEventListener("click", event => {
  const button = event.target.closest(".notification-action");

  if (!button) {
    return;
  }

  const article = button.closest(".notification-item");

  if (!article) {
    return;
  }

  const notification = notifications.find(
    item => String(item.id) === article.dataset.id
  );

  if (!notification) {
    return;
  }

  markNotificationAsRead(notification.id);

  if (notification.type === "follow") {
    notification.following = true;
  }

  saveNotifications();
  renderNotifications();

  // Open the relevant demo page after the action.
  if (notification.type === "post") {
    window.location.href = "home.html";
  } else if (notification.type === "profile") {
    window.location.href = "explore.html";
  }
});

// 13. Display saved notifications on page load.

renderNotifications();

console.log("Skillfolio Notifications page is ready!");
