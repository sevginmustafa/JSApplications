import { getAllTeams, getTeamMembers } from '../api/data.js';
import { html, until } from '../lib.js';

const template = (teamPromise) => html`
<section id="browse">

    <article class="pad-med">
        <h1>Team Browser</h1>
    </article>

    <article class="layout narrow user">
        <div class="pad-small"><a href="#" class="action cta">Create Team</a></div>
    </article>

    ${until(teamPromise, html`<div>Loading&hellip;</div>`)}
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

export function browsePage(ctx) {
    ctx.render(template(loadTeams()));
    ctx.updateUserNav();
}

async function loadTeams() {
    const teams = await getAllTeams();

    for (let team of teams) {
        const members = await getTeamMembers(team._id);
        team['membersCount'] = members.length;
    }

    return teams.map(teamCard);
}