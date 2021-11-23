import { html, render } from '../node_modules/lit-html/lit-html.js';
import { until } from '../node_modules/lit-html/directives/until.js';

export {
    html,
    render,
    until
};

const host = 'http://localhost:3030/jsonstore/collections/';

async function request(url, method = 'get', data) {
    const options = {
        method,
        headers: {}
    };

    if (data != undefined) {
        options.headers['Content-Type'] = 'application/json';
        options.body = JSON.stringify(data);
    }

    try {
        const res = await fetch(host + url, options);

        if (res.ok == false) {
            const error = await res.json();
            throw new Error(error.message);
        }

        return res.json();
    }
    catch (error) {
        alert(error.message);
        throw error;
    }
}

export async function getBooks() {
    return request('/books');
}

export async function createBook(data) {
    return request('/books', 'post', data);
}

export async function editBook(id, data) {
    return request('/books/' + id, 'put', data);
}

export async function deleteBook(id) {
    return request('/books/' + id, 'delete');
}

export async function getById(id) {
    return request('/books/' + id);
}