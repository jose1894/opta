import Service from './index.js'
import authHeader from './auth.header.js'
const resource = 'api/profesiones/'

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
           
            Service.get(`${resource}profesionesDeleted`, {params: data}, { headers: authHeader() })
                .then((response) => resolve(response.data))
                .catch((err) => reject(err))
        })
    },
    create(profession) {
        return new Promise((resolve, reject) => {
            Service.post(resource, profession, { headers: authHeader() })
                .then((response) => resolve(response))
                .catch(err => reject(err))
        })
    },
    read(profession) {
        return new Promise((resolve, reject) => {
            Service.get(`${resource}/${profession.id}`, { headers: authHeader() })
            .then(response => { 
                resolve(response)})
            .catch(err => reject(err))
        })
    },

    allProfesiones() {
        return new Promise((resolve, reject) => {
            Service.get(`${resource}allProfesiones`, { headers: authHeader() })
            .then(response => { 
                resolve(response)})
            .catch(err => reject(err))
        })
    },

    update(profession) {
        return new Promise((resolve, reject) => {
            Service.put(`${resource}/${profession._id}`, profession, { headers: authHeader() })
                .then((response) => resolve(response.data))
                .catch((err) => reject(err))
        })
    },

    restore(professionId) {
        return new Promise((resolve, reject) => {
            Service.delete(`${resource}/restore/${professionId}`, { headers: authHeader() })
                .then((response) => resolve(response.data))
                .catch((err) => reject(err))
        })
    },

    delete(professionId) {
        return new Promise((resolve, reject) => {
            Service.delete(`${resource}${professionId}`, { headers: authHeader() })
                .then((response) => resolve(response.data))
                .catch((err) => reject(err))
        })
    },
}
