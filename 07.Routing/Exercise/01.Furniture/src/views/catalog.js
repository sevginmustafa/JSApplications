import { getAllFurnitures, getMyFurnitures } from '../api/data.js';
import { html, until } from '../lib.js';
import { getUserData } from '../util.js';

const template = (furnituresPromise, isCatalogPage) => html`
<div class="row space-top">
    <div class="col-md-12">
        ${isCatalogPage 
            ? html` 
                <h1>Welcome to Furniture System</h1>
                <p>Select furniture from the catalog to view details.</p>`
            : html`
                <h1>My Furniture</h1>
                <p>This is a list of your publications.</p>`}
    </div>
</div>
<div class="row space-top">
    ${until(furnituresPromise, html`<p>Loading&hellip;</p>`)}
</div>`;

const cardFurniture = (furniture) => html`
<div class="col-md-4">
    <div class="card text-white bg-primary">
        <div class="card-body">
            <img src="${furniture.img}" />
            <p>${furniture.description}</p>
            <footer>
                <p>Price: <span>${furniture.price} $</span></p>
            </footer>
            <div>
                <a href="/details/${furniture._id}" class="btn btn-info">Details</a>
            </div>
        </div>
    </div>
</div>`;

export function catalogPage(ctx)   {
    const isCatalogPage = ctx.pathname != '/my-furniture';
    ctx.render(template(loadFurnitures(ctx,isCatalogPage), isCatalogPage));
}

async function loadFurnitures(ctx, isCatalogPage) {
    let furnitures;

    if (!isCatalogPage) {
        const userData = getUserData();

        if (userData == null) {
            ctx.page.redirect('/');
            return;
        }

        furnitures = await getMyFurnitures(userData.id);
    }
    else {
        furnitures = await getAllFurnitures();
    }

    return furnitures.map(cardFurniture);
}