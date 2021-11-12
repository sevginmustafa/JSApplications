import { showView } from './dom.js';

const section = document.getElementById('details-page');
section.remove();

export function showDetails(id) {
    showView(section);
}