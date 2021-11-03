async function lockedProfile() {
    const main = document.getElementById('main');
    main.innerHTML = '';

    const url = 'http://localhost:3030/jsonstore/advanced/profiles';

    const response = await fetch(url);

    const body = await response.json();

    let counter = 0;

    for (const user in body) {
        counter++;
        const divProfile = document.createElement('div');
        divProfile.classList.add('profile');
        divProfile.innerHTML = `<img src="./iconProfile2.png" class="userIcon" />
            <label>Lock</label>
            <input type="radio" name="user${counter}Locked" value="lock" checked>
            <label>Unlock</label>
            <input type="radio" name="user${counter}Locked" value="unlock"><br>
            <hr>
            <label>Username</label>
            <input type="text" name="user1Username" value="${body[user].username}" disabled readonly />
            <div class="hiddenInfo">
                <hr>
                <label>Email:</label>
                <input type="email" name="user1Email" value="${body[user].email}" disabled readonly />
                <label>Age:</label>
                <input type="email" name="user1Age" value="${body[user].age}" disabled readonly />
            </div>
            <button>Show more</button>`;

        main.appendChild(divProfile);
    }

    document.querySelectorAll('button').forEach(x => x.addEventListener('click', showMore));
}

function showMore(ev) {
    const hiddeInfoField = ev.target.parentNode.querySelector('.profile div');

    if (ev.target.parentNode.querySelector('.profile input').checked == false) {
        if (hiddeInfoField.classList.contains('hiddenInfo')) {
            hiddeInfoField.classList.remove('hiddenInfo');
            ev.target.textContent = 'Hide it';
        }
        else {
            hiddeInfoField.classList.add('hiddenInfo');
            ev.target.textContent = 'Show more';
        }
    }
}