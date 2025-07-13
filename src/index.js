import "./styles.css";
import "js-datepicker/dist/datepicker.min.css";

const { DateTime } = require("luxon");
const datepicker = require("js-datepicker");

const results = document.querySelector(".results");
const form = document.querySelector("form");
const yearInput = document.querySelector("#year");
const birthdate = document.querySelector("#birthdate");

let selectedDateLuxon = null; // Store selected date globally

// Initialize the datepicker
const picker = datepicker(birthdate, {
  formatter: (input, date, instance) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    input.value = `${day}/${month}/${year}`;
  },
  maxDate: new Date(),
  onSelect: (instance, date) => {
    selectedDateLuxon = DateTime.fromJSDate(date); // Store selected date for use in submit
  },
});

// Prevent manual typing into the date field
birthdate.addEventListener("keydown", (e) => {
  e.preventDefault();
});

// Add submit listener ONCE
form.addEventListener("submit", (e) => {
  e.preventDefault();

  if (!selectedDateLuxon) {
    results.innerHTML = `<p>Please select your birthdate first.</p>`;
    return;
  }

  const now = DateTime.now();
  const diff = now
    .diff(selectedDateLuxon, ["years", "months", "days"])
    .toObject();
  const years = Math.floor(diff.years);
  const months = Math.floor(diff.months);
  const days = Math.floor(diff.days);

  results.innerHTML = `<p>You are ${years} years, ${months} months, and ${days} days old.</p>`;
});

// Year input triggers jump in calendar
yearInput.addEventListener("input", () => {
  const year = parseInt(yearInput.value);
  if (!year || year < 1900 || year > new Date().getFullYear()) {
    results.innerHTML =
      "<p>Enter a valid year between 1900 and the current year.</p>";
    return;
  }

  const jumpDate = new Date(year, 0, 1); // Jan 1 of entered year
  picker.setDate(jumpDate, true); // false = don't set value in input
  picker.show();
});
