import { logout } from "./api/api.js";
import { getById } from "./api/data.js";
import { deleteById } from "./api/data.js";

const section = document.getElementById('detailsPage');
section.remove;

let ctx = null;

export async function showDetailsPage(ctxTarget, id) {
    ctx = ctxTarget;
    ctx.showSection(section);
    loadIdea(id);
}

async function loadIdea(id) {
    const idea = await getById(id);

    section.replaceChildren(createIdeaDetails(idea));
}

function createIdeaDetails(idea) {
    const template = document.createElement('template');

    const userData = JSON.parse(sessionStorage.getItem('userData'));

    let html = '';

    if (userData != null && userData.id == idea._ownerId) {
        html = '<a class="btn detb" href="">Delete</a>';
    }

    template.innerHTML = `<img class="det-img" src="${idea.img}" />
                        <div class="desc">
                            <h2 class="display-5">${idea.title}</h2>
                            <p class="infoType">Description:</p>
                            <p class="idea-description">${idea.description}</p>
                        </div>
                        <div class="text-center">
                            ${html}
                        </div>`;

    const deleteBtn = template.content.querySelector('.btn.detb');

    if (deleteBtn) {
        deleteBtn.addEventListener('click', onDelete);
    }

    return template.content;

    async function onDelete(event) {
        event.preventDefault();

        const confirmed = confirm('Are you sure you want to delete this idea?');

        if (confirmed) {
            await deleteById(idea._id);
            ctx.goTo('catalog');
        }
    }
}