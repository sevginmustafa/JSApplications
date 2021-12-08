import { getTeamById, getTeamMembers, getTeamMemberships } from '../api/data.js';
import { html } from '../lib.js';

const template = (team, membershipRequests) => html`
<section id="team-home">
    <article class="layout">
        <img src="${team.logoUrl}" class="team-logo left-col">
        <div class="tm-preview">
            <h2>${team.name}</h2>
            <p>${team.description}</p>
            <span class="details">${team.membersCount} Members</span>
            <div>
                <a href="#" class="action">Edit team</a>
                <a href="#" class="action">Join team</a>
                <a href="#" class="action invert">Leave team</a>
                Membership pending. <a href="#">Cancel request</a>
            </div>
        </div>
        <div class="pad-large">
            <h3>Members</h3>
            <ul class="tm-members">
                <li>My Username</li>
                <li>James<a href="#" class="tm-control action">Remove from team</a></li>
                <li>Meowth<a href="#" class="tm-control action">Remove from team</a></li>
            </ul>
        </div>
        <div class="pad-large">
            <h3>Membership Requests</h3>
            <ul class="tm-members">
                ${membershipRequests.map(membershipCard)}
            </ul>
        </div>
    </article>
</section>
`;

const memberCard = (membership) => html`
<li>James
    <a href="#" class="tm-control action">Remove from team</a>
</li>`;

const membershipCard = (membership) => html`
<li>John
    <a href="#" class="tm-control action">Approve</a>
    <a href="#" class="tm-control action">Decline</a>
</li>`;

export async function detailsPage(ctx) {
    const teamId = ctx.params.id;
    const team = await getTeamById(teamId);
    const allMembers = await getTeamMembers(team._id);
    
    const members

    const membershipRequests = await getTeamMemberships(teamId);
    console.log(membershipRequests)

    ctx.render(template(team, membershipRequests));
}