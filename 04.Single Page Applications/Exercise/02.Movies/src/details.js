import { showView } from "./dom.js";

const section = document.getElementById('movie-example');
section.remove();

export function showDetails(id) {
    showView(section);
    getMovie(id);
}

async function getMovie(id) {
    const requests = [
        fetch('http://localhost:3030/data/movies/' + id),
        fetch(`http://localhost:3030/data/likes?where=movieId%3D%22${id}%22&distinct=_ownerId&count`)
    ];

    const userData = JSON.parse(sessionStorage.getItem('userData'));
    if (userData) {
        requests.push(fetch(`http://localhost:3030/data/likes?where=movieId%3D%22${id}%22%20and%20_ownerId%3D%22${userData.id}%22`))
    }

    const [movieRes, likesRes, hasLikedRes] = await Promise.all(requests);

    const [data, likes, hasLiked] = await Promise.all([
        movieRes.json(),
        likesRes.json(),
        hasLikedRes && hasLikedRes.json()
    ]);

    section.replaceChildren(createDetails(data, likes, hasLiked));
}

function createDetails(movie, likes, hasLiked) {
    const userData = JSON.parse(sessionStorage.getItem('userData'));

    let html = '';

    if (userData) {
        if (userData.id == movie._ownerId) {
            html = `<a class="btn btn-danger" href="#">Delete</a>
                    <a class="btn btn-warning" href="#">Edit</a>`;
        }
        else {
            if (hasLiked.length > 0) {
                html = `<a id="unlikeLink" class="btn btn-primary" href="#">Unlike</a>`;
            }
            else {
                html = `<a id="likeLink" class="btn btn-primary" href="#">Like</a>`;
            }
        }
    }

    const div = document.createElement('div');
    div.classList.add('container');
    div.innerHTML = `<div class="row bg-light text-dark">
                        <h1>Movie title: ${movie.title}</h1>
                        <div class="col-md-8">
                            <img class="img-thumbnail" src="${movie.img}"
                                alt="Movie">
                        </div>
                        <div class="col-md-4 text-center">
                            <h3 class="my-3 ">Movie Description</h3>
                            <p>${movie.description}</p>
                            ${html}
                            <span class="enrolled-span">Liked ${likes}</span>
                        </div>
                    </div>`;

    const likeBtn = div.querySelector('#likeLink');
    const unlikeBtn = div.querySelector('#unlikeLink');

    if (likeBtn) {
        likeBtn.addEventListener('click', onLike);
    }
    if (unlikeBtn) {
        unlikeBtn.addEventListener('click', onUnlike);
    }

    return div;


    async function onLike() {
        const url = 'http://localhost:3030/data/likes';

        await fetch(url, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'X-Authorization': userData.token
            },
            body: JSON.stringify({
                movieId: movie._id
            })
        });

        showDetails(movie._id);
    }

    async function onUnlike() {
        const likeId = hasLiked[0]._id;

        const url = 'http://localhost:3030/data/likes/' + likeId;

        await fetch(url, {
            method: 'delete',
            headers: {
                'X-Authorization': userData.token
            }
        });

        showDetails(movie._id);
    }
}
