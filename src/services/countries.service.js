import Service from './index.js'
import authHeader from './auth.header.js'
const resource = 'api/paises/'

export default {
    index(data) {
        return new Promise((resolve, reject) => {
            Service.get(resource, {params: data}, { headers: authHeader() })
                .then((response) => resolve(response.data))
                .catch((err) => reject(err))
        })
    },
    create(pais) {
        return new Promise((resolve, reject) => {
            Service.post(resource, pais, { headers: authHeader() })
                .then((response) => resolve(response))
                .catch(err => reject(err))
        })
    },
    read(pais) {
        return new Promise((resolve, reject) => {
            Service.get(`${resource}/${pais.id}`, { headers: authHeader() })
            .then(response => { 
                resolve(response)})
            .catch(err => reject(err))
        })
    },

    update(pais) {
        return new Promise((resolve, reject) => {
            Service.put(`${resource}/${pais._id}`, pais, { headers: authHeader() })
                .then((response) => resolve(response.data))
                .catch((err) => reject(err))
        })
    },

    delete(paisId) {
        return new Promise((resolve, reject) => {
            Service.delete(`${resource}${paisId}`, { headers: authHeader() })
                .then((response) => resolve(response.data))
                .catch((err) => reject(err))
        })
    },

    countryActivate() {
        return new Promise((resolve, reject) => {
            Service.paisesActivosGet()
        })
    }
}
