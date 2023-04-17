import Service from './index.js'
import authHeader from './auth.header.js'
const resource = 'api/miembros'

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
            Service.get(`${resource}/membresiasDelete`, {params: data}, { headers: authHeader() })
                .then((response) => resolve(response.data))
                .catch((err) => reject(err))
        })
    },
    create(miembro) {
        return new Promise((resolve, reject) => {
            Service.post(resource, miembro, { headers: authHeader() })
                .then((response) => resolve(response))
                .catch(err => reject(err))
        })
    },
    read(miembro) {
        return new Promise((resolve, reject) => {
            Service.get(`${resource}/${miembro.id}`, { headers: authHeader() })
            .then(response => { 
                resolve(response)})
            .catch(err => reject(err))
        })
    },

    update(miembro) {
        return new Promise((resolve, reject) => {
            Service.put(`${resource}/${miembro._id}`, miembro, { headers: authHeader() })
                .then((response) => resolve(response.data))
                .catch((err) => reject(err))
        })
    },

    delete(menbresiaId) {
        return new Promise((resolve, reject) => {
            Service.delete(`${resource}/${menbresiaId}`, { headers: authHeader() })
                .then((response) => resolve(response.data))
                .catch((err) => reject(err))
        })
    },
}