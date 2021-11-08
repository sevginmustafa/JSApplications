window.addEventListener('load', () => {
    document.getElementById('logout').style.display = 'none';
    document.getElementById('home').classList.remove('active');
    document.getElementById('register').classList.add('active');

    const form = document.querySelector('form');
    form.addEventListener('submit', onRegister);
});

async function onRegister(ev) {
    ev.preventDefault();

    const formData = new FormData(ev.target);

    const email = formData.get('email');
    const password = formData.get('password');
    const rePass = formData.get('rePass');

    try {
        if (rePass != password) {
            throw new Error('Passwords do not match!');
        }

        const response = await fetch('http://localhost:3030/users/register', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password, rePass })
        });

        if (response.ok != true) {
            const error = await response.json();
            throw new Error(error.message);
        }

        const data = await response.json();

        const userData = {
            email: data.email,
            id: data._id,
            token: data.accessToken
        };

        sessionStorage.setItem('userData', JSON.stringify(userData));
        window.location = '/index.html';
    }
    catch (error) {
        alert(error.message);
    }
}