const main = document.querySelector('main');

export function showView(section) {
    main.replaceChildren(section);
}

export function createTopic(data) {
    const div = document.createElement('div');
    div.classList.add('topic-name-wrapper');

    div.innerHTML = `<div class="topic-name">
                        <a data-id=${data._id} href="#" class="normal">
                            <h2>${data.topicName}</h2>
                        </a>
                        <div class="columns">
                            <div>
                                <p>Date: <time>${data.createdOn}</time></p>
                                <div class="nick-name">
                                    <p>Username: <span>${data.username}</span></p>
                                </div>
                            </div>
                        </div>
                    </div>`;

    return div;
}

export function createTopicDetailsPage(data) {
    const divTitle = document.createElement('div');
    divTitle.classList.add('theme-title');
    divTitle.innerHTML = `<div class="theme-title">
                            <div class="theme-name-wrapper">
                                <div class="theme-name">
                                    <h2>${data.topicName}</h2>
                                </div>
                            </div>
                            </div>`;

    const divContent = document.createElement('div');
    divContent.classList.add('comment');
    divContent.innerHTML = `<div class="header">
                            <img src="./static/profile.png" alt="avatar">
                            <p><span>${data.username}</span> posted on <time>${data.createdOn}</time></p>
                            <p class="post-content">${data.postText}</p>
                        </div>`;

    return { divTitle, divContent };
}

export function createCommentForm() {
    const div = document.createElement('div');
    div.classList.add('answer-comment');
    div.innerHTML = `<p><span>currentUser</span> comment:</p>
                        <div class="answer">
                            <form>
                                <textarea name="postText" id="comment" cols="30" rows="10"></textarea>
                                <div>
                                    <label for="username">Username <span class="red">*</span></label>
                                    <input type="text" name="username" id="username">
                                </div>
                                <button>Post</button>
                            </form>
                        </div>`;

    return div;
}

export function createTopicComment(data) {
    const divComment = document.createElement('div');
    divComment.classList.add('user-comment');
    divComment.innerHTML = `<div class="topic-name-wrapper">
                                <div class="topic-name">
                                    <p><strong>${data.username}</strong> commented on <time>${data.createdOn}</time></p>
                                    <div class="post-content">
                                        <p>${data.postText}</p>
                                    </div>
                                </div>
                            </div>`;

    return divComment;
}