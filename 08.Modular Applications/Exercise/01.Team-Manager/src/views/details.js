import { approveMembershipRequest, cancelMembershipRequest, getTeamById, getTeamMemberships, sendMembershipRequest } from '../api/data.js';
import { html } from '../lib.js';
import { getUserData, onModal } from '../util.js';

const template = (team, isOwner, isMember, isPending, members, pendings, onRequest, onCancel, onApprove, onDecline, onLeave) => html`
<section id="team-home">
    <article class="layout">
        <img src="${team.logoUrl}" class="team-logo left-col">
        <div class="tm-preview">
            <h2>${team.name}</h2>
            <p>${team.description}</p>
            <span class="details">${team.membersCount} Members</span>
            <div>
                ${isOwner ? html`<a href="/edit/${team._id}" class="action">Edit team</a>` : html`${isMember ?
        html`<a @click=${onLeave} href="#" class="action invert">Leave team</a>` : html` ${!getUserData() ? null
            :
            html`${!isPending ? html`<a @click=${onRequest} href="#" class="action"> Join
                    team</a>` : html`Membership pending. <a @click=${onCancel} href="#"> Cancel request</a>`}`}`}`}
            </div>
        </div>
        <div class="pad-large">
            <h3>Members</h3>
            <ul class="tm-members">
                ${members.map(x => memberCard(x, isOwner, onDecline))}
            </ul>
        </div>
        ${isOwner ? html`
        <div class="pad-large">
            <h3>Membership Requests</h3>
            <ul class="tm-members">
                ${pendings.map(x => pendingCard(x, onApprove, onDecline))}
            </ul>
        </div>`: null}

    </article>
</section>
`;

const memberCard = (member, isOwner, onDecline) => html`
<li data-id="${member._id}">${member.user.username}
    ${isOwner && getUserData().username != member.user.username ? html`<a @click=${onDecline} href="#"
        class="tm-control action">Remove from
        team</a>` : null}
</li>`;

const pendingCard = (pending, onApprove, onDecline) => html`
<li data-id="${pending._id}">${pending.user.username}
    <a @click="${onApprove}" href="#" class="tm-control action">Approve</a>
    <a @click=${onDecline} href="#" class="tm-control action">Decline</a>
</li>`;

export async function detailsPage(ctx) {
    const userData = getUserData();

    const teamId = ctx.params.id;

    const [team, allMembers] = await Promise.all([
        await getTeamById(teamId),
        await getTeamMemberships(teamId)
    ]);

    const members = allMembers.filter(x => x.status == 'member');
    const pendings = allMembers.filter(x => x.status == 'pending');

    const isOwner = userData && userData.id == team._ownerId;
    const isMember = userData && members.some(x => x._ownerId == userData.id);
    const isPending = userData && pendings.some(x => x._ownerId == userData.id);

    team['membersCount'] = members.length;

    ctx.render(template(team, isOwner, isMember, isPending, members, pendings, onRequest, onCancel, onApprove, onDecline, onLeave));

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

    async function onLeave(event) {
        event.preventDefault();

        onModal('Are you sure you want to leave the team?');

        const memberId = members.find(x => x._ownerId == userData.id)._id;

        await cancelMembershipRequest(memberId);
        ctx.page.redirect(teamId);
    }

    async function onApprove(event) {
        event.preventDefault();
        const requestId = event.target.parentElement.dataset.id;

        const request = pendings.find(x => x._id == requestId);

        delete request.user;

        request.status = 'member';

        await approveMembershipRequest(requestId, request);
        ctx.page.redirect(teamId);
    }

    async function onDecline(event) {
        event.preventDefault();
        const membershipId = event.target.parentElement.dataset.id;

        await cancelMembershipRequest(membershipId);
        ctx.page.redirect(teamId);
    }
}