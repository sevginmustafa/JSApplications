import { deleteFurniture, getById } from '../api/data.js';
import { html, until } from '../lib.js';
import { getUserData } from '../util.js';

const template = (furniturePromise) => html`
<div class="row space-top">
    <div class="col-md-12">
        <h1>Furniture Details</h1>
    </div>
</div>
${until(furniturePromise, html`<p>Loading&hellip;</p>`)}`;

const furnitureCard = (onDelete, furniture, isOwner) => html`
<div class="row space-top">
    <div class="col-md-4">
        <div class="card text-white bg-primary">
            <div class="card-body">
                <img src="${furniture.img}" />
            </div>
        </div>
    </div>
    <div class="col-md-4">
        <p>Make: <span>${furniture.make}</span></p>
        <p>Model: <span>${furniture.model}</span></p>
        <p>Year: <span>${furniture.year}</span></p>
        <p>Description: <span>${furniture.description}</span></p>
        <p>Price: <span>${furniture.price} $</span></p>
        <p>Material: <span>${furniture.material}</span></p>
        ${isOwner ? html`
        <div>
            <a href="/edit/${furniture._id}" class="btn btn-info">Edit</a>
            <a @click=${onDelete} href="#" class="btn btn-red">Delete</a>
        </div>`: null}
    </div>
</div>`;

export function detailsPage(ctx) {
    const id = ctx.params.id;

    ctx.render(template(loadFurnitureDetails()));

    async function loadFurnitureDetails() {
        let isOwner = false;

        const userData = getUserData();

        const furniture = await getById(id);

        if (userData && userData.id == furniture._ownerId) {
            isOwner = true;
        }

        return furnitureCard(onDelete, furniture, isOwner);
    }

    async function onDelete(event) {
        event.preventDefault();

        const confirmed = confirm('Are you sure you want to delete this furniture?');

        if (confirmed) {
            await deleteFurniture(id);
            ctx.updateUserNav();
            ctx.page.redirect('/');
        }
    }
}