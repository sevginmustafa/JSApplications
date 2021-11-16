import { showView } from "./dom.js";
import { showHome } from "./home.js";

const section = document.getElementById('add-movie');
const form = section.querySelector('form');
form.addEventListener('submit', createMovie);
section.remove();

export function showCreate() {
    showView(section);
}

async function createMovie(event) {
    event.preventDefault();

    const { token } = JSON.parse(sessionStorage.getItem('userData'));

    const formData = new FormData(form);

    const title = formData.get('title').trim();
    const description = formData.get('description').trim();
    const imageUrl = formData.get('imageUrl').trim();

    const url = 'http://localhost:3030/data/movies';

    try {
        if (title == '' || description == '' || imageUrl == '') {
            throw new Error('All fields are required!');
        }

        const res = await fetch(url, {
            method: 'post',
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
        showHome();
    }
    catch (error) {
        alert(error.message);
    }
}