import Service from './index.js'
import authHeader from './auth.header.js'
const resource = 'api/industrias/'

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
           
            Service.get(`${resource}industriasDeleted`, {params: data}, { headers: authHeader() })
                .then((response) => resolve(response.data))
                .catch((err) => reject(err))
        })
    },
    create(industria) {
        return new Promise((resolve, reject) => {
            Service.post(resource, industria, { headers: authHeader() })
                .then((response) => resolve(response))
                .catch(err => reject(err))
        })
    },
    read(industria) {
        return new Promise((resolve, reject) => {
            Service.get(`${resource}/${industria.id}`, { headers: authHeader() })
            .then(response => { 
                resolve(response)})
            .catch(err => reject(err))
        })
    },

    allIndustrias() {
        return new Promise((resolve, reject) => {
            Service.get(`${resource}allIndustrias`, { headers: authHeader() })
            .then(response => { 
                resolve(response)})
            .catch(err => reject(err))
        })
    },

    update(industria) {
        return new Promise((resolve, reject) => {
            Service.put(`${resource}/${industria._id}`, industria, { headers: authHeader() })
                .then((response) => resolve(response.data))
                .catch((err) => reject(err))
        })
    },

    delete(industriaId) {
        return new Promise((resolve, reject) => {
            Service.delete(`${resource}${industriaId}`, { headers: authHeader() })
                .then((response) => resolve(response.data))
                .catch((err) => reject(err))
        })
    },
}
