import { createTeam } from '../api/data.js';
import { html } from '../lib.js';

const template = (onSubmit, errorMsg) => html`
<section id="create">
    <article class="narrow">
        <header class="pad-med">
            <h1>New Team</h1>
        </header>
        <form @submit=${onSubmit} id="create-form" class="main-form pad-large">
            ${errorMsg ? html`<div class="error">${errorMsg}</div>` : null}
            <label>Team name: <input type="text" name="name"></label>
            <label>Logo URL: <input type="text" name="logoUrl"></label>
            <label>Description: <textarea name="description"></textarea></label>
            <input class="action cta" type="submit" value="Create Team">
        </form>
    </article>
</section>
`;

export function createPage(ctx) {
    update();

    function update(errorMsg = '') {
        ctx.render(template(onCreate, errorMsg));
    }

    async function onCreate(event) {
        event.preventDefault();

        const formData = new FormData(event.target);

        const name = formData.get('name').trim();
        const logoUrl = formData.get('logoUrl').trim();
        const description = formData.get('description').trim();

        const team = {
            name,
            logoUrl,
            description
        };

        try {
            if (name == '' || logoUrl == '' || description == '') {
                throw new Error('All fields are required!');
            }

            if (name.length < 4) {
                throw new Error('Name must be at least 4 characters long!');
            }

            if (description.length < 10) {
                throw new Error('Description must be at least 10 characters long!');
            }

            await createTeam(team);
            ctx.page.redirect('/details');
            ctx.updateUserNav();
        }
        catch (error) {
            update(error.message);
        }
    }
}