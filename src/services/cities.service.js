import Service from './index.js'
import authHeader from './auth.header.js'
const resource = 'api/ciudades/'

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
            Service.get(`${resource}ciudadesDelete`, {params: data}, { headers: authHeader() })
                .then((response) => resolve(response.data))
                .catch((err) => reject(err))
        })
    },
    create(ciudad) {
        return new Promise((resolve, reject) => {
            Service.post(resource, ciudad, { headers: authHeader() })
                .then((response) => resolve(response))
                .catch(err => reject(err))
        })
    },
    read(ciudad) {
        return new Promise((resolve, reject) => {
            Service.get(`${resource}/${ciudad.id}`, { headers: authHeader() })
            .then(response => { 
                resolve(response)})
            .catch(err => reject(err))
        })
    },

    update(ciudad) {
        return new Promise((resolve, reject) => {
            Service.put(`${resource}/${ciudad._id}`, ciudad, { headers: authHeader() })
                .then((response) => resolve(response.data))
                .catch((err) => reject(err))
        })
    },

    delete(ciudadId) {
        return new Promise((resolve, reject) => {
            Service.delete(`${resource}${ciudadId}`, { headers: authHeader() })
                .then((response) => resolve(response.data))
                .catch((err) => reject(err))
        })
    },

    restore(ciudadId) {
        return new Promise((resolve, reject) => {
            Service.delete(`${resource}restore/${ciudadId}`, { headers: authHeader() })
                .then((response) => resolve(response.data))
                .catch((err) => reject(err))
        })
    },

    ciudadesByEstados(ciudadId) {
        return new Promise((resolve, reject) => {
            Service.get(`${resource}ciudadesByEstados/${ciudadId}`, {}, { headers: authHeader() })
                .then((response) => resolve(response.data))
                .catch((err) => reject(err))
        })
    },
}
