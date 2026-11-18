
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

const eventGrid=document.getElementById("eventGrid");
const resourceGrid=document.getElementById("resourceGrid");
const eventModal=document.getElementById("eventModal");

let selectedEvent=null;
let registrations=[];

try {
  registrations=JSON.parse(localStorage.getItem("campusRegistrations")||"[]");
  if(!Array.isArray(registrations)) registrations=[];
} catch(error) {
  registrations=[];
}

function displayEvents(category="All"){
  const filtered=events.filter(e=>category==="All"||e.category===category);
  eventGrid.innerHTML=filtered.map(e=>`
    <article class="event-card">
      <div class="event-banner">${e.icon}</div>
      <div class="event-info">
        <span class="event-category">${e.category}</span>
        <h3>${e.title}</h3>
        <p>📅 ${e.date}</p>
        <p>${e.description}</p>
        <button class="register-btn" data-event-id="${e.id}">Register Now →</button>
      </div>
    </article>`).join("");
}

function displayResources(category="All"){
  const filtered=resources.filter(r=>category==="All"||r.category===category);
  resourceGrid.innerHTML=filtered.map(r=>`
    <article class="resource-card">
      <span class="resource-icon">${r.icon}</span>
      <h3>${r.title}</h3>
      <span class="event-category">${r.category}</span>
      <p>${r.description}</p>
      <a href="${r.url}" target="_blank" rel="noopener noreferrer">Start Learning ↗</a>
    </article>`).join("");
}

document.querySelectorAll(".filter-btn").forEach(button=>{
  button.addEventListener("click",()=>{
    document.querySelectorAll(".filter-btn").forEach(b=>b.classList.remove("active"));
    button.classList.add("active");
    displayEvents(button.dataset.category);
  });
});

document.querySelectorAll(".resource-filter").forEach(button=>{
  button.addEventListener("click",()=>{
    document.querySelectorAll(".resource-filter").forEach(b=>b.classList.remove("active"));
    button.classList.add("active");
    displayResources(button.dataset.resource);
  });
});

eventGrid.addEventListener("click",e=>{
  const button=e.target.closest("[data-event-id]");
  if(!button)return;

  selectedEvent=events.find(item=>item.id===Number(button.dataset.eventId));
  document.getElementById("selectedEvent").textContent=selectedEvent.title;
  document.getElementById("successMessage").textContent="";
  document.getElementById("eventForm").reset();
  eventModal.classList.remove("hidden");
});

function closeModal(){
  eventModal.classList.add("hidden");
}

document.getElementById("closeModal").addEventListener("click",closeModal);

eventModal.addEventListener("click",e=>{
  if(e.target===eventModal)closeModal();
});

document.addEventListener("keydown",e=>{
  if(e.key==="Escape")closeModal();
});

document.getElementById("eventForm").addEventListener("submit",e=>{
  e.preventDefault();
  if(!selectedEvent)return;

  const registration={
    eventId:selectedEvent.id,
    eventName:selectedEvent.title,
    name:document.getElementById("studentName").value.trim(),
    email:document.getElementById("studentEmail").value.trim(),
    usn:document.getElementById("studentUSN").value.trim()
  };

  const duplicate=registrations.some(item=>
    item.eventId===registration.eventId &&
    item.usn.toLowerCase()===registration.usn.toLowerCase()
  );

  if(duplicate){
    document.getElementById("successMessage").textContent=
      "You are already registered for this event.";
    return;
  }

  registrations.push(registration);
  try{
    localStorage.setItem("campusRegistrations",JSON.stringify(registrations));
    document.getElementById("successMessage").textContent=
      "Registration successful! Welcome to the event.";
    e.target.reset();
  }catch(error){
    registrations.pop();
    document.getElementById("successMessage").textContent=
      "Unable to save registration in this browser.";
  }
});

displayEvents();
displayResources();
