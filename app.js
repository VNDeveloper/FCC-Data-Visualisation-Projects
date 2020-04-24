"use strict";

import drawChart from "./charts/barchart.js";

// Selectors
const nav = document.querySelector("#js-navbar-nav");
const navLinks = document.getElementsByClassName("nav-link");

/* Event Listeners */

// nav onlick event
for (let index in navLinks) {
  if (index === "length") break;

  navLinks[index].onclick = navOnClick;
}

// Functions
function navOnClick() {
  let current = document.getElementsByClassName("active");
  current[0].className = current[0].className.replace(" active", "");
  this.className += " active";
}

drawChart();
