import Service from './index.js'
import authHeader from './auth.header.js'
const resource = 'api/sucursales'

export default {
    index(data) {
        return new Promise((resolve, reject) => {
            Service.get(resource, {params: data}, { headers: authHeader() })
                .then((response) => resolve(response.data))
                .catch((err) => reject(err))
        })
    },
    create(sucursal) {
        return new Promise((resolve, reject) => {
            Service.post(resource, sucursal, { headers: authHeader() })
                .then((response) => resolve(response))
                .catch(err => reject(err))
        })
    },
    read(sucursal) {
        return new Promise((resolve, reject) => {
            Service.get(`${resource}/${sucursal.id}`, { headers: authHeader() })
            .then(response => { 
                resolve(response)})
            .catch(err => reject(err))
        })
    },

    update(sucursal) {
        return new Promise((resolve, reject) => {
            Service.put(`${resource}/${sucursal._id}`, sucursal, { headers: authHeader() })
                .then((response) => resolve(response.data))
                .catch((err) => reject(err))
        })
    },

    delete(sucursalId) {
        return new Promise((resolve, reject) => {
            Service.delete(`${resource}/${sucursalId}`, { headers: authHeader() })
                .then((response) => resolve(response.data))
                .catch((err) => reject(err))
        })
    },

    sucursalesGet() {
        return new Promise((resolve, reject) => {
            Service.get(`${resource}/allSucursales`, { headers: authHeader() })
            .then(response => { 
                resolve(response)})
            .catch(err => reject(err))
        })
    },

}