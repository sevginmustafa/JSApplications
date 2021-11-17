import { getById } from "./api/data.js";

const section = document.getElementById('detailsPage');
section.remove;

export async function showDetailsPage(ctx, id) {
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

    return template.content;
}