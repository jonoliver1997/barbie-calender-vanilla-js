/* Thank you Copilot */
async function generateUUIDv4() {
  const data = await window.crypto.getRandomValues(new Uint8Array(16));
  data[6] = (data[6] & 0x0f) | 0x40;
  data[8] = (data[8] & 0x3f) | 0x80;
  const hexDigits = "0123456789abcdef";
  let uuid = "";

  for (let i = 0; i < 16; i++) {
    uuid += hexDigits[data[i] >> 4];
    uuid += hexDigits[data[i] & 0x0f];
    if (i === 3 || i === 5 || i === 7 || i === 9) {
      uuid += "-";
    }
  }

  return uuid;
}

// Global Variables
// let nav = 0;
let nav = new Date(); // today

let events = localStorage.getItem("events")
  ? JSON.parse(localStorage.getItem("events"))
  : [];

//DOM Elements
const calendar = document.getElementById("calendar");
monthDisplay = document.getElementById("monthDisplay");
const newEventModal = document.getElementById("newEventModal");
const detailsEventModal = document.getElementById("detailsEventModal");
const backDrop = document.getElementById("modalBackDrop");
const eventTitleInput = document.getElementById("eventTitleInput");
const eventTimeInput = document.getElementById("eventTimeInput");
const eventDescriptionInput = document.getElementById("eventDescriptionInput");
const dateInput = document.getElementById("dateInput");
const editEventModal = document.getElementById("editEventModal");
const editEventTitleInput = document.getElementById("editEventTitleInput");
const editEventTimeInput = document.getElementById("editEventTimeInput");
const editEventDescriptionInput = document.getElementById(
  "editEventDescriptionInput"
);

const weekdays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

let eventForEdit = null;

function openEditModal(eventForDay) {
  eventForEdit = eventForDay;
  closeDetailModal();
  editEventTitleInput.value = eventForDay.title;
  editEventTimeInput.value = eventForDay.time;
  editEventDescriptionInput.value = eventForDay.description;
  editEventModal.style.display = "block";
  backDrop.style.display = "block";
  // Logic here
  // TODO: Write this
}

function closeEditModal() {
  editEventTitleInput.classList.remove("error");
  editEventModal.style.display = "none";
  backDrop.style.display = "none";
  eventTitleInput.value = "";
  eventTimeInput.value = "";
  eventDescriptionInput.value = "";
}

let deleteEventBoundFn = null;

function openDetailsModal(eventForDay) {
  const time = convertTime(eventForDay.time);
  document.getElementById("eventText").innerText =
    eventForDay.title + "\n" + time + "\n" + eventForDay.description;
  detailsEventModal.style.display = "block";
  backDrop.style.display = "block";

  deleteEventBoundFn = () => {
    deleteEvent(eventForDay);
  };
  document
    .getElementById("deleteButton")
    .addEventListener("click", deleteEventBoundFn);
  document
    .getElementById("editButton")
    .addEventListener("click", () => openEditModal(eventForDay));
}

function closeDetailModal() {
  eventTitleInput.classList.remove("error");
  detailsEventModal.style.display = "none";
  backDrop.style.display = "none";
  eventTitleInput.value = "";
  eventTimeInput.value = "";
  eventDescriptionInput.value = "";

  document
    .getElementById("deleteButton")
    .removeEventListener("click", deleteEventBoundFn);
  deleteEventBoundFn = null;
}

let selectedDay = null;

function openNewModal(dayForEvent) {
  newEventModal.style.display = "block";

  backDrop.style.display = "block";

  selectedDay = dayForEvent;
}

function closeNewModal() {
  eventTitleInput.classList.remove("error");
  newEventModal.style.display = "none";
  backDrop.style.display = "none";
  eventTitleInput.value = "";
  eventTimeInput.value = "";
  eventDescriptionInput.value = "";
}

function saveEditEvent() {
  // TODO: Write this, chat gpt
  if (editEventTitleInput.value && editEventTimeInput.value) {
    editEventTitleInput.classList.remove("error");

    const updatedEvent = {
      ...eventForEdit,
      title: editEventTitleInput.value,
      time: editEventTimeInput.value,
      description: editEventDescriptionInput.value,
    };

    events = events.map((event) =>
      event.id === eventForEdit.id ? updatedEvent : event
    );

    localStorage.setItem("events", JSON.stringify(events));
    closeEditModal();
    generateCalender();
  } else {
    alert("Please enter title and time");
  }
}

function saveEvent() {
  if (eventTitleInput.value && eventTimeInput.value) {
    eventTitleInput.classList.remove("error");

    generateUUIDv4()
      .then((id) => {
        events.push({
          id,
          date: selectedDay,
          title: eventTitleInput.value,
          time: eventTimeInput.value,
          description: eventDescriptionInput.value,
        });

        localStorage.setItem("events", JSON.stringify(events));
        closeNewModal();
        generateCalender();
      })
      .catch((e) => {
        alert(e);
      });
  } else {
    alert("Please enter title and time");
  }
}

function deleteEvent(eventForDay) {
  events = events.filter((e) => e.id !== eventForDay.id);
  localStorage.setItem("events", JSON.stringify(events));
  closeDetailModal();
  generateCalender();
}

function convertTime(time) {
  const timeArray = time.split(":");
  const hours = timeArray[0];
  const minutes = timeArray[1];
  const amPm = hours >= 12 ? "PM" : "AM";
  const newHours = hours % 12 || 12;
  return `${newHours}:${minutes}${amPm}`;
}

function getDate() {
  // const date = new Date();

  // if (nav !== 0) {
  //   date.setMonth(date.getMonth() + nav);
  // }
  const date = nav;

  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayofMonth = new Date(year, month + 1, 0).getDate();

  const dateString = firstDayOfMonth.toLocaleDateString("en-us", {
    weekday: "long",
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });

  return {
    date,
    day,
    month,
    year,
    firstDayOfMonth,
    lastDayofMonth,
    dateString,
  };
}

function generateCalender() {
  const {
    date,
    day,
    month,
    year,
    firstDayOfMonth,
    lastDayofMonth,
    dateString,
  } = getDate();

  const paddingDays = weekdays.indexOf(dateString.split(", ")[0]);

  monthDisplay.innerText = `${date.toLocaleDateString("en-us", {
    month: "long",
  })} ${year}`;

  calendar.innerHTML = "";

  for (let i = 1; i <= paddingDays + lastDayofMonth; i++) {
    const daySquare = document.createElement("div");
    daySquare.classList.add("day");

    const dayString = `${month + 1}/${i - paddingDays}/${year}`;

    if (i > paddingDays) {
      daySquare.innerText = i - paddingDays;
      const eventsForDay = events.filter((e) => e.date === dayString);

      // if (i - paddingDays === day && nav === 0) {
      if (i - paddingDays === day && nav.getMonth() === new Date().getMonth()) {
        daySquare.id = "currentDay";
      }

      for (let eventForDay of eventsForDay) {
        if (eventForDay) {
          const eventDiv = document.createElement("div");
          eventDiv.classList.add("event");
          eventDiv.dataset.id = eventForDay.id;
          eventDiv.innerText = eventForDay.title;
          daySquare.appendChild(eventDiv);
          eventDiv.addEventListener("click", (e) => {
            e.stopPropagation();
            openDetailsModal(eventForDay);
          });
        }
      }

      daySquare.addEventListener("click", () => openNewModal(dayString));
    } else {
      daySquare.classList.add("padding");
    }

    calendar.appendChild(daySquare);
  }
}

function showToday() {
  // nav = 0;
  nav = new Date();
  generateCalender();
}

function goToDate() {
  const inputDate = new Date(dateInput.value);
  // const dateRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;

  // if (dateRegex.test(dateInput.value)) {
  if (inputDate.toString() !== "Invalid Date") {
    // nav =
    //   (inputDate.getFullYear() - new Date().getFullYear()) * 12 +
    //   inputDate.getMonth() -
    //   new Date().getMonth();
    nav = inputDate;
    generateCalender();

    monthDisplay.innerText = `${inputDate.toLocaleDateString("en-us", {
      month: "long",
    })} ${inputDate.getFullYear()}`;
    console.log(monthDisplay.innerText);
  } else {
    alert("Please enter a valid date in the format mm/dd/yyyy");
  }
}

function initButtons() {
  document.getElementById("nextButton").addEventListener("click", () => {
    // nav++;
    nav.setMonth(nav.getMonth() + 1);
    generateCalender();
  });

  document.getElementById("previousButton").addEventListener("click", () => {
    // nav--;
    nav.setMonth(nav.getMonth() - 1);
    generateCalender();
  });

  document.getElementById("saveButton").addEventListener("click", saveEvent);

  document
    .getElementById("saveEditButton")
    .addEventListener("click", saveEditEvent);

  document
    .getElementById("cancelButton")
    .addEventListener("click", closeNewModal);

  document
    .getElementById("closeButton")
    .addEventListener("click", closeDetailModal);

  document
    .getElementById("closeEditButton")
    .addEventListener("click", closeEditModal);

  document.getElementById("todayBtn").addEventListener("click", showToday);

  document.getElementById("gotoBtn").addEventListener("click", goToDate);

  document
    .getElementById("editButton")
    .addEventListener("click", openEditModal);
}

initButtons();
generateCalender();
