import { getAllIdeas } from "./api/data.js";

const section = document.getElementById('dashboard-holder');
section.remove;
section.addEventListener('click', onDetails);

let ctx = null;

export async function showCatalogPage(ctxTarget) {
    ctx = ctxTarget;
    ctx.showSection(section);
    loadIdeas();
}

async function onDetails(event) {
    if (event.target.tagName == 'A') {
        event.preventDefault();
        const id = event.target.dataset.id;
        ctx.goTo('details', id);
    }
}

async function loadIdeas() {
    const ideas = await getAllIdeas();

    if (ideas.length == 0) {
        const element = document.createElement('h1');
        element.textContent = 'No ideas yet! Be the first one :)';
        section.replaceChildren(element);
    }
    else {
        const fragment = document.createDocumentFragment();

        ideas.map(createIdeaCard).forEach(x => fragment.appendChild(x));

        section.replaceChildren(fragment);
    }
}

function createIdeaCard(idea) {
    const element = document.createElement('div');
    element.classList.add('card', 'overflow-hidden', 'current-card', 'details');
    element.style.width = '20rem';
    element.style.height = '18rem';

    element.innerHTML = `<div class="card-body">
                            <p class="card-text">${idea.title}</p>
                        </div>
                        <img class="card-image" src="${idea.img}" alt="Card image cap">
                        <a data-id=${idea._id} class="btn" href="">Details</a>`;

    return element;
}