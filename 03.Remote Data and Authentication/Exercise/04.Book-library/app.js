window.addEventListener('load', () => {
    document.getElementById('loadBooks').addEventListener('click', loadAllBooks);
    createForm.addEventListener('submit', onSubmitCreate);
    editForm.style.display = 'none';

    loadAllBooks();
})

const books = document.querySelector('#books tbody');
books.addEventListener('click', onTableClick);
const createForm = document.getElementById('createForm');
const editForm = document.getElementById('editForm');


async function loadAllBooks() {
    const result = await request('http://localhost:3030/jsonstore/collections/books');

    books.replaceChildren(...Object.entries(result)
        .map(x => {
            const book = {
                _id: x[0],
                title: x[1].title,
                author: x[1].author,
            };

            return book;
        })
        .map(createItem));
}

async function createBook(book) {
    if (Object.values(book).some(x => x == '')) {
        throw new Error('All fields are required!');
    }

    const result = await request('http://localhost:3030/jsonstore/collections/books', {
        method: 'post',
        body: JSON.stringify(book)
    });

    return result;
}

async function onSubmitCreate(ev) {
    ev.preventDefault();

    const formData = new FormData(ev.target);

    const title = formData.get('title');
    const author = formData.get('author');

    try {
        const result = await createBook({ title, author });

        books.appendChild(createItem(result));

        ev.target.reset();
    }
    catch (error) {
        alert(error.message);
    }
}

async function editBook(id) {

}

async function onEdit(button) {
    const id = button.parentElement.dataset.id;
    const book = await getBookById(id);

    console.log(book);
}

function onTableClick(ev) {
    if (ev.target.className == 'edit') {
        createForm.style.display = 'none';
        editForm.style.display = '';
        onEdit(ev.target);
    }
    else if (ev.target.className == 'delete') {
        console.log('delete')
    }
}

async function getBookById(id) {
    const result = await request('http://localhost:3030/jsonstore/collections/books' + id);

    return result;
}

function createItem(book) {
    const tr = document.createElement('tr');

    tr.innerHTML = `<td>${book.title}</td>
                    <td>${book.author}</td>
                    <td data-id=${book._id}">
                        <button class="edit">Edit</button>
                        <button class="delete">Delete</button>
                    </td>`;

    return tr;
}

async function request(url, options) {
    if (options && options.body != undefined) {
        Object.assign(options, {
            headers: {
                'Content-Type': 'application/json'
            },
        });
    }

    const response = await fetch(url, options);

    if (response.ok != true) {
        const error = await response.json();
        alert(error.message);
        throw new Error(error.message);
    }

    const data = await response.json();

    return data;
}