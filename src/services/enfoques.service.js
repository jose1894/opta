import Service from './index.js'
import authHeader from './auth.header.js'
const resource = 'api/enfoques/'

export default {
    index() {
        return new Promise((resolve, reject) => {
            Service.get(resource, {}, { headers: authHeader() })
                .then((response) => resolve(response.data))
                .catch((err) => reject(err))
        })
    },

    getChildren(enfoqueId) {
        return new Promise((resolve, reject) => {
            Service.get(`${resource}/getChildren/${enfoqueId}`, { headers: authHeader() })
            .then(response => { 
                resolve(response)})
            .catch(err => reject(err))
        })
    },
    /*getDelete(data) {
        return new Promise((resolve, reject) => {
           
            Service.get(`${resource}cargosDeleted`, {params: data}, { headers: authHeader() })
                .then((response) => resolve(response.data))
                .catch((err) => reject(err))
        })
    },*/
    create(enfoque) {
        return new Promise((resolve, reject) => {
            Service.post(resource, enfoque, { headers: authHeader() })
                .then((response) => resolve(response))
                .catch(err => reject(err))
        })
    },
    read(enfoqueId) {
        return new Promise((resolve, reject) => {
            Service.get(`${resource}/${enfoqueId}`, { headers: authHeader() })
            .then(response => { 
                resolve(response)})
            .catch(err => reject(err))
        })
    },

    /*allCargos() {
        return new Promise((resolve, reject) => {
            Service.get(`${resource}allCargos`, { headers: authHeader() })
            .then(response => { 
                resolve(response)})
            .catch(err => reject(err))
        })
    },*/

    update(enfoque) {
        return new Promise((resolve, reject) => {
            Service.put(`${resource}/${enfoque._id}`, enfoque, { headers: authHeader() })
                .then((response) => resolve(response.data))
                .catch((err) => reject(err))
        })
    },

    delete(enfoqueId) {
        return new Promise((resolve, reject) => {
            Service.delete(`${resource}${enfoqueId}`, { headers: authHeader() })
                .then((response) => resolve(response.data))
                .catch((err) => reject(err))
        })
    },
}
