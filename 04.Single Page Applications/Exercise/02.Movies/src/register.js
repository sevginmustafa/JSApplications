import { updateNav } from "./app.js";
import { showView } from "./dom.js";
import { showHome } from "./home.js";

const section = document.getElementById('form-sign-up');
const form = section.querySelector('form');
form.addEventListener('submit', onRegister);
section.remove();

export function showRegister() {
    showView(section);
}

async function onRegister(event) {
    event.preventDefault();

    const formData = new FormData(form);

    const email = formData.get('email').trim();
    const password = formData.get('password').trim();
    const repeatPassword = formData.get('repeatPassword').trim();

    const url = 'http://localhost:3030/users/register';

    try {
        if (password.length < 6) {
            throw new Error('Password should be at least 6 characters long!');
        }

        if (password != repeatPassword) {
            throw new Error('Passwords do not match!');
        }

        const res = await fetch(url, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.message);
        }

        const data = await res.json();

        const userData = {
            email: data.email,
            id: data._id,
            token: data.accessToken,
        };

        sessionStorage.setItem('userData', JSON.stringify(userData));
        form.reset();

        showHome();
    }
    catch (error) {
        alert(error.message)
    }
}