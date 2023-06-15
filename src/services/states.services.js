import Service from './index.js'
import authHeader from './auth.header.js'
const resource = 'api/estados/'

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
           
            Service.get(`${resource}estadosDelete`, {params: data}, { headers: authHeader() })
                .then((response) => resolve(response.data))
                .catch((err) => reject(err))
        })
    },
    create(estado) {
        return new Promise((resolve, reject) => {
            Service.post(resource, estado, { headers: authHeader() })
                .then((response) => resolve(response))
                .catch(err => reject(err))
        })
    },
    read(estado) {
        return new Promise((resolve, reject) => {
            Service.get(`${resource}/${estado.id}`, { headers: authHeader() })
            .then(response => { 
                resolve(response)})
            .catch(err => reject(err))
        })
    },

    update(estado) {
        return new Promise((resolve, reject) => {
            Service.put(`${resource}/${estado._id}`, estado, { headers: authHeader() })
                .then((response) => resolve(response.data))
                .catch((err) => reject(err))
        })
    },

    delete(estadoId) {
        return new Promise((resolve, reject) => {
            Service.delete(`${resource}${estadoId}`, { headers: authHeader() })
                .then((response) => resolve(response.data))
                .catch((err) => reject(err))
        })
    },

    restore(estadoId) {
        return new Promise((resolve, reject) => {
            Service.delete(`${resource}restore/${estadoId}`, { headers: authHeader() })
                .then((response) => resolve(response.data))
                .catch((err) => reject(err))
        })
    },

    estadosByPais(paisId) {
        return new Promise((resolve, reject) => {
            Service.get(`${resource}estadosByPais/${paisId}`, {}, { headers: authHeader() })
                .then((response) => resolve(response.data))
                .catch((err) => reject(err))
        })
    },
}
