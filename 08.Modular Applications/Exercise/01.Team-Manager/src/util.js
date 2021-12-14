export function getUserData() {
    return JSON.parse(sessionStorage.getItem('userData'));
}

export function setUserData(userData) {
    sessionStorage.setItem('userData', JSON.stringify(userData));
}

export function clearUserData() {
    sessionStorage.removeItem('userData');
}

export function updateUserNav() {
    const userData = getUserData();

    if (userData) {
        [...document.querySelectorAll('.user')].forEach(x => x.style.display = 'block');
        [...document.querySelectorAll('.guest')].forEach(x => x.style.display = 'none');
    }
    else {
        [...document.querySelectorAll('.user')].forEach(x => x.style.display = 'none');
        [...document.querySelectorAll('.guest')].forEach(x => x.style.display = 'block');
    }
}

const modal = document.querySelector('.overlay');
modal.addEventListener('click', onAction);

export function onModal(message) {
    modal.style.display = '';

    modal.querySelector('p').textContent = message;
}

function onAction(event) {
    event.preventDefault();

    if (event.target.tagName == 'A') {
        if (event.target.textContent == 'Yes') {
            modal.style.display = 'none';
        }
        else {
            modal.style.display = 'none';
        }
    }
}