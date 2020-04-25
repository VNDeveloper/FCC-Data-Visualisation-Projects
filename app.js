"use strict";

import drawBarChart from "./charts/barchart.js";

// Selectors
const navLinks = document.getElementsByClassName("nav-link");

/* Event Listeners */

// nav onlick event
for (let index in navLinks) {
  if (index === "length") break;

  navLinks[index].onclick = navOnClick;
}

// Functions
/**
 * adding active class base on the the clicked nav
 */
function navOnClick() {
  let previousNav = document.getElementsByClassName("active");
  let clickOnID = this.getAttribute("href").substring(1);

  previousNav[0].classList.remove("active");
  this.classList.add("active");

  displaySection(clickOnID);
}

/**
 * determine which section to display base on current window.location.hash
 */
function displaySection(activeSectionID) {
  let chartSections = document.getElementsByTagName("section");

  for (let section of chartSections) {
    if (section.id === activeSectionID) {
      document.getElementById(section.id).classList.add("active-section");
    } else {
      document.getElementById(section.id).classList.remove("active-section");
    }
  }
}

drawBarChart();
