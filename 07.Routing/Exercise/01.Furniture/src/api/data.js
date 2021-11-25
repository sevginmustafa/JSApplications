import * as api from './api.js';

export const login = api.login;
export const register = api.register;
export const logout = api.logout;

const endpoints = {
    create: '/data/catalog',
    all: '/data/catalog',
    details: '/data/catalog/',
    update: '/data/catalog/',
    delete: '/data/catalog/',
    myAll: (userId) => `/data/catalog?where=_ownerId%3D%22${userId}%22`,
};

export async function createFurniture(furniture) {
    return api.post(endpoints.create, furniture);
}

export async function getAllFurnitures() {
    return api.get(endpoints.all);
}

export async function getById(id) {
    return api.get(endpoints.details + id);
}

export async function updateFurniture(id, furniture) {
    return api.put(endpoints.update + id, furniture);
}

export async function deleteFurniture(id) {
    return api.del(endpoints.delete + id);
}

export async function getMyFurnitures(userId) {
    return api.get(endpoints.myAll(userId));
}