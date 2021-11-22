import { html, render } from './node_modules/lit-html/lit-html.js';

const root = document.getElementById('root');

document.querySelector('form').addEventListener('submit', (event) => {
    event.preventDefault();

    const towns = event.target.querySelector('#towns').value.split(',')
        .map(x => x.trim())
        .filter(x => x.length > 0);

    render(listTemplate(towns), root);

    event.target.reset();
})

const listTemplate = (towns) => html`
<ul>
    ${towns.map(x => html`<li>${x}</li>`)}
</ul>`;