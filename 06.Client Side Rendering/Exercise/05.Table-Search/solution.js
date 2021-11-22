import { html, render } from './node_modules/lit-html/lit-html.js';

const listTemplate = (student) => html`
<tr class=${student.isMatch ? 'select' : ''}>
   <td>${student.info.firstName} ${student.info.lastName}</td>
   <td>${student.info.email}</td>
   <td>${student.info.course}</td>
</tr>`;

const students = (await getData()).map(x => ({ isMatch: false, 'info': x }));

const input = document.getElementById('searchField');

const root = document.querySelector('tbody');

update();

document.getElementById('searchBtn').addEventListener('click', onSearch);

async function update() {
   render(students.map(listTemplate), root);
}

async function getData() {
   const url = 'http://localhost:3030/jsonstore/advanced/table';

   const res = await fetch(url);

   const data = await res.json();

   return Object.values(data);
}

function onSearch() {
   const searchText = input.value.toLowerCase().trim();

   for (const student of students) {
      if (searchField && Object.values(student.info).some(x => x.toLowerCase().includes(searchText))) {
         student.isMatch = true;
      }
      else {
         student.isMatch = false;
      }
   }

   input.value = '';

   update();
}