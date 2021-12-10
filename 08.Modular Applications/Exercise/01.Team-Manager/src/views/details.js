import { cancelMembershipRequest, getTeamById, getTeamMemberships, sendMembershipRequest } from '../api/data.js';
import { html } from '../lib.js';
import { getUserData } from '../util.js';

const template = (team, isOwner, isMember, isPending, members, pendings, onRequest, onCancel) => html`
<section id="team-home">
    <article class="layout">
        <img src="${team.logoUrl}" class="team-logo left-col">
        <div class="tm-preview">
            <h2>${team.name}</h2>
            <p>${team.description}</p>
            <span class="details">${team.membersCount} Members</span>
            <div>
                ${isOwner ? html`<a href="#" class="action">Edit team</a>` : html`${isMember ? html`<a href="#"
                    class="action invert">Leave team</a>` : html` ${!getUserData() ? null : html`${!isPending ? html`<a
                    @click=${onRequest} href="#" class="action"> Join
                    team</a>` : html`Membership pending. <a @click=${onCancel} href="#"> Cancel request</a>`}`}`}`}
            </div>
        </div>
        <div class="pad-large">
            <h3>Members</h3>
            <ul class="tm-members">
                ${members.map(x => memberCard(x, isOwner))}
            </ul>
        </div>
        ${isOwner ? html`
        <div class="pad-large">
            <h3>Membership Requests</h3>
            <ul class="tm-members">
                ${pendings.map(x => pendingCard(x, isOwner))}
            </ul>
        </div>`: null}

    </article>
</section>
`;

const memberCard = (member, isOwner) => html`
<li>${member.user.username}
    ${isOwner ? html`<a href="#" class="tm-control action">Remove from team</a>` : null}
</li>`;

const pendingCard = (pending) => html`
<li>${pending.user.username}
    <a href="#" class="tm-control action">Approve</a>
    <a href="#" class="tm-control action">Decline</a>
</li>`;

export async function detailsPage(ctx) {
    const userData = getUserData();

    const teamId = ctx.params.id;
    const team = await getTeamById(teamId);

    const allMembers = await getTeamMemberships(teamId);
    const members = allMembers.filter(x => x.status == 'member');
    const pendings = allMembers.filter(x => x.status == 'pending');

    const isOwner = userData && userData.id == team._ownerId;
    const isMember = userData && members.some(x => x._ownerId == userData.id);
    const isPending = userData && pendings.some(x => x._ownerId == userData.id);

    team['membersCount'] = members.length;

    console.log(pendings)

    ctx.render(template(team, isOwner, isMember, isPending, members, pendings, onRequest, onCancel));

    async function onRequest(event) {
        event.preventDefault();

        await sendMembershipRequest({ teamId });
        ctx.page.redirect(teamId);
    }

    async function onCancel(event) {
        event.preventDefault();
        const requestId = pendings.find(x => x._ownerId == userData.id)._id;

        await cancelMembershipRequest(requestId);
        ctx.page.redirect(teamId);
    }
}