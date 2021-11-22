import { html, render } from './node_modules/lit-html/lit-html.js';
import { cats } from './catSeeder.js';

const listTemplate = (cats) => html`
<ul>
    ${cats.map(x => html`
    <li>
        <img src="./images/${x.imageLocation}.jpg" width="250" height="250" alt="Card image cap">
        <div class="info">
            <button class="showBtn" @click=${()=> toggleInfo(x)}>${x.displayInfo  ? 'Hide':'Show'} status code</button>
            ${x.displayInfo ? html`
            <div class="status" id="${x.id}">
                <h4>Status Code: ${x.statusCode}</h4>
                <p>${x.statusMessage}</p>
            </div>`: null}
        </div>
    </li>`)}
</ul>`;

const root = document.getElementById('allCats');

cats.forEach(x => x.displayInfo = false);
update();

function update() {
    render(listTemplate(cats), root);
}

function toggleInfo(cat) {
    cat.displayInfo = !cat.displayInfo;
    update();
}