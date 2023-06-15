import Service from './index.js'
import authHeader from './auth.header.js'
const resource = 'api/cargos/'

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
           
            Service.get(`${resource}cargosDeleted`, {params: data}, { headers: authHeader() })
                .then((response) => resolve(response.data))
                .catch((err) => reject(err))
        })
    },
    create(cargo) {
        return new Promise((resolve, reject) => {
            Service.post(resource, cargo, { headers: authHeader() })
                .then((response) => resolve(response))
                .catch(err => reject(err))
        })
    },
    read(cargo) {
        return new Promise((resolve, reject) => {
            Service.get(`${resource}/${cargo.id}`, { headers: authHeader() })
            .then(response => { 
                resolve(response)})
            .catch(err => reject(err))
        })
    },

    allCargos() {
        return new Promise((resolve, reject) => {
            Service.get(`${resource}allCargos`, { headers: authHeader() })
            .then(response => { 
                resolve(response)})
            .catch(err => reject(err))
        })
    },

    update(cargo) {
        return new Promise((resolve, reject) => {
            Service.put(`${resource}/${cargo._id}`, cargo, { headers: authHeader() })
                .then((response) => resolve(response.data))
                .catch((err) => reject(err))
        })
    },

    delete(cargoId) {
        return new Promise((resolve, reject) => {
            Service.delete(`${resource}${cargoId}`, { headers: authHeader() })
                .then((response) => resolve(response.data))
                .catch((err) => reject(err))
        })
    },

    restore(cargoId) {
        return new Promise((resolve, reject) => {
            Service.delete(`${resource}restore/${cargoId}`, { headers: authHeader() })
                .then((response) => resolve(response.data))
                .catch((err) => reject(err))
        })
    },
}
