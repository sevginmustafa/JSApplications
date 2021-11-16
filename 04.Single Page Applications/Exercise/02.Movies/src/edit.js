import { showDetails } from "./details.js";
import { showView } from "./dom.js";

const section = document.getElementById('edit-movie');
const form = section.querySelector('form');
form.addEventListener('submit', updateMovie);
section.remove();

export function showEdit() {
    showView(section);
}

async function updateMovie(event) {
    event.preventDefault();

    const id = section.dataset.id;

    const { token } = JSON.parse(sessionStorage.getItem('userData'));
    const formData = new FormData(form);

    const title = formData.get('title').trim();
    const description = formData.get('description').trim();
    const imageUrl = formData.get('imageUrl').trim();

    const url = 'http://localhost:3030/data/movies/' + id;

    try {
        if (title == '' || description == '' || imageUrl == '') {
            throw new Error('All fields are required!');
        }

        const res = await fetch(url, {
            method: 'put',
            headers: {
                'Content-Type': 'application/json',
                'X-Authorization': token
            },
            body: JSON.stringify({ title, description, img: imageUrl })
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.message);
        }

        form.reset();
        showDetails(id);
    }
    catch (error) {
        alert(error.message);
    }
}

export async function fillEditForm() {
    const movie = await getMovieById(section.dataset.id);

    section.querySelector('[name="title"]').value = movie.title;
    section.querySelector('[name="description"]').value = movie.description;
    section.querySelector('[name="imageUrl"]').value = movie.img;
}

async function getMovieById(id) {
    const url = 'http://localhost:3030/data/movies/' + id;

    const res = await fetch(url);

    const data = await res.json();

    return data;
}
