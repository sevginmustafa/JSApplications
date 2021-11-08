function attachEvents() {
    document.getElementById('btnLoad').addEventListener('click', loadPhonebook);
    document.getElementById('btnCreate').addEventListener('click', onCreate);
    phonebook.addEventListener('click', onDelete);
    loadPhonebook();
}

const phonebook = document.getElementById('phonebook');

async function loadPhonebook() {
    const url = 'http://localhost:3030/jsonstore/phonebook';

    const response = await fetch(url);

    const data = await response.json();

    phonebook.replaceChildren(...Object.values(data).map(createItem));
}

async function createContact(contact) {
    const url = 'http://localhost:3030/jsonstore/phonebook/';

    const response = await fetch(url, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(contact)
    });

    const result = response.json();

    return result;
}

async function onCreate() {
    const person = document.getElementById('person');
    const phone = document.getElementById('phone');

    const contact = { person: person.value, phone: phone.value };

    const result = await createContact(contact);

    phonebook.appendChild(createItem(result));

    person.value = '';
    phone.value = '';
}

async function deleteContact(id) {
    const url = 'http://localhost:3030/jsonstore/phonebook/' + id;

    const response = await fetch(url, {
        method: 'delete'
    });

    const result = response.json();

    return result;
}

async function onDelete(ev) {
    const id = ev.target.dataset.id;

    if (id != undefined) {
        await deleteContact(id);
        ev.target.parentNode.remove();
    }
}

function createItem(contact) {
    const li = document.createElement('li');
    li.textContent = `${contact.person}: ${contact.phone}`;
    const btn = document.createElement('button');
    btn.textContent = 'Delete';
    btn.dataset.id = contact._id;
    li.appendChild(btn);

    return li;
}

attachEvents();