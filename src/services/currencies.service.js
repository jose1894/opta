import Service from './index.js'
import authHeader from './auth.header.js'
const resource = 'api/monedas'

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
            Service.get(`${resource}/monedasDelete`, {params: data}, { headers: authHeader() })
                .then((response) => resolve(response.data))
                .catch((err) => reject(err))
        })
    },
    create(moneda) {
        return new Promise((resolve, reject) => {
            Service.post(resource, moneda, { headers: authHeader() })
                .then((response) => resolve(response))
                .catch(err => reject(err))
        })
    },
    read(moneda) {
        return new Promise((resolve, reject) => {
            Service.get(`${resource}/${moneda.id}`, { headers: authHeader() })
            .then(response => { 
                resolve(response)})
            .catch(err => reject(err))
        })
    },

    allCurrencies() {
        return new Promise((resolve, reject) => {
            Service.get(`${resource}/allMonedas`, { headers: authHeader() })
            .then(response => { 
                resolve(response)})
            .catch(err => reject(err))
        })
    },

    update(moneda) {
        return new Promise((resolve, reject) => {
            Service.put(`${resource}/${moneda._id}`, moneda, { headers: authHeader() })
                .then((response) => resolve(response.data))
                .catch((err) => reject(err))
        })
    },

    delete(monedaId) {
        return new Promise((resolve, reject) => {
            Service.delete(`${resource}/${monedaId}`, { headers: authHeader() })
                .then((response) => resolve(response.data))
                .catch((err) => reject(err))
        })
    },

    restore(monedaId) {
        return new Promise((resolve, reject) => {
            Service.delete(`${resource}/restore/${monedaId}`, { headers: authHeader() })
                .then((response) => resolve(response.data))
                .catch((err) => reject(err))
        })
    },
}
