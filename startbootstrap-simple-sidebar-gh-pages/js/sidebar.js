// Sidebar toggle
const sidebarToggle = document.getElementById("sidebarToggle");
const sidebarWrapper = document.getElementById("sidebar-wrapper");

if (sidebarToggle && sidebarWrapper) {
  sidebarToggle.addEventListener("click", function() {
    if(window.innerWidth <= 768) {
      sidebarWrapper.classList.toggle("active");
    } else {
      sidebarWrapper.classList.toggle("d-none");
    }
  });
}

// Page navigation logic
function showPage(page) {
  document.querySelectorAll('.content-page').forEach(function(el) {
    el.classList.add('d-none');
  });
  document.getElementById(page).classList.remove('d-none');
  if(window.innerWidth <= 768 && sidebarWrapper) sidebarWrapper.classList.remove("active");
}

// Show/hide modals for login/register
function showLogin() {
  hideModal();
  document.getElementById('loginPage').classList.remove('d-none');
  document.body.classList.add('modal-open');
}
function showRegister() {
  hideModal();
  document.getElementById('registerPage').classList.remove('d-none');
  document.body.classList.add('modal-open');
}
function hideModal() {
  document.getElementById('loginPage').classList.add('d-none');
  document.getElementById('registerPage').classList.add('d-none');
  document.body.classList.remove('modal-open');
}

// Fake auth logic
let loggedIn = false;
function doLogin(event) {
  event.preventDefault();
  loggedIn = true;
  hideModal();
  updateAuthLinks();
  showPage('about');
}
function doRegister(event) {
  event.preventDefault();
  loggedIn = true;
  hideModal();
  updateAuthLinks();
  showPage('about');
}
function logout() {
  loggedIn = false;
  updateAuthLinks();
  // Redirect to landing page (optional)
  window.location.href = "index.html";
}
function updateAuthLinks() {
  document.getElementById('authLinks').classList.toggle('d-none', loggedIn);
  document.getElementById('logoutLink').classList.toggle('d-none', !loggedIn);
}

// On load: show login/register modal if query string present
(function() {
  const params = new URLSearchParams(window.location.search);
  if(params.get('show') === 'login') {
    showLogin();
  } else if(params.get('show') === 'register') {
    showRegister();
  }
  // Always show About page on load
  showPage('about');
  updateAuthLinks();
})();