let userData = null;

window.addEventListener('load', () => {
    userData = JSON.parse(sessionStorage.getItem('userData'));

    if (userData != null) {
        document.querySelector('.email span').textContent = userData.email;
        document.getElementById('guest').style.display = 'none';
        document.querySelector('.add').disabled = false;
    }
    else {
        document.getElementById('user').style.display = 'none';
        document.querySelector('.add').disabled = true;
    }

    document.querySelector('.load').addEventListener('click', loadData);

    document.getElementById('addForm').addEventListener('submit', onCreateSubmit);

    document.getElementById('logout').addEventListener('click', onLogout);
});

const catches = document.getElementById('catches');
catches.addEventListener('click', onClick)

function onClick(ev) {
    if (ev.target.className == 'delete') {
        onDelete(ev.target);
    }
    else if (ev.target.className == 'update') {
        console.log('clicked update')
    }
}

async function onDelete(button) {
    const id = button.dataset.id;

    await deleteCatch(id);

    button.parentNode.remove();
}

async function deleteCatch(id) {
    const url = 'http://localhost:3030/data/catches/' + id;

    try {
        const response = await fetch(url, {
            method: 'delete',
            headers: {
                'X-Authorization': userData.token
            }
        });

        if (response.ok != true) {
            const error = await response.json();
            throw new Error(error.message);
        }
    }
    catch (error) {
        alert(error.message);
    }

    const result = respone.json();

    return result;
}

async function onLogout() {
    if (!userData) {
        window.location = '/index.html';
        return;
    }

    const response = await fetch('http://localhost:3030/users/logout', {
        method: 'get',
        headers: {
            'X-Authorization': userData.token
        },
    });

    if (response.ok) {
        sessionStorage.clear();
        window.location = '/index.html';
    }
}

async function loadData() {
    const url = 'http://localhost:3030/data/catches';

    const response = await fetch(url);

    const data = await response.json();

    catches.replaceChildren(...data.map(createItem));
}

async function onCreateSubmit(ev) {
    ev.preventDefault();

    if (!userData) {
        window.location = '/index.html';
        return;
    }

    const formdData = new FormData(ev.target);

    const data = [...formdData.entries()].reduce((a, [k, v]) => Object.assign(a, { [k]: v }), {});

    try {
        if (Object.values(data).some(x => x == '')) {
            throw new Error('All fields are required!');
        }
        const response = await fetch('http://localhost:3030/data/catches', {
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
        loadData();
    }
    catch (error) {
        alert(error.message);
    }
}

function createItem(data) {
    const isOwner = userData && data._ownerId == userData.id;

    const div = document.createElement('div');
    div.classList.add('catch');
    div.innerHTML = `<label>Angler</label>
                    <input type="text" class="angler" value="${data.angler}" ${!isOwner ? 'disabled' : ''}>
                    <label>Weight</label>
                    <input type="text" class="weight" value="${data.weight}" ${!isOwner ? 'disabled' : ''}>
                    <label>Species</label>
                    <input type="text" class="species" value="${data.species}" ${!isOwner ? 'disabled' : ''}>
                    <label>Location</label>
                    <input type="text" class="location" value="${data.location}" ${!isOwner ? 'disabled' : ''}>
                    <label>Bait</label>
                    <input type="text" class="bait" value="${data.bait}" ${!isOwner ? 'disabled' : ''}>
                    <label>Capture Time</label>
                    <input type="number" class="captureTime" value="${data.captureTime}" ${!isOwner ? 'disabled' : ''}>
                    <button class="update" data-id="${data._id}" ${!isOwner ? 'disabled' : ''}>Update</button>
                    <button class="delete" data-id="${data._id}" ${!isOwner ? 'disabled' : ''}>Delete</button>`;

    return div;
}