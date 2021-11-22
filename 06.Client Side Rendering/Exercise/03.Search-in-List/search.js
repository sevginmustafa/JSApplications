import { html, render } from './node_modules/lit-html/lit-html.js';
import { towns } from './towns.js';

const listTemplate = (towns) => html`
<ul>
   ${towns.map(town => html`<li class=${town.isMatch ? 'active' : ''}>${town.name}</li>`)}
</ul>`;

const allTowns = towns.map(x => ({ name: x, isMatch: false }));

const root = document.getElementById('towns');
const input = document.getElementById('searchText');
const result = document.getElementById('result');

document.querySelector('button').addEventListener('click', onSearch);

update();

function update() {
   render(listTemplate(allTowns), root);
}

function onSearch() {
   const searchText = input.value.trim().toLowerCase();
   let matches = 0;

   for (const town of allTowns) {
      if (searchText && town.name.toLowerCase().includes(searchText)) {
         town.isMatch = true;
         matches++;
      }
      else {
         town.isMatch = false;
      }
   }

   result.textContent = `${matches} matches found`;

   input.value = '';

   update();
}