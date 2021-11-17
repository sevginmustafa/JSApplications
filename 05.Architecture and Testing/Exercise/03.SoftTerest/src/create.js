import { createIdea } from "./api/data.js";

const section = document.getElementById('createPage');
section.remove;
const form = section.querySelector('form');
form.addEventListener('submit', onCreate);

let ctx = null;

export async function showCreatePage(ctxTarget) {
    ctx = ctxTarget;
    ctx.showSection(section);
}

async function onCreate(event) {
    event.preventDefault();

    const formData = new FormData(form);

    const title = formData.get('title').trim();
    const description = formData.get('description').trim();
    const imageURL = formData.get('imageURL').trim();

    if (!title || !description || !imageURL) {
        return alert('All fields are required!');
    }

    if (title.length < 6) {
        return alert('Title should be at least 6 characters long!');
    }

    if (description.length < 10) {
        return alert('Description should be at least 10 characters long!');
    }

    if (imageURL.length < 5) {
        return alert('ImageUrl should be at least 5 characters long!');
    }

    createIdea({ title, description, img: imageURL });

    form.reset();

    ctx.goTo('catalog');
    ctx.updateNav();
}