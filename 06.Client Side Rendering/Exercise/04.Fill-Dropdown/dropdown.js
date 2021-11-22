import { html, render } from './node_modules/lit-html/lit-html.js';

const selectTemplate = (data) => data.map(x => html`<option .value=${x._id}>${x.text}</option>`)

const root = document.getElementById('menu');

document.querySelector('form').addEventListener('submit', createData);

getData();

async function getData() {
    const url = 'http://localhost:3030/jsonstore/advanced/dropdown';

    const res = await fetch(url);

    const data = await res.json();

    render(selectTemplate(Object.values(data)), root);
}

async function createData(event) {
    event.preventDefault();

    const text = event.target.querySelector('#itemText').value.trim();

    const url = 'http://localhost:3030/jsonstore/advanced/dropdown';

    try {
        if (text == '') {
            throw new Error('Field is required!');
        }

        const res = await fetch(url, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text })
        });

        if (res.ok == false) {
            const error = await res.json();
            throw new error(error.message);
        }

        event.target.reset();

        getData();
    }
    catch (error) {
        alert(error.message);
    }
}