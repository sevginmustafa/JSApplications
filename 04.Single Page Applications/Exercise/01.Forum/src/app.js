import { createTopic } from './dom.js';
import { showHome } from './home.js';
import { showDetails } from './details.js';
import { createTopicDetailsPage } from './dom.js';
import { createTopicComment } from './dom.js';
import { createCommentForm } from './dom.js';

showHome();

const views = { 'homeLink': showHome };

document.querySelector('nav').addEventListener('click', (event) => {
    const view = views[event.target.id];
    if (typeof view == 'function') {
        view();
    }
});

const topics = document.querySelector('.topic-container');

topics.addEventListener('click', onTopicClick);

const form = document.querySelector('form');

form.querySelector('.public').addEventListener('click', onPost);

form.querySelector('.cancel').addEventListener('click', onCancel);

getPosts();

async function onTopicClick(ev) {
    ev.preventDefault();
    const element = ev.target;

    if (element.tagName == 'H2') {
        showDetails();
        const id = element.parentElement.dataset.id;
        await getPostById(id);
        document.querySelector('.answer-comment button')
            .addEventListener('click', async (event) => createComment(event, id));
    }
}

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

    const data = { topicName, username, postText, createdOn: new Date().toLocaleString() };

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

async function getPostById(id) {
    const url = 'http://localhost:3030/jsonstore/collections/myboard/posts/' + id;

    const res = await fetch(url);

    const data = await res.json();

    const topic = document.querySelector('.theme-content');
    topic.replaceChildren(...Object.values(createTopicDetailsPage(data)));

    const comments = await getCurrentTopicComments(id);

    comments.forEach(x => {
        topic.querySelector('.comment').appendChild(createTopicComment(x));
    })

    topic.appendChild(createCommentForm());
}

async function getCurrentTopicComments(id) {
    const url = 'http://localhost:3030/jsonstore/collections/myboard/comments';

    const res = await fetch(url);

    const data = await res.json();

    return Object.values(data).filter(x => x.topicId == id);
}

async function createComment(ev, topicId) {
    ev.preventDefault();
    const commentForm = document.querySelector('.answer-comment form');

    const formData = new FormData(commentForm);

    const postText = formData.get('postText');
    const username = formData.get('username');

    try {
        if (postText == '' || username == '') {
            throw new Error('All fields are required!');
        }

        const url = 'http://localhost:3030/jsonstore/collections/myboard/comments';

        const res = await fetch(url, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ postText, username, topicId, createdOn: new Date().toLocaleString() })
        });

        const data = await res.json();

        commentForm.reset();

        document.querySelector('.comment').appendChild(createTopicComment(data))
    }
    catch (error) {
        alert(error.message);
    }
}

function onCancel(ev) {
    ev.preventDefault();
    form.reset();
}