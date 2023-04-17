import Service from './index.js'
import authHeader from './auth.header.js'
const resource = 'api/unidadesNegocios'

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
            Service.get(`${resource}/unidadesNegocioDelete`, {params: data}, { headers: authHeader() })
                .then((response) => resolve(response.data))
                .catch((err) => reject(err))
        })
    },
    create(businessUnit) {
        return new Promise((resolve, reject) => {
            Service.post(resource, businessUnit, { headers: authHeader() })
                .then((response) => resolve(response))
                .catch(err => reject(err))
        })
    },
    read(businessUnit) {
        return new Promise((resolve, reject) => {
            Service.get(`${resource}/${businessUnit.id}`, { headers: authHeader() })
            .then(response => { 
                resolve(response)})
            .catch(err => reject(err))
        })
    },

    update(businessUnit) {
        return new Promise((resolve, reject) => {
            Service.put(`${resource}/${businessUnit._id}`, businessUnit, { headers: authHeader() })
                .then((response) => resolve(response.data))
                .catch((err) => reject(err))
        })
    },

    delete(businessUnitId) {
        return new Promise((resolve, reject) => {
            Service.delete(`${resource}/${businessUnitId}`, { headers: authHeader() })
                .then((response) => resolve(response.data))
                .catch((err) => reject(err))
        })
    },

    allBussinesUnitGet() {
        return new Promise((resolve, reject) => {
            Service.get(`${resource}/allUnidadesNegocio`, { headers: authHeader() })
            .then(response => { 
                resolve(response)})
            .catch(err => reject(err))
        })
    },

}