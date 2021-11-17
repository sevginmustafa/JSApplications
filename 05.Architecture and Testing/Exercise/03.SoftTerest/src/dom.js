const main = document.querySelector('main');

export async function showSection(section) {
    main.replaceChildren(section);
}