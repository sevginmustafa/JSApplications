import * as api from './api.js';

export const login = api.login;
export const register = api.register;
export const logout = api.logout;

const endpoints = {
    allTeams: '/data/teams',
    create: '/data/teams',
    details: '/data/teams/',
    getMembers: (teamId) => '/data/members?where=' + encodeURIComponent(`teamId IN ("${teamId}") AND status="member"`),
    getMemberships: (teamId) => `/data/members?where=teamId%3D%22${teamId}%22&load=user%3D_ownerId%3Ausers`,
};


export async function getAllTeams() {
    return api.get(endpoints.allTeams);
}

export async function getTeamById(teamId) {
    return api.get(endpoints.details + teamId);
}

export async function getTeamMembers(teamId) {
    return api.get(endpoints.getMembers(teamId))
}

export async function getTeamMemberships(teamId) {
    return api.get(endpoints.getMemberships(teamId))
}

export async function createTeam(team) {
    await api.post(endpoints.create, team);
}
