import { showHome } from "./home.js";
import { showLogin } from "./login.js";
import { showRegister } from "./register.js";
import { showEdit } from "./edit.js";

const views = {
    'homeLink': showHome,
    'loginLink': showLogin,
    'registerLink': showRegister,
    'editLink': showEdit,
};

const nav = document.querySelector('nav');

nav.addEventListener('click', (event) => {
    if (event.target.tagName == 'A') {
        const view = views[event.target.id];
        if (typeof view == 'function') {
            event.preventDefault();
            view();
        }
    }
});

document.getElementById('logoutBtn').addEventListener('click', onLogout);

showHome();

export function updateNav() {
    const userData = JSON.parse(sessionStorage.getItem('userData'));

    if (userData) {
        [...nav.querySelectorAll('.user')].forEach(x => x.style.display = 'inline-block');
        [...nav.querySelectorAll('.guest')].forEach(x => x.style.display = 'none');
        document.getElementById('welcomeMsg').textContent = `Welcome, ${userData.email}`;
    }
    else {
        [...nav.querySelectorAll('.user')].forEach(x => x.style.display = 'none');
        [...nav.querySelectorAll('.guest')].forEach(x => x.style.display = 'inline-block');
    }
}

async function onLogout(event) {
    event.preventDefault();
    event.stopImmediatePropagation();

    const { token } = JSON.parse(sessionStorage.getItem('userData'));

    const url = 'http://localhost:3030/users/logout';

    const res = await fetch(url, {
        headers: {
            'X-Authorization': token
        }
    });

    sessionStorage.removeItem('userData');
    updateNav();
    showLogin();
}