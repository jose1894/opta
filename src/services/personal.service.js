import Service from './index.js'
import authHeader from './auth.header.js'
const resource = 'api/personal/'

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
           
            Service.get(`${resource}personaDeleted`, {params: data}, { headers: authHeader() })
                .then((response) => resolve(response.data))
                .catch((err) => reject(err))
        })
    },
    create(persona) {
        return new Promise((resolve, reject) => {
            Service.post(resource, persona, { headers: authHeader() })
                .then((response) => resolve(response))
                .catch(err => reject(err))
        })
    },
    getListTipoPersonal(tipoPersonalId) {
        return new Promise((resolve, reject) => {
            Service.get(`${resource}/listTipoPersonal/${tipoPersonalId}`, { headers: authHeader() })
            .then(response => { 
                resolve(response)})
            .catch(err => reject(err))
        })
    },
    read(persona) {
        return new Promise((resolve, reject) => {
            Service.get(`${resource}/${persona.id}`, { headers: authHeader() })
            .then(response => { 
                resolve(response)})
            .catch(err => reject(err))
        })
    },

    allPersona() {
        return new Promise((resolve, reject) => {
            Service.get(`${resource}allPersona`, { headers: authHeader() })
            .then(response => { 
                resolve(response)})
            .catch(err => reject(err))
        })
    },

    searchPersona(query) {
        return new Promise((resolve, reject) => {
            Service.get(`${resource}buscarPersona/${query}`, { headers: authHeader() })
            .then(response => { 
                resolve(response)})
            .catch(err => reject(err))
        })
    },


    update(persona) {
        return new Promise((resolve, reject) => {
            Service.put(`${resource}/${persona._id}`, persona, { headers: authHeader() })
                .then((response) => resolve(response.data))
                .catch((err) => reject(err))
        })
    },

    delete(personaId) {
        return new Promise((resolve, reject) => {
            Service.delete(`${resource}${personaId}`, { headers: authHeader() })
                .then((response) => resolve(response.data))
                .catch((err) => reject(err))
        })
    },

    restore(personaId) {
        return new Promise((resolve, reject) => {
            Service.delete(`${resource}/restore/${personaId}`, { headers: authHeader() })
                .then((response) => resolve(response.data))
                .catch((err) => reject(err))
        })
    },
}
