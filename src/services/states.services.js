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

    delete(estado) {
        return new Promise((resolve, reject) => {
            Service.delete(`${resource}/${estado.id}`, {}, { headers: authHeader() })
                .then((response) => resolve(response.data))
                .catch((err) => reject(err))
        })
    },
}
