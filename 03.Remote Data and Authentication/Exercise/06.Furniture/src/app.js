let userData = JSON.parse(sessionStorage.getItem('userData'));

window.addEventListener('load', () => {
    document.getElementById('logoutBtn').addEventListener('click', onLogout);
    document.getElementById('formCreate').addEventListener('submit', onCreateSubmit);
})

const table = document.querySelector('tbody');

async function onCreateSubmit(ev) {
    ev.preventDefault();

    if (!userData) {
        window.location = '/index.html';
        return;
    }

    const formData = new FormData(ev.target);

    const data = [...formData.entries()].reduce((a, [k, v]) => Object.assign(a, { [k]: v }), {});

    const url = 'http://localhost:3030/data/furniture';

    try {
        if (Object.values(data).some(x => x == '')) {
            throw new Error('All fields are required!');
        }

        const response = await fetch(url, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'X-Authorization': userData.token
            },
            body: JSON.stringify(data)
        });

        if (response.ok != true) {
            const error = await response.json();
            throw new Error(error.message);
        }

        ev.target.reset();
        table.appendChild(createItem(data));
    }
    catch (error) {
        alert(error.message);
    }
}

async function onLogout() {
    if (!userData) {
        window.location = '/home.html';
        return;
    }

    const url = 'http://localhost:3030/users/logout';

    const reponse = await fetch(url, {
        method: 'get',
        headers: {
            'X-Authorization': userData.token
        }
    });

    if (reponse.ok) {
        sessionStorage.clear();
        window.location = '/home.html';
    }
}

function createItem(item) {
    const tr = document.createElement('tr');

    tr.innerHTML = `<td>
                        <img
                            src="${item.img}">
                    </td>
                    <td>
                        <p>${item.name}</p>
                    </td>
                    <td>
                        <p>${item.price}</p>
                    </td>
                    <td>
                        <p>${item.factor}</p>
                    </td>
                    <td>
                        <input type="checkbox" />
                    </td>`;

    return tr;
}