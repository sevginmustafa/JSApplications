import { getMembersCount, getUserTeams } from '../api/data.js';
import { html } from '../lib.js';
import { getUserData } from '../util.js';

const template = (teams) => html`
<section id="my-teams">

    <article class="pad-med">
        <h1>My Teams</h1>
    </article>

    <article class="layout narrow">
        ${teams.length == 0 ? html`
        <div class="pad-med">
            <p>You are not a member of any team yet.</p>
            <p><a href="#">Browse all teams</a> to join one, or use the button bellow to cerate your own
                team.</p>
        </div>` : null}
        <div class="${teams.length != 0 ? 'pad-small' : null}"><a href="/create" class="action cta">Create Team</a>
        </div>
    </article>
    ${teams.length != 0 ? teams.map(teamCard) : null}
</section>
`;

const teamCard = (team) => html`
<article class="layout">
    <img src="${team.logoUrl}" class="team-logo left-col">
    <div class="tm-preview">
        <h2>${team.name}</h2>
        <p>${team.description}</p>
        <span class="details">${team.membersCount} Members</span>
        <div><a href="/details/${team._id}" class="action">See details</a></div>
    </div>
</article>
`;

export async function myTeamsPage(ctx) {
    const userId = getUserData().id;

    const memberships = await getUserTeams(userId);

    const teams = memberships.map(x => x.team);

    for (let team of teams) {
        const membersCount = await getMembersCount(team._id);

        team['membersCount'] = membersCount;
    }

    ctx.render(template(teams));
}