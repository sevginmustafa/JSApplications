window.addEventListener('load', () => {
    const form = document.getElementById('form');
    form.addEventListener('submit', onSubmit);

    loadStudentsData();
});

const results = document.querySelector('#results tbody');

async function loadStudentsData() {
    const url = 'http://localhost:3030/jsonstore/collections/students';

    const response = await fetch(url);

    const data = await response.json();

    results.replaceChildren(...Object.values(data).map(createItem));
}

async function createStudent(student) {
    const url = 'http://localhost:3030/jsonstore/collections/students';

    const response = await fetch(url, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(student)
    });

    const result = await response.json();

    return result;
}

async function onSubmit(ev) {
    ev.preventDefault();

    try {
        const formData = new FormData(ev.target);

        const data = [...formData.entries()].reduce((a, [k, v]) => Object.assign(a, { [k]: v }), {});

        if (Object.values(data).some(x => x == '')) {
            throw new Error('All field are required')
        }

        const result = await createStudent(data);

        results.appendChild(createItem(result));
        ev.target.reset();
    }
    catch (error) {
        alert(error.message);
    }
}

function createItem(student) {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${student.firstName}</td>
                    <td>${student.lastName}</td>
                    <td>${student.facultyNumber}</td>
                    <td>${student.grade}</td>`;

    return tr;
}