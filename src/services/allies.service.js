import Service from './index.js'
import authHeader from './auth.header.js'
const resource = 'api/aliados'

export default {
    index(data) {
        return new Promise((resolve, reject) => {
            Service.get(resource, {params: data}, { headers: authHeader() })
                .then((response) => resolve(response.data))
                .catch((err) => reject(err))
        })
    },
    create(aliado) {
        return new Promise((resolve, reject) => {
            Service.post(resource, aliado, { headers: authHeader() })
                .then((response) => resolve(response))
                .catch(err => reject(err))
        })
    },
    read(aliado) {
        return new Promise((resolve, reject) => {
            Service.get(`${resource}/${aliado.id}`, { headers: authHeader() })
            .then(response => { 
                resolve(response)})
            .catch(err => reject(err))
        })
    },

    update(aliado) {
        return new Promise((resolve, reject) => {
            Service.put(`${resource}/${aliado._id}`, aliado, { headers: authHeader() })
                .then((response) => resolve(response.data))
                .catch((err) => reject(err))
        })
    },

    delete(aliado) {
        return new Promise((resolve, reject) => {
            Service.delete(`${resource}/${aliado.id}`, {}, { headers: authHeader() })
                .then((response) => resolve(response.data))
                .catch((err) => reject(err))
        })
    },
}