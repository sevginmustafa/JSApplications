function attachEvents() {
    document.getElementById('submit').addEventListener('click', createMessage);
    document.getElementById('refresh').addEventListener('click', loadMessages);

    loadMessages();
}

async function loadMessages() {
    const url = 'http://localhost:3030/jsonstore/messenger';

    const response = await fetch(url);

    const data = await response.json();

    document.getElementById('messages').value = Object.values(data).map(x => `${x.author}: ${x.content}`).join('\n');
}

async function createMessage() {
    const url = 'http://localhost:3030/jsonstore/messenger';

    const author = document.querySelector('[name="author"]');
    const content = document.querySelector('[name="content"]');

    const data = await fetch(url, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ author: author.value, content: content.value })
    });

    author.value = '';
    content.value = '';

    loadMessages();
}

attachEvents();