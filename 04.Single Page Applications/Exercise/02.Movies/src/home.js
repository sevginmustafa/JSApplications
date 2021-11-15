import { showView } from "./dom.js";
import { showCreate } from "./create.js";
import { showDetails } from "./details.js";
import { updateNav } from "./app.js";

const section = document.getElementById('home-page');
section.querySelector('#createLink').addEventListener('click', (event) => {
    event.preventDefault();
    showCreate();
});

const catalog = document.querySelector('.card-deck.d-flex.justify-content-center');
catalog.addEventListener('click', (event) => {
    event.preventDefault();
    let target = event.target;

    if (target.tagName == 'BUTTON') {
        target = target.parentElement;
    }
    if (target.tagName == 'A') {
        const id = target.dataset.id;
        showDetails(id);
    }
});

export function showHome() {
    showView(section);
    getMovies();
    updateNav();
}

async function getMovies() {
    const url = 'http://localhost:3030/data/movies';

    const res = await fetch(url);

    const data = await res.json();

    catalog.replaceChildren(...data.map(createMovieCard));
}

function createMovieCard(movie) {
    const div = document.createElement('div');
    div.classList.add('card', 'mb-4');
    div.innerHTML = `<img class="card-img-top" src="${movie.img}"
                        alt="Card image cap" width="400">
                    <div class="card-body">
                        <h4 class="card-title">${movie.title}</h4>
                    </div>
                    <div class="card-footer">
                        <a data-id="${movie._id}" href="#">
                            <button type="button" class="btn btn-info">Details</button>
                        </a>
                    </div>`;

    return div;
}