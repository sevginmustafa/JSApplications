window.addEventListener('load', () => {
    document.getElementById('formRegister').addEventListener('submit', onRegister);
    document.getElementById('formLogin').addEventListener('submit', onLogin);
})

async function onRegister(ev) {
    ev.preventDefault();

    const formData = new FormData(ev.target);

    const email = formData.get('email');
    const password = formData.get('password');
    const rePass = formData.get('rePass');

    const url = 'http://localhost:3030/users/register';

    try {
        if (password != rePass) {
            throw new Error('Passwords do not match!');
        }

        const response = await fetch(url, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
        });

        if (response.ok != true) {
            const error = await response.json();
            throw new Error(error.message);
        }

        const data = await response.json();

        const userData = {
            'id': data._id,
            'email': email,
            'token': data.accessToken
        };

        sessionStorage.setItem('userData', JSON.stringify(userData));

        window.location = '/homeLogged.html';
    }
    catch (error) {
        alert(error.message);
    }
}

async function onLogin(ev) {
    ev.preventDefault();

    const formData = new FormData(ev.target);

    const email = formData.get('email');
    const password = formData.get('password');

    const url = 'http://localhost:3030/users/login';

    try {
        const response = await fetch(url, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
        });

        if (response.ok != true) {
            const error = await response.json();
            throw new Error(error.message);
        }

        const data = await response.json();

        const userData = {
            'id': data._id,
            'email': email,
            'token': data.accessToken
        };

        sessionStorage.setItem('userData', JSON.stringify(userData));

        window.location = '/homeLogged.html';
    }
    catch (error) {
        alert(error.message);
    }
}