import Service from './index.js'
import authHeader from './auth.header.js'
const resource = 'api/clientes/'


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
            Service.get(`${resource}clientesDeleted`, {params: data}, { headers: authHeader() })
                .then((response) => resolve(response.data))
                .catch((err) => reject(err))
        })
    },
    create(cliente) {
        return new Promise((resolve, reject) => {
            Service.post(resource, cliente, { headers: authHeader() })
                .then((response) => resolve(response))
                .catch(err => reject(err))
        })
    },
    read(cliente) {
        return new Promise((resolve, reject) => {
            Service.get(`${resource}/${cliente.id}`, { headers: authHeader() })
            .then(response => { 
                resolve(response)})
            .catch(err => reject(err))
        })
    },

    update(cliente) {
        return new Promise((resolve, reject) => {
            Service.put(`${resource}/${cliente._id}`, cliente, { headers: authHeader() })
                .then((response) => resolve(response.data))
                .catch((err) => reject(err))
        })
    },

    delete(clienteId) {
        return new Promise((resolve, reject) => {
            Service.delete(`${resource}${clienteId}`, { headers: authHeader() })
                .then((response) => resolve(response.data))
                .catch((err) => reject(err))
        })
    },

    restore(clienteId) {
        return new Promise((resolve, reject) => {
            Service.delete(`${resource}/restore/${clienteId}`, { headers: authHeader() })
                .then((response) => resolve(response.data))
                .catch((err) => reject(err))
        })
    },

    allClientes() {
        return new Promise((resolve, reject) => {
            Service.get(`${resource}allClientes`, { headers: authHeader() })
            .then(response => { 
                resolve(response)})
            .catch(err => reject(err))
        })
    },

    searchCliente(query) {
        return new Promise((resolve, reject) => {
            Service.get(`${resource}clienteSearch/${query}`, { headers: authHeader() })
            .then(response => { 
                resolve(response)})
            .catch(err => reject(err))
        })
    },

}
