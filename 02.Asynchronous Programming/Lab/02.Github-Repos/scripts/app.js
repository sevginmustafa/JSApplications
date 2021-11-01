async function loadRepos() {
	const repos = document.getElementById('repos');
	repos.innerHTML = '';

	try {
		const url = `https://api.github.com/users/${document.getElementById('username').value}/repos`;

		const response = await fetch(url);

		if (response.status != 200) {
			throw new Error(`${response.status} ${response.statusText}`);
		}

		const body = await response.json();

		body.forEach(repo => {
			const li = document.createElement('li');
			li.innerHTML = ` <a href="${repo.html_url}">
								${repo.full_name}
							</a>`;

			repos.appendChild(li);
		})
	}
	catch (error) {
		const li = document.createElement('li');
		li.textContent = error.message;

		repos.appendChild(li);
	}
}