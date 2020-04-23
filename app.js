// Selectors
const nav = document.querySelector("#js-navbar-nav");
const navLinks = document.getElementsByClassName("nav-link");

/* Event Listeners */

// nav onlick event
for (let index in navLinks) {
  navLinks[index].onclick = navOnClick;
}

// Functions
function navOnClick() {
  let current = document.getElementsByClassName("active");
  current[0].className = current[0].className.replace(" active", "");
  this.className += " active";
}
