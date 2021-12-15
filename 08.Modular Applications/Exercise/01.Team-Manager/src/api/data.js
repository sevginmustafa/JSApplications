import * as api from './api.js';

export const login = api.login;
export const register = api.register;
export const logout = api.logout;

const endpoints = {
    allTeams: '/data/teams',
    create: '/data/teams',
    request: '/data/members',
    cancelRequest: '/data/members/',
    approveRequest: '/data/members/',
    edit: '/data/teams/',
    details: '/data/teams/',
    membersCount: (teamId) => `/data/members?where=${encodeURIComponent(`teamId IN ("${teamId}") AND status="member"`)}&count`,
    allMemberships: (teamId) => `/data/members?where=teamId%3D%22${teamId}%22&load=user%3D_ownerId%3Ausers`,
    userTeams: (userId) => `/data/members?where=_ownerId%3D%22${userId}%22%20AND%20status%3D%22member%22&load=team%3DteamId%3Ateams`
};

export async function getAllTeams() {
    return api.get(endpoints.allTeams);
}

export async function getTeamById(teamId) {
    return api.get(endpoints.details + teamId);
}

export async function getMembersCount(teamId) {
    return api.get(endpoints.membersCount(teamId))
}

export async function getTeamMemberships(teamId) {
    return api.get(endpoints.allMemberships(teamId))
}

export async function getUserTeams(userId) {
    return api.get(endpoints.userTeams(userId))
}

export async function createTeam(team) {
    return await api.post(endpoints.create, team);
}

export async function sendMembershipRequest(teamId) {
    return await api.post(endpoints.request, teamId);
}

export async function cancelMembershipRequest(requestId) {
    await api.del(endpoints.cancelRequest + requestId);
}

export async function approveMembershipRequest(requestId, data) {
    await api.put(endpoints.approveRequest + requestId, data);
}

export async function editTeam(teamId, team) {
    await api.put(endpoints.edit + teamId, team);
}
