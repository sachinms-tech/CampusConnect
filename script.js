
const events = [
  {
    id: "code-sprint",
    title: "Code Sprint",
    category: "Technical",
    icon: "💻",
    date: "To be announced",
    duration: "2–3 Hours",
    description: "A competitive coding challenge to test programming logic, problem-solving and algorithmic skills.",
    activities: ["Programming challenges", "Logical problem solving", "Algorithm implementation", "Coding and debugging"],
    participation: ["Individual"]
  },
  {
    id: "ai-workshop",
    title: "AI Innovation Workshop",
    category: "Workshop",
    icon: "🤖",
    date: "To be announced",
    duration: "Half Day",
    description: "Explore artificial intelligence, machine learning and practical applications of emerging technologies.",
    activities: ["Introduction to AI and ML", "Explore AI tools", "Hands-on demonstrations", "Build a mini AI project"],
    participation: ["Individual", "Team of 2", "Team of 3"]
  },
  {
    id: "cultural-fest",
    title: "Cultural Fest",
    category: "Cultural",
    icon: "🎭",
    date: "To be announced",
    duration: "Full Day",
    description: "Celebrate creativity and talent through performances, music, dance and cultural activities.",
    activities: ["Solo and group dance", "Singing and instrumental music", "Drama and skits", "Fashion show", "Mimicry, poetry and storytelling"],
    participation: [
      "Solo Dance (1 member)",
      "Group Dance (4–10 members)",
      "Solo Singing (1 member)",
      "Duet Singing (2 members)",
      "Drama / Skit (3–8 members)",
      "Fashion Show (4–8 members)",
      "Instrumental Music (1–5 members)",
      "Mimicry / Stand-up Comedy (1–2 members)",
      "Poetry / Storytelling (1–2 members)"
    ]
  },
  {
    id: "web-challenge",
    title: "Web Development Challenge",
    category: "Technical",
    icon: "🌐",
    date: "To be announced",
    duration: "3 Hours",
    description: "Design and develop a creative website using modern web technologies.",
    activities: ["HTML page structure", "CSS styling", "JavaScript interactions", "Responsive web design"],
    participation: ["Individual", "Team of 2", "Team of 3"]
  },
  {
    id: "cloud-workshop",
    title: "Cloud Computing Workshop",
    category: "Workshop",
    icon: "☁️",
    date: "To be announced",
    duration: "Half Day",
    description: "Understand cloud computing concepts, deployment and modern cloud platforms.",
    activities: ["Cloud computing fundamentals", "Introduction to cloud services", "Deployment demonstration", "Practical cloud exercises"],
    participation: ["Individual", "Team of 2"]
  },
  {
    id: "talent-show",
    title: "Talent Showcase",
    category: "Cultural",
    icon: "🌟",
    date: "To be announced",
    duration: "2–3 Hours",
    description: "A platform for students to showcase their unique skills, creativity and confidence.",
    activities: ["Music and dance", "Art and creative displays", "Photography and storytelling", "Other special talents"],
    participation: ["Solo", "Duo", "Group"]
  }
];

const resources = [
  { title: "GeeksforGeeks", category: "Programming", icon: "💻", description: "Programming tutorials, data structures, algorithms and interview preparation.", url: "https://www.geeksforgeeks.org/" },
  { title: "LeetCode", category: "Programming", icon: "🧠", description: "Practice coding problems and improve problem-solving skills.", url: "https://leetcode.com/" },
  { title: "W3Schools", category: "Web Development", icon: "🌐", description: "Beginner-friendly HTML, CSS, JavaScript and web development tutorials.", url: "https://www.w3schools.com/" },
  { title: "MDN Web Docs", category: "Web Development", icon: "🛠️", description: "Detailed documentation and guides for modern web technologies.", url: "https://developer.mozilla.org/" },
  { title: "Google AI", category: "AI & ML", icon: "🤖", description: "Explore artificial intelligence learning resources and tools.", url: "https://ai.google/" },
  { title: "Kaggle", category: "AI & ML", icon: "📊", description: "Learn data science and machine learning through practical projects.", url: "https://www.kaggle.com/learn" },
  { title: "GitHub", category: "Career", icon: "📁", description: "Build your portfolio, manage projects and collaborate with developers.", url: "https://github.com/" },
  { title: "LinkedIn Learning", category: "Career", icon: "🚀", description: "Develop professional, technical and career skills.", url: "https://www.linkedin.com/learning/" }
];

const eventGrid = document.getElementById("eventGrid");
const resourceGrid = document.getElementById("resourceGrid");
const eventModal = document.getElementById("eventModal");
const eventDetails = document.getElementById("eventDetails");
const eventForm = document.getElementById("eventForm");

function getStored(key) {
  try {
    return JSON.parse(localStorage.getItem(key)) || [];
  } catch {
    return [];
  }
}

function saveStored(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[character]);
}

// EVENT HUB
function renderEvents(category = "All") {
  const filtered = category === "All"
    ? events
    : events.filter(event => event.category === category);

  eventGrid.innerHTML = filtered.map(event => `
    <article class="event-card">
      <span class="event-category">${escapeHTML(event.category)}</span>
      <div class="feature-icon">${event.icon}</div>
      <h3>${escapeHTML(event.title)}</h3>
      <p>${escapeHTML(event.description)}</p>
      <div class="event-meta">
        <span>📅 ${escapeHTML(event.date)}</span>
        <span>⏱ ${escapeHTML(event.duration)}</span>
      </div>
      <button class="card-action" type="button" data-event="${escapeHTML(event.id)}">
        View Details & Register →
      </button>
    </article>
  `).join("");
}

document.getElementById("eventFilters").addEventListener("click", event => {
  const button = event.target.closest("[data-filter]");
  if (!button) return;

  document.querySelectorAll("#eventFilters .filter-btn").forEach(btn => btn.classList.remove("active"));
  button.classList.add("active");
  renderEvents(button.dataset.filter);
});

eventGrid.addEventListener("click", event => {
  const button = event.target.closest("[data-event]");
  if (button) openEventDetails(button.dataset.event);
});

function openEventDetails(id) {
  const selectedEvent = events.find(item => item.id === id);
  if (!selectedEvent) return;

  document.getElementById("eventId").value = selectedEvent.id;
  document.getElementById("eventMessage").textContent = "";

  eventDetails.innerHTML = `
    <span class="event-category">${escapeHTML(selectedEvent.category)}</span>
    <h2 id="eventModalTitle">${selectedEvent.icon} ${escapeHTML(selectedEvent.title)}</h2>
    <p>${escapeHTML(selectedEvent.description)}</p>

    <div class="modal-info">
      <span>📅 ${escapeHTML(selectedEvent.date)}</span>
      <span>⏱ ${escapeHTML(selectedEvent.duration)}</span>
    </div>

    <h4>What to expect</h4>
    <ul>${selectedEvent.activities.map(item => `<li>${escapeHTML(item)}</li>`).join("")}</ul>

    <h4>Participation options</h4>
    <p>Choose your preferred participation category in the registration form below.</p>
  `;

  document.getElementById("registrationChoice").innerHTML = `
    <label for="selectedParticipation">Participation category</label>
    <select id="selectedParticipation" required>
      ${selectedEvent.participation.map(option =>
        `<option value="${escapeHTML(option)}">${escapeHTML(option)}</option>`
      ).join("")}
    </select>
  `;

  eventModal.classList.add("open");
  eventModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeEventModal() {
  eventModal.classList.remove("open");
  eventModal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

eventModal.querySelectorAll("[data-close]").forEach(element => {
  element.addEventListener("click", closeEventModal);
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape") closeEventModal();
});

eventForm.addEventListener("submit", event => {
  event.preventDefault();

  const eventId = document.getElementById("eventId").value;
  const name = document.getElementById("studentName").value.trim();
  const email = document.getElementById("studentEmail").value.trim();
  const usn = document.getElementById("studentUSN").value.trim();
  const participation = document.getElementById("selectedParticipation").value;

  if (!name || !email || !usn || !participation) return;

  const registrations = getStored("campusRegistrations");

  const duplicate = registrations.some(item =>
    item.eventId === eventId &&
    item.usn.toLowerCase() === usn.toLowerCase()
  );

  const message = document.getElementById("eventMessage");

  if (duplicate) {
    message.textContent = "You have already registered for this event using this USN.";
    return;
  }

  const selectedEvent = events.find(item => item.id === eventId);

  registrations.push({
    eventId,
    eventTitle: selectedEvent ? selectedEvent.title : eventId,
    name,
    email,
    usn,
    participation,
    registeredAt: new Date().toISOString()
  });

  saveStored("campusRegistrations", registrations);

  message.textContent = "Registration saved successfully in this browser!";
  eventForm.reset();
});

// RESOURCE HUB
function renderResources(category = "All") {
  const filtered = category === "All"
    ? resources
    : resources.filter(resource => resource.category === category);

  resourceGrid.innerHTML = filtered.map(resource => `
    <article class="resource-card">
      <span class="resource-category">${escapeHTML(resource.category)}</span>
      <div class="feature-icon">${resource.icon}</div>
      <h3>${escapeHTML(resource.title)}</h3>
      <p>${escapeHTML(resource.description)}</p>
      <a href="${escapeHTML(resource.url)}" target="_blank" rel="noopener noreferrer">
        Explore Resource ↗
      </a>
    </article>
  `).join("");
}

document.getElementById("resourceFilters").addEventListener("click", event => {
  const button = event.target.closest("[data-filter]");
  if (!button) return;

  document.querySelectorAll("#resourceFilters .filter-btn").forEach(btn => btn.classList.remove("active"));
  button.classList.add("active");
  renderResources(button.dataset.filter);
});

// LOST & FOUND
const lostFoundForm = document.getElementById("lostFoundForm");

function renderLostFound() {
  const search = document.getElementById("lostFoundSearch").value.trim().toLowerCase();
  const filter = document.getElementById("lostFoundFilter").value;
  const listings = getStored("campusLostFoundListings");

  const filtered = listings.filter(item => {
    const matchesSearch = `${item.title} ${item.description} ${item.location}`.toLowerCase().includes(search);
    const status = item.resolved ? "Resolved" : item.type;
    const matchesFilter = filter === "All" || status === filter;
    return matchesSearch && matchesFilter;
  });

  document.getElementById("listingCount").textContent =
    `${filtered.length} ${filtered.length === 1 ? "report" : "reports"}`;

  const grid = document.getElementById("lostFoundGrid");

  if (!filtered.length) {
    grid.innerHTML = `<p class="small-note">No matching reports yet. You can submit a new report using the form.</p>`;
    return;
  }

  grid.innerHTML = filtered.slice().reverse().map(item => `
    <article class="listing-card">
      <div class="listing-card-top">
        <h4>${escapeHTML(item.title)}</h4>
        <span class="status-pill ${item.resolved ? "resolved" : ""}">
          ${item.resolved ? "Resolved" : escapeHTML(item.type)}
        </span>
      </div>
      <p>${escapeHTML(item.description)}</p>
      <p>📍 ${escapeHTML(item.location)}</p>
      <p>Contact: ${escapeHTML(item.contact)}</p>
      ${item.resolved ? "" : `<button class="resolve-btn" type="button" data-resolve="${escapeHTML(item.id)}">Mark as Resolved</button>`}
    </article>
  `).join("");
}

lostFoundForm.addEventListener("submit", event => {
  event.preventDefault();

  const listings = getStored("campusLostFoundListings");

  const newItem = {
    id: Date.now().toString(),
    type: document.getElementById("itemType").value,
    title: document.getElementById("itemTitle").value.trim(),
    description: document.getElementById("itemDescription").value.trim(),
    location: document.getElementById("itemLocation").value.trim(),
    contact: document.getElementById("itemContact").value.trim(),
    resolved: false,
    createdAt: new Date().toISOString()
  };

  if (!newItem.title || !newItem.description || !newItem.location || !newItem.contact) return;

  listings.push(newItem);
  saveStored("campusLostFoundListings", listings);

  document.getElementById("lostFoundMessage").textContent = "Your report has been saved in this browser.";
  lostFoundForm.reset();
  renderLostFound();
});

document.getElementById("lostFoundGrid").addEventListener("click", event => {
  const button = event.target.closest("[data-resolve]");
  if (!button) return;

  const listings = getStored("campusLostFoundListings");
  const item = listings.find(listing => listing.id === button.dataset.resolve);

  if (item) {
    item.resolved = true;
    saveStored("campusLostFoundListings", listings);
    renderLostFound();
  }
});

document.getElementById("lostFoundSearch").addEventListener("input", renderLostFound);
document.getElementById("lostFoundFilter").addEventListener("change", renderLostFound);

// MOBILE NAVIGATION
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

menuToggle.addEventListener("click", () => {
  navLinks.classList.toggle("open");
});

navLinks.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => navLinks.classList.remove("open"));
});

// FOOTER YEAR
document.getElementById("currentYear").textContent = new Date().getFullYear();

// INITIAL RENDER
renderEvents();
renderResources();
renderLostFound();
