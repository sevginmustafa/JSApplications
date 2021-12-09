import { logout } from './api/api.js';
import { render, page } from './lib.js';
import { updateUserNav } from './util.js';
import { browsePage } from './views/browse.js';
import { createPage } from './views/create.js';
import { detailsPage } from './views/details.js';
import { editPage } from './views/edit.js';
import { homePage } from './views/home.js';
import { loginPage } from './views/login.js';
import { myTeamsPage } from './views/my-teams.js';
import { registerPage } from './views/register.js';

const root = document.querySelector('main');
document.getElementById('logoutBtn').addEventListener('click', onLogout);

page(decorateContext);
page('/', homePage);
page('/login', loginPage);
page('/register', registerPage);
page('/create', createPage);
page('/edit/:id', editPage);
page('/details/:id', detailsPage);
page('/browse', browsePage);
page('/my-teams', myTeamsPage);
page.redirect('/index.html', '/');

page.start();
updateUserNav();


function decorateContext(ctx, next) {
    ctx.render = (template) => render(template, root);
    ctx.updateUserNav = updateUserNav;
    next();
}

async function onLogout() {
    await logout();
    page.redirect('/');
}