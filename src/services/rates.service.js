import Service from './index.js'
import authHeader from './auth.header.js'
const resource = 'api/tasas/'

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
           
            Service.get(`${resource}tasasDelete`, {params: data}, { headers: authHeader() })
                .then((response) => resolve(response.data))
                .catch((err) => reject(err))
        })
    },
    create(tasa) {
        return new Promise((resolve, reject) => {
            Service.post(resource, tasa, { headers: authHeader() })
                .then((response) => resolve(response))
                .catch(err => reject(err))
        })
    },
    read(tasa) {
        return new Promise((resolve, reject) => {
            Service.get(`${resource}/${tasa.id}`, { headers: authHeader() })
            .then(response => { 
                resolve(response)})
            .catch(err => reject(err))
        })
    },

    allTasas() {
        return new Promise((resolve, reject) => {
            Service.get(`${resource}allTasas`, { headers: authHeader() })
            .then(response => { 
                resolve(response)})
            .catch(err => reject(err))
        })
    },

    update(tasa) {
        return new Promise((resolve, reject) => {
            Service.put(`${resource}/${tasa._id}`, tasa, { headers: authHeader() })
                .then((response) => resolve(response.data))
                .catch((err) => reject(err))
        })
    },

    delete(tasaId) {
        return new Promise((resolve, reject) => {
            Service.delete(`${resource}${tasaId}`, { headers: authHeader() })
                .then((response) => resolve(response.data))
                .catch((err) => reject(err))
        })
    },
}
