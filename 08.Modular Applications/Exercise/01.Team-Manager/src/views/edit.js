import { editTeam, getTeamById } from '../api/data.js';
import { html } from '../lib.js';

const template = (team, onEdit, errorMsg) => html`
<section id="edit">
    <article class="narrow">
        <header class="pad-med">
            <h1>Edit Team</h1>
        </header>
        <form @submit=${onEdit} id="edit-form" class="main-form pad-large">
            ${errorMsg ? html`<div class="error">${errorMsg}</div>` : null}
            <label>Team name: <input type="text" name="name" .value=${team.name}></label>
            <label>Logo URL: <input type="text" name="logoUrl" .value=${team.logoUrl}></label>
            <label>Description: <textarea name="description" .value=${team.description}></textarea></label>
            <input class="action cta" type="submit" value="Save Changes">
        </form>
    </article>
</section>
`;

export async function editPage(ctx) {
    const teamId = ctx.params.id;
    const team = await getTeamById(teamId);

    update();

    function update(errorMsg = '') {
        ctx.render(template(team, onEdit, errorMsg));
    }

    async function onEdit(event) {
        event.preventDefault();

        const formData = new FormData(event.target);

        const name = formData.get('name').trim();
        const logoUrl = formData.get('logoUrl').trim();
        const description = formData.get('description').trim();
        
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

            const newTeam = {
                name,
                logoUrl,
                description
            };

            await editTeam(teamId, newTeam);
            ctx.page.redirect('/details/' + teamId);
            ctx.updateUserNav();
        }
        catch (error) {
            update(error.message);
        }
    }
}