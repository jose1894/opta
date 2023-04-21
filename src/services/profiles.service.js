import Service from './index.js'
import authHeader from './auth.header.js'
const resource = 'api/perfiles'

export default {
    index(data) {
        return new Promise((resolve, reject) => {
            Service.get(resource, {params: data}, { headers: authHeader() })
                .then((response) => resolve(response.data))
                .catch((err) => reject(err))
        })
    },
    getDelete(data) {
        return new Promise((resolve, reject) => {           
            Service.get(`${resource}/perfilesDeleted`, {params: data}, { headers: authHeader() })
                .then((response) => resolve(response.data))
                .catch((err) => reject(err))
        })
    },
    create(perfil) {
        return new Promise((resolve, reject) => {
            Service.post(resource, perfil, { headers: authHeader() })
                .then((response) => resolve(response))
                .catch(err => reject(err))
        })
    },
    read(perfil) {
        return new Promise((resolve, reject) => {
            Service.get(`${resource}/${perfil.id}`, { headers: authHeader() })
            .then(response => { 
                resolve(response)})
            .catch(err => reject(err))
        })
    },

    allPerfiles() {
        return new Promise((resolve, reject) => {
            Service.get(`${resource}/allPerfiles`, { headers: authHeader() })
            .then(response => { 
                resolve(response)})
            .catch(err => reject(err))
        })
    },

    update(perfil) {
        return new Promise((resolve, reject) => {
            Service.put(`${resource}/${perfil._id}`, perfil, { headers: authHeader() })
                .then((response) => resolve(response.data))
                .catch((err) => reject(err))
        })
    },

    delete(perfilId) {
        return new Promise((resolve, reject) => {
            Service.delete(`${resource}/${perfilId}`, { headers: authHeader() })
                .then((response) => resolve(response.data))
                .catch((err) => reject(err))
        })
    },
}