async function loadRecipes() {
    const main = document.querySelector('main');

    const url = 'http://localhost:3030/jsonstore/cookbook/recipes';

    const response = await fetch(url);

    const body = await response.json();

    main.innerHTML = '';

    Object.values(body).forEach(x => {
        const article = document.createElement('article');
        article.classList.add('preview');
        article.innerHTML = `<div class="title">
                                <h2>${x.name}</h2>
                             </div>
                                <div class="small">
                                <img src="${x.img}">
                             </div>`;
        article.addEventListener('click', () => {
            article.querySelector('h2').innerHTML = 'Loading...';
            previewRecipe(x._id, article)
        });

        main.appendChild(article);
    });
}

async function previewRecipe(id, preview) {
    const recipe = await getRecipeById(id);

    const article = document.createElement('article');

    article.innerHTML = `<h2>${recipe.name}</h2>
                         <div class="band">
                             <div class="thumb">
                                 <img src="${recipe.img}">
                             </div>
                             <div class="ingredients">
                                 <h3>Ingredients:</h3>
                                 <ul>
                                    ${recipe.ingredients.map(x => `<li>${x}</li>`).join('')}
                                 </ul>
                             </div>
                         </div>
                         <div class="description">
                             <h3>Preparation:</h3>
                                ${recipe.steps.map(x => `<p>${x}</p>`).join('')}
                         </div>`;

    preview.replaceWith(article);
}

async function getRecipeById(id) {
    const url = 'http://localhost:3030/jsonstore/cookbook/details/' + id;

    const response = await fetch(url);

    const body = await response.json();

    return body;
}

window.addEventListener('load', () => loadRecipes());