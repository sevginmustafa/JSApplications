import { logout } from "./api/data.js";
import { showHomePage } from "./home.js";
import { showCatalogPage } from "./catalog.js";
import { showCreatePage } from "./create.js";
import { showLoginPage } from "./login.js";
import { showRegisterPage } from "./register.js";
import { showDetailsPage } from "./details.js";
import { showSection } from "./dom.js";

const links = {
    'homeLink': 'home',
    'getStartedLink': 'home',
    'catalogLink': 'catalog',
    'createLink': 'create',
    'loginLink': 'login',
    'registerLink': 'register'
};

const views = {
    'home': showHomePage,
    'catalog': showCatalogPage,
    'create': showCreatePage,
    'login': showLoginPage,
    'register': showRegisterPage,
    'details': showDetailsPage
};

const ctx = {
    goTo,
    showSection,
    updateNav
};

const nav = document.querySelector('nav');
nav.addEventListener('click', onNavigate);

document.getElementById('logoutBtn').addEventListener('click', async (event) => {
    event.preventDefault();
    await logout();
    goTo('home');
    updateNav();
})

goTo('home');
updateNav();

function onNavigate(event) {
    const name = links[event.target.id];

    if (name) {
        event.preventDefault();
        goTo(name);
    }
}

function goTo(name, ...params) {
    const view = views[name];

    if (typeof view == 'function') {
        view(ctx, ...params);
    }
}

function updateNav() {
    const userData = JSON.parse(sessionStorage.getItem('userData'));

    if (userData != null) {
        [...nav.querySelectorAll('.user')].forEach(x => x.style.display = 'block');
        [...nav.querySelectorAll('.guest')].forEach(x => x.style.display = 'none');
    }
    else {
        [...nav.querySelectorAll('.user')].forEach(x => x.style.display = 'none');
        [...nav.querySelectorAll('.guest')].forEach(x => x.style.display = 'block');
    }
}