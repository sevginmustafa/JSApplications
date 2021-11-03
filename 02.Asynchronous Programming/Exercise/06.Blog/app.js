async function attachEvents() {
    const loadPostsBtn = document.getElementById('btnLoadPosts');
    loadPostsBtn.addEventListener('click', loadPosts);
    
    const viewPostBtn = document.getElementById('btnViewPost');
    viewPostBtn.disabled = true;
    viewPostBtn.addEventListener('click', viewPost);
}

attachEvents();

async function loadPosts() {
    const viewPostBtn = document.getElementById('btnViewPost');
    viewPostBtn.disabled = false;

    const postsSelectEl = document.getElementById('posts');
    postsSelectEl.innerHTML = '';

    const url = 'http://localhost:3030/jsonstore/blog/posts';

    const response = await fetch(url);

    const body = await response.json();

    for (const post in body) {
        const optionEl = document.createElement('option');
        optionEl.value = post;
        optionEl.textContent = body[post].title;

        postsSelectEl.appendChild(optionEl);
    }
}

async function viewPost() {
    const postId = document.getElementById('posts').value;

    const postTitleEl = document.getElementById('post-title');
    postTitleEl.textContent = 'Loading...';
    const postBodyEl = document.getElementById('post-body');
    postBodyEl.textContent = '';
    const postCommentsUlEl = document.getElementById('post-comments');
    postCommentsUlEl.innerHTML = '';

    const [post, comments] = await Promise.all([
        await getPostById(postId),
        await getPostCommentsById(postId)
    ]);

    postTitleEl.textContent = post.title;
    postBodyEl.textContent = post.body;

    comments.forEach(x => {
        const liEl = document.createElement('li');
        liEl.textContent = x.text;
        postCommentsUlEl.appendChild(liEl);
    });
}

async function getPostCommentsById(postId) {
    const url = 'http://localhost:3030/jsonstore/blog/comments';

    const response = await fetch(url);

    const body = await response.json();

    return Object.values(body).filter(x => x.postId == postId);
}

async function getPostById(id) {
    const url = 'http://localhost:3030/jsonstore/blog/posts';

    const response = await fetch(url);

    const body = await response.json();

    return body[id];
}