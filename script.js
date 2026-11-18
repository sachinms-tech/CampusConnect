
const events = [
  {id:1,title:"Code Sprint",category:"Technical",icon:"💻",date:"Date to be announced",description:"Test your programming skills and solve exciting coding challenges."},
  {id:2,title:"AI Innovation Workshop",category:"Workshop",icon:"🤖",date:"Date to be announced",description:"Explore artificial intelligence and discover new technologies."},
  {id:3,title:"Cultural Fest",category:"Cultural",icon:"🎭",date:"Date to be announced",description:"Celebrate creativity, music, dance and campus talent."},
  {id:4,title:"Web Development Challenge",category:"Technical",icon:"🌐",date:"Date to be announced",description:"Build creative and responsive websites."},
  {id:5,title:"Cloud Computing Workshop",category:"Workshop",icon:"☁️",date:"Date to be announced",description:"Learn cloud computing fundamentals and deployment."},
  {id:6,title:"Talent Showcase",category:"Cultural",icon:"🎤",date:"Date to be announced",description:"Showcase your skills and celebrate student talent."}
];

const resources = [
  {title:"Python Programming",category:"Programming",icon:"🐍",description:"Learn Python basics, concepts and practical coding.",url:"https://www.python.org/about/gettingstarted/"},
  {title:"Java Documentation",category:"Programming",icon:"☕",description:"Explore Java tutorials and official documentation.",url:"https://dev.java/learn/"},
  {title:"W3Schools HTML & CSS",category:"Web Development",icon:"🌐",description:"Learn HTML, CSS and build responsive websites.",url:"https://www.w3schools.com/"},
  {title:"freeCodeCamp",category:"Web Development",icon:"💻",description:"Practice web development with free interactive lessons.",url:"https://www.freecodecamp.org/"},
  {title:"Google Machine Learning",category:"AI & ML",icon:"🤖",description:"Understand machine learning through guided lessons.",url:"https://developers.google.com/machine-learning"},
  {title:"Kaggle Learn",category:"AI & ML",icon:"📊",description:"Practice data science and machine learning skills.",url:"https://www.kaggle.com/learn"},
  {title:"GitHub Skills",category:"Programming",icon:"🐙",description:"Learn Git and GitHub through practical exercises.",url:"https://skills.github.com/"},
  {title:"Microsoft Learn",category:"Career",icon:"🎯",description:"Explore technology learning paths and certifications.",url:"https://learn.microsoft.com/training/"}
];

const eventGrid = document.getElementById("eventGrid");
const resourceGrid = document.getElementById("resourceGrid");
const eventModal = document.getElementById("eventModal");

let selectedEvent = null;
let registrations = [];

try {
  registrations = JSON.parse(localStorage.getItem("campusRegistrations") || "[]");
  if (!Array.isArray(registrations)) registrations = [];
} catch (error) {
  registrations = [];
}

// Prevent user-entered text from being interpreted as HTML.
function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}

// DISPLAY EVENTS
function displayEvents(category = "All") {
  const filtered = events.filter(e =>
    category === "All" || e.category === category
  );

  eventGrid.innerHTML = filtered.map(e => `
    <article class="event-card">
      <div class="event-banner">${e.icon}</div>
      <div class="event-info">
        <span class="event-category">${escapeHTML(e.category)}</span>
        <h3>${escapeHTML(e.title)}</h3>
        <p>📅 ${escapeHTML(e.date)}</p>
        <p>${escapeHTML(e.description)}</p>
        <button class="register-btn" data-event-id="${e.id}">
          Register Now →
        </button>
      </div>
    </article>
  `).join("");
}

// DISPLAY RESOURCES
function displayResources(category = "All") {
  const filtered = resources.filter(r =>
    category === "All" || r.category === category
  );

  resourceGrid.innerHTML = filtered.map(r => `
    <article class="resource-card">
      <span class="resource-icon">${r.icon}</span>
      <h3>${escapeHTML(r.title)}</h3>
      <span class="event-category">${escapeHTML(r.category)}</span>
      <p>${escapeHTML(r.description)}</p>
      <a href="${r.url}" target="_blank" rel="noopener noreferrer">
        Start Learning ↗
      </a>
    </article>
  `).join("");
}

// EVENT FILTERS
document.querySelectorAll(".filter-btn").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".filter-btn").forEach(b =>
      b.classList.remove("active")
    );

    button.classList.add("active");
    displayEvents(button.dataset.category);
  });
});

// RESOURCE FILTERS
document.querySelectorAll(".resource-filter").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".resource-filter").forEach(b =>
      b.classList.remove("active")
    );

    button.classList.add("active");
    displayResources(button.dataset.resource);
  });
});

// EVENT REGISTRATION MODAL
eventGrid.addEventListener("click", e => {
  const button = e.target.closest("[data-event-id]");
  if (!button) return;

  selectedEvent = events.find(item =>
    item.id === Number(button.dataset.eventId)
  );

  document.getElementById("selectedEvent").textContent =
    selectedEvent.title;

  document.getElementById("successMessage").textContent = "";
  document.getElementById("eventForm").reset();

  eventModal.classList.remove("hidden");
});

function closeModal() {
  eventModal.classList.add("hidden");
}

document.getElementById("closeModal").addEventListener("click", closeModal);

eventModal.addEventListener("click", e => {
  if (e.target === eventModal) closeModal();
});

// EVENT REGISTRATION
document.getElementById("eventForm").addEventListener("submit", e => {
  e.preventDefault();

  if (!selectedEvent) return;

  const registration = {
    eventId: selectedEvent.id,
    eventName: selectedEvent.title,
    name: document.getElementById("studentName").value.trim(),
    email: document.getElementById("studentEmail").value.trim(),
    usn: document.getElementById("studentUSN").value.trim()
  };

  const duplicate = registrations.some(item =>
    item.eventId === registration.eventId &&
    String(item.usn).toLowerCase() === registration.usn.toLowerCase()
  );

  const message = document.getElementById("successMessage");

  if (duplicate) {
    message.textContent =
      "You are already registered for this event.";
    return;
  }

  registrations.push(registration);

  try {
    localStorage.setItem(
      "campusRegistrations",
      JSON.stringify(registrations)
    );

    message.textContent =
      "Registration successful! Welcome to the event.";

    e.target.reset();

  } catch (error) {
    registrations.pop();

    message.textContent =
      "Unable to save registration in this browser.";
  }
});

// ==========================================
// CAMPUS LOST & FOUND HUB
// ==========================================

// Listings are stored locally in the browser.
// They are not automatically shared between devices.

const LF_STORAGE_KEY = "campusLostFoundListings";

const lfGrid = document.getElementById("lostFoundGrid");
const lfModal = document.getElementById("lostFoundModal");

let lostFoundListings = [];

// LOAD SAVED LOST & FOUND LISTINGS
function loadLostFound() {
  try {
    const saved = JSON.parse(
      localStorage.getItem(LF_STORAGE_KEY) || "[]"
    );

    lostFoundListings = Array.isArray(saved) ? saved : [];

  } catch (error) {
    lostFoundListings = [];
  }
}

// SAVE LISTINGS
function saveLostFound() {
  try {
    localStorage.setItem(
      LF_STORAGE_KEY,
      JSON.stringify(lostFoundListings)
    );

    return true;

  } catch (error) {
    return false;
  }
}

// OPEN LOST OR FOUND FORM
function openLostFoundForm(type) {
  document.getElementById("lostFoundForm").reset();

  document.getElementById("lfType").value = type;

  document.getElementById("lostFoundModalTitle").textContent =
    type === "Lost"
      ? "Report a Lost Item"
      : "Report a Found Item";

  document.getElementById("lfDate").value =
    new Date().toISOString().slice(0, 10);

  document.getElementById("lfMessage").textContent = "";

  lfModal.classList.remove("hidden");
}

// CLOSE LOST & FOUND FORM
function closeLostFoundForm() {
  lfModal.classList.add("hidden");
}

// LOST ITEM BUTTON
document.getElementById("reportLostBtn").addEventListener("click", () => {
  openLostFoundForm("Lost");
});

// FOUND ITEM BUTTON
document.getElementById("reportFoundBtn").addEventListener("click", () => {
  openLostFoundForm("Found");
});

// CLOSE BUTTON
document.getElementById("closeLostFoundModal").addEventListener(
  "click",
  closeLostFoundForm
);

// CLOSE WHEN CLICKING OUTSIDE THE FORM
lfModal.addEventListener("click", e => {
  if (e.target === lfModal) {
    closeLostFoundForm();
  }
});

// SUBMIT LOST OR FOUND ITEM
document.getElementById("lostFoundForm").addEventListener("submit", e => {
  e.preventDefault();

  const type = document.getElementById("lfType").value;

  const listing = {
    id: "LF-" + Date.now().toString(36).toUpperCase(),
    type: type,

    item: document.getElementById("lfItem").value.trim(),

    category: document.getElementById("lfCategory").value,

    description: document.getElementById("lfDescription").value.trim(),

    location: document.getElementById("lfLocation").value.trim(),

    date: document.getElementById("lfDate").value,

    reporter: document.getElementById("lfReporter").value.trim(),

    status: type,

    createdAt: Date.now()
  };

  if (
    !listing.item ||
    !listing.description ||
    !listing.location ||
    !listing.date ||
    !listing.category
  ) {
    return;
  }

  lostFoundListings.unshift(listing);

  if (!saveLostFound()) {
    lostFoundListings.shift();

    document.getElementById("lfMessage").textContent =
      "Could not save this listing. Check browser storage and try again.";

    return;
  }

  renderLostFound();

  closeLostFoundForm();

  document.getElementById("lostFoundCount").textContent =
    "Your listing has been added on this browser.";
});

// DISPLAY LOST & FOUND LISTINGS
function renderLostFound() {
  const query = document.getElementById("lostFoundSearch")
    .value.trim().toLowerCase();

  const filter = document.getElementById("lostFoundFilter").value;

  const filtered = lostFoundListings.filter(item => {

    const matchesText = [
      item.item,
      item.category,
      item.description,
      item.location
    ].join(" ").toLowerCase().includes(query);

    const matchesFilter =
      filter === "All" ||
      (
        filter === "Resolved"
          ? item.status === "Resolved"
          : item.type === filter && item.status !== "Resolved"
      );

    return matchesText && matchesFilter;
  });

  document.getElementById("lostFoundCount").textContent =
    `${filtered.length} listing${filtered.length === 1 ? "" : "s"} shown`;

  if (!filtered.length) {
    lfGrid.innerHTML = `
      <div class="empty-state">
        <span>🧭</span>
        <h3>No matching listings</h3>
        <p>Try another search or create a new lost/found listing.</p>
      </div>
    `;

    return;
  }

  lfGrid.innerHTML = filtered.map(item => {

    const resolved = item.status === "Resolved";

    const badgeClass = resolved
      ? "resolved"
      : item.type.toLowerCase();

    const dateText = item.date
      ? new Date(item.date + "T00:00:00").toLocaleDateString()
      : "Date not given";

    let itemIcon = "📦";

    if (item.category === "Electronics") itemIcon = "📱";
    if (item.category === "Books & Notes") itemIcon = "📚";
    if (item.category === "Keys") itemIcon = "🔑";
    if (item.category === "ID Card") itemIcon = "🪪";
    if (item.category === "Wallet / Bag") itemIcon = "👛";

    return `
      <article class="lf-card">

        <div class="lf-card-top">
          <span class="lf-status ${badgeClass}">
            ${escapeHTML(item.status)}
          </span>

          <span class="lf-id">
            ${escapeHTML(item.id)}
          </span>
        </div>

        <span class="lf-item-icon">${itemIcon}</span>

        <h3>${escapeHTML(item.item)}</h3>

        <span class="event-category">
          ${escapeHTML(item.category)}
        </span>

        <p>${escapeHTML(item.description)}</p>

        <div class="lf-meta">
          <span>📍 ${escapeHTML(item.location)}</span>
          <span>📅 ${escapeHTML(dateText)}</span>
        </div>

        ${
          item.reporter
            ? `<p class="lf-reporter">Reported by ${escapeHTML(item.reporter)}</p>`
            : ""
        }

        <div class="lf-card-actions">
          ${
            !resolved
              ? `<button class="resolve-btn" data-resolve-id="${escapeHTML(item.id)}" type="button">
                   Mark as Resolved
                 </button>`
              : `<span class="resolved-note">This listing is resolved.</span>`
          }
        </div>

        <p class="lf-help">
          If this may be your item, contact the college office/security desk and quote the listing ID.
        </p>

      </article>
    `;

  }).join("");
}

// SEARCH LISTINGS
document.getElementById("lostFoundSearch").addEventListener(
  "input",
  renderLostFound
);

// FILTER LISTINGS
document.getElementById("lostFoundFilter").addEventListener(
  "change",
  renderLostFound
);

// MARK ITEM AS RESOLVED
lfGrid.addEventListener("click", e => {

  const button = e.target.closest("[data-resolve-id]");

  if (!button) return;

  const item = lostFoundListings.find(entry =>
    entry.id === button.dataset.resolveId
  );

  if (!item || item.status === "Resolved") return;

  if (!confirm("Mark this listing as resolved?")) return;

  const previousStatus = item.status;

  item.status = "Resolved";

  if (!saveLostFound()) {
    item.status = previousStatus;

    alert("Could not update the listing in this browser.");

    return;
  }

  renderLostFound();
});

// ESCAPE KEY CLOSES BOTH MODALS
document.addEventListener("keydown", e => {

  if (e.key === "Escape") {
    closeModal();
    closeLostFoundForm();
  }

});

// INITIALIZE WEBSITE
displayEvents();
displayResources();
loadLostFound();
renderLostFound();
