window.addEventListener('load', () => {
    document.getElementById('logout').style.display='none';
    document.getElementById('home').classList.remove('active');
    document.getElementById('login').classList.add('active');
    
    const form = document.querySelector('form');
    form.addEventListener('submit', onLogin);
});

async function onLogin(ev) {
    ev.preventDefault();

    const formData = new FormData(ev.target);

    const email = formData.get('email');
    const password = formData.get('password');
    
    try {
        const response = await fetch('http://localhost:3030/users/login', {
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