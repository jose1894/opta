import Service from './index.js'
import authHeader from './auth.header.js'
const resource = 'api/membresiaLicencias'

export default {
    getLicencia(membresia) {
        return new Promise((resolve, reject) => {
            Service.get(`${resource}/licencia/${membresia}`, { headers: authHeader() })
                .then((response) => resolve(response.data))
                .catch((err) => reject(err))
        })
    },

    create(licencia) {
        return new Promise((resolve, reject) => {
            Service.post(resource, licencia, { headers: authHeader() })
                .then((response) => resolve(response))
                .catch(err => reject(err))
        })
    },
    update(licencia) {
        return new Promise((resolve, reject) => {
            Service.put(`${resource}/${licencia._id}`, licencia, { headers: authHeader() })
                .then((response) => resolve(response.data))
                .catch((err) => reject(err))
        })
    },
    
    restore(miembroId) {
        return new Promise((resolve, reject) => {
            Service.delete(`${resource}/restore/${miembroId}`, { headers: authHeader() })
                .then((response) => resolve(response.data))
                .catch((err) => reject(err))
        })
    },

    delete(licenciaId) {
        return new Promise((resolve, reject) => {
            Service.delete(`${resource}/${licenciaId}`, { headers: authHeader() })
                .then((response) => resolve(response.data))
                .catch((err) => reject(err))
        })
    },
}