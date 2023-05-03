import Service from './index.js'
import authHeader from './auth.header.js'
const resource = 'api/categorias'

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
           
            Service.get(`${resource}/categoriasDeleted`, {params: data}, { headers: authHeader() })
                .then((response) => resolve(response.data))
                .catch((err) => reject(err))
        })
    },
    create(category) {
        return new Promise((resolve, reject) => {
            Service.post(resource, category, { headers: authHeader() })
                .then((response) => resolve(response))
                .catch(err => reject(err))
        })
    },
    read(category) {
        return new Promise((resolve, reject) => {
            Service.get(`${resource}/${category.id}`, { headers: authHeader() })
            .then(response => { 
                resolve(response)})
            .catch(err => reject(err))
        })
    },

    allCategoris() {
        return new Promise((resolve, reject) => {
            Service.get(`${resource}/allCategorias`, { headers: authHeader() })
            .then(response => { 
                resolve(response)})
            .catch(err => reject(err))
        })
    },

    update(category) {
        return new Promise((resolve, reject) => {
            Service.put(`${resource}/${category._id}`, category, { headers: authHeader() })
                .then((response) => resolve(response.data))
                .catch((err) => reject(err))
        })
    },

    delete(categoryId) {
        return new Promise((resolve, reject) => {
            Service.delete(`${resource}/${categoryId}`, { headers: authHeader() })
                .then((response) => resolve(response.data))
                .catch((err) => reject(err))
        })
    },

    categoriasPorUnidadNegocio(unidadNegocioId) {
        return new Promise((resolve, reject) => {
            Service.get(`${resource}/categoriasPorUnidadNegocio/${unidadNegocioId}`, { headers: authHeader() })
            .then(response => { 
                resolve(response)})
            .catch(err => reject(err))
        })
    },
}
