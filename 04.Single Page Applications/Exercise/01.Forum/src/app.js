import { createTopic } from './dom.js';
import { showHome } from './home.js';

showHome();

const views = { 'homeLink': showHome };

document.querySelector('nav').addEventListener('click', (event) => {
    const view = views[event.target.id];
    if (typeof view == 'function') {
        view();
    }
});

const topics = document.querySelector('.topic-container');

topics.addEventListener('click');

const form = document.querySelector('form');

form.querySelector('.public').addEventListener('click', onPost);

form.querySelector('.cancel').addEventListener('click', onCancel);

getPosts();

async function getPosts() {
    const url = 'http://localhost:3030/jsonstore/collections/myboard/posts';

    const res = await fetch(url);

    const data = await res.json();

    topics.replaceChildren(...Object.values(data).map(createTopic));
}

async function onPost(ev) {
    ev.preventDefault();

    const formData = new FormData(form);

    const topicName = formData.get('topicName').trim();
    const username = formData.get('username').trim();
    const postText = formData.get('postText').trim();
    const createdOn = new Date().toISOString();

    const data = { topicName, username, postText, createdOn };

    const url = 'http://localhost:3030/jsonstore/collections/myboard/posts';

    try {
        if (Object.values(data).some(x => x == '')) {
            throw new Error('All fields are required!');
        }

        const res = await fetch(url, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.message);
        }

        const result = await res.json();

        form.reset();
        topics.appendChild(createTopic(result));
    }
    catch (error) {
        alert(error.message);
    }
}

function onCancel(ev) {
    ev.preventDefault();
    form.reset();
}