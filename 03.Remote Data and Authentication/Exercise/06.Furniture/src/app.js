let userData = JSON.parse(sessionStorage.getItem('userData'));

window.addEventListener('load', () => {
    if (userData) {
        document.getElementById('logoutBtn').addEventListener('click', onLogout);
        document.getElementById('formCreate').addEventListener('submit', onCreateSubmit);
        document.getElementById('formCreate').addEventListener('submit', onCreateSubmit);
        document.getElementById('buy').addEventListener('click', buy);
        document.getElementById('allOrders').addEventListener('click', allOrders);
    }

    loadItems();
})

const table = document.querySelector('tbody');

async function buy() {

    const data = { 'order': [] };

    const inputs = table.getElementsByTagName('input');

    for (const el of inputs) {
        if (el.checked) {
            data['order'].push(el.parentElement.parentElement.dataset.id);
        }
    }

    const url = 'http://localhost:3030/data/orders';

    try {
        if (data['order'].length == 0) {
            throw new Error('Choose items to buy!');
        }

        const response = await fetch(url, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'X-Authorization': userData.token
            },
            body: JSON.stringify(data)
        })

        if (response.ok != true) {
            const error = await response.json();
            throw new Error(error.message);
        }

        window.location.reload();
    }
    catch (error) {
        alert(error.message);
    }


}

async function allOrders() {
    if (!userData) {
        window.location = '/homelogged.html';
        return;
    }

    const url = `http://localhost:3030/data/orders?where=_ownerId%3D"${userData.id}"`;

    const response = await fetch(url);

    const data = await response.json();

    const orders = await loadItems();

    const orderedItemsNames = new Set();

    let totalCost = 0;

    for (const item of data) {
        for (const orderId of item.order) {
            const currItem = orders.find(x => x._id == orderId);

            if (currItem != undefined) {
                orderedItemsNames.add(currItem.name);
                totalCost += Number(currItem.price);
            }
        }
    }

    document.querySelector('.orders')
        .innerHTML = `<p>Bought furniture: <span>${Array.from(orderedItemsNames).join(', ')}</span></p>
                        <p>Total price: <span>${totalCost} $</span></p>
                        <button id="allOrders">All orders</button>`;
}

async function loadItems() {
    const url = 'http://localhost:3030/data/furniture';

    const response = await fetch(url);

    const data = await response.json();

    table.replaceChildren(...data.map(createItem));

    return data;
}

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
    tr.dataset.id = item._id;

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