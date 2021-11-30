import * as api from './api.js';

export const login = api.login;
export const register = api.register;
export const logout = api.logout;

const endpoints = {
    allTeams: '/data/teams',
    create: '/data/teams',
    getMembers: (teamId) => '/data/members?where=' + encodeURIComponent(`teamId IN ("${teamId}") AND status="member"`),
};


export async function getAllTeams() {
    return api.get(endpoints.allTeams);
}

export async function createTeam(team) {
    await api.post(endpoints.create, team);
}

export async function getTeamMembers(teamId) {
    return api.get(endpoints.getMembers(teamId))
}