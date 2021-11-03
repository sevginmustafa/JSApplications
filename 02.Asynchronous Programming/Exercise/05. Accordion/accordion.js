async function solution() {
    const main = document.getElementById('main');

    const url = 'http://localhost:3030/jsonstore/advanced/articles/list';

    const response = await fetch(url);

    const body = await response.json();

    for (const title of body) {
        const content = await getContentById(title._id);
        const div = document.createElement('div');
        div.classList.add('accordion');
        div.innerHTML = `<div class="head">
                        <span>${title.title}</span>
                        <button class="button" id="${title._id}">More</button>
                        </div>
                        <div class="extra">
                        <p>${content}</p>
                        </div>`;

        main.appendChild(div);
    };

    document.querySelectorAll('button').forEach(x => x.addEventListener('click', showMore));
}

async function getContentById(id) {
    const url = 'http://localhost:3030/jsonstore/advanced/articles/details/' + id;

    const response = await fetch(url);

    const body = await response.json();

    return body.content;
}

function showMore(ev) {
    const hiddenElement = ev.target.parentNode.parentNode.querySelector('.extra');

    if (hiddenElement.style.display == 'block') {
        hiddenElement.style.display = 'none';
        ev.target.textContent = 'More';
    }
    else {
        hiddenElement.style.display = 'block';
        ev.target.textContent = 'Less';
    }
}

solution();