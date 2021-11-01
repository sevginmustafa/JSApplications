async function loadCommits() {
    const commits = document.getElementById('commits');
    commits.innerHTML = '';

    try {
        const url = `https://api.github.com/repos/${document.getElementById('username').value}/${document.getElementById('repo').value}/commits`;

        const response = await fetch(url);

        if (response.status != 200) {
            throw new Error(`Error: ${response.status} (Not Found)`);
        }

        const body = await response.json();

        body.forEach(commit => {
            const li = document.createElement('li');
            li.innerHTML = `${commit.commit.author.name}: ${commit.commit.message}`;

            commits.appendChild(li);
        })
    }
    catch (error) {
        const li = document.createElement('li');
        li.textContent = error.message;

        commits.appendChild(li);
    }
}