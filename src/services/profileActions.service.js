import Service from './index.js'
import authHeader from './auth.header.js'
const resource = 'api/accionesPerfiles'

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
            Service.get(`${resource}/accionesPerfilesDeleted`, {params: data}, { headers: authHeader() })
                .then((response) => resolve(response.data))
                .catch((err) => reject(err))
        })
    },
    create(accionPerfil) {
        return new Promise((resolve, reject) => {
            Service.post(resource, accionPerfil, { headers: authHeader() })
                .then((response) => resolve(response))
                .catch(err => reject(err))
        })
    },
    read(accionPerfil) {
        return new Promise((resolve, reject) => {
            Service.get(`${resource}/${accionPerfil.id}`, { headers: authHeader() })
            .then(response => { 
                resolve(response)})
            .catch(err => reject(err))
        })
    },

    allAccionesPerfiles() {
        return new Promise((resolve, reject) => {
            Service.get(`${resource}/allAccionesPerfiles`, { headers: authHeader() })
            .then(response => { 
                resolve(response)})
            .catch(err => reject(err))
        })
    },

    update(accionPerfil) {
        return new Promise((resolve, reject) => {
            Service.put(`${resource}/${accionPerfil._id}`, accionPerfil, { headers: authHeader() })
                .then((response) => resolve(response.data))
                .catch((err) => reject(err))
        })
    },

    restore(accionPerfilId) {
        return new Promise((resolve, reject) => {
            Service.delete(`${resource}/restore/${accionPerfilId}`, { headers: authHeader() })
                .then((response) => resolve(response.data))
                .catch((err) => reject(err))
        })
    },

    delete(accionPerfilId) {
        return new Promise((resolve, reject) => {
            Service.delete(`${resource}/${accionPerfilId}`, { headers: authHeader() })
                .then((response) => resolve(response.data))
                .catch((err) => reject(err))
        })
    },
}
