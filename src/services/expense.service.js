import Service from './index.js'
import authHeader from './auth.header.js'
const resource = 'api/gastos'

export default {
    index(data) {
        return new Promise((resolve, reject) => {
            Service.get(resource, {params: data}, { headers: authHeader() })
                .then((response) => resolve(response.data))
                .catch((err) => reject(err))
        })
    },
    create(gasto) {
        return new Promise((resolve, reject) => {
            Service.post(resource, gasto, { headers: authHeader() })
                .then((response) => resolve(response))
                .catch(err => reject(err))
        })
    },
    read(gasto) {
        return new Promise((resolve, reject) => {
            Service.get(`${resource}/${gasto.id}`, { headers: authHeader() })
            .then(response => { 
                resolve(response)})
            .catch(err => reject(err))
        })
    },

    update(gasto) {
        return new Promise((resolve, reject) => {
            Service.put(`${resource}/${gasto._id}`, gasto, { headers: authHeader() })
                .then((response) => resolve(response.data))
                .catch((err) => reject(err))
        })
    },

    delete(gasto) {
        return new Promise((resolve, reject) => {
            Service.delete(`${resource}/${gasto.id}`, {}, { headers: authHeader() })
                .then((response) => resolve(response.data))
                .catch((err) => reject(err))
        })
    },

    sucursalesGet() {
        return new Promise((resolve, reject) => {
            Service.get(`${resource}/allGastos`, { headers: authHeader() })
            .then(response => { 
                resolve(response)})
            .catch(err => reject(err))
        })
    },

}