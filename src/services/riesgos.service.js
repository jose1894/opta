import Service from './index.js'
import authHeader from './auth.header.js'
const resource = 'api/riesgos/'

export default {
    index(data) {
        return new Promise((resolve, reject) => {
            Service.get(resource, {params: data}, { headers: authHeader() })
                .then((response) => resolve(response.data))
                .catch((err) => reject(err))
        })
    },
    /*getDelete(data) {
        return new Promise((resolve, reject) => {
           
            Service.get(`${resource}profesionesDeleted`, {params: data}, { headers: authHeader() })
                .then((response) => resolve(response.data))
                .catch((err) => reject(err))
        })
    },*/
    create(riesgo) {
        return new Promise((resolve, reject) => {
            Service.post(resource, riesgo, { headers: authHeader() })
                .then((response) => resolve(response))
                .catch(err => reject(err))
        })
    },
    read(riesgo) {
        return new Promise((resolve, reject) => {
            Service.get(`${resource}/${riesgo.id}`, { headers: authHeader() })
            .then(response => { 
                resolve(response)})
            .catch(err => reject(err))
        })
    },

    update(riesgo) {
        return new Promise((resolve, reject) => {
            Service.put(`${resource}/${riesgo._id}`, riesgo, { headers: authHeader() })
                .then((response) => resolve(response.data))
                .catch((err) => reject(err))
        })
    },

    restore(riesgoId) {
        return new Promise((resolve, reject) => {
            Service.delete(`${resource}/restore/${riesgoId}`, { headers: authHeader() })
                .then((response) => resolve(response.data))
                .catch((err) => reject(err))
        })
    },

    delete(riesgoId) {
        return new Promise((resolve, reject) => {
            Service.delete(`${resource}${riesgoId}`, { headers: authHeader() })
                .then((response) => resolve(response.data))
                .catch((err) => reject(err))
        })
    },
}
