import Service from './index.js'
import authHeader from './auth.header.js'
const resource = 'api/menu'

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
            Service.get(`${resource}/menuDeleted`, {params: data}, { headers: authHeader() })
                .then((response) => resolve(response.data))
                .catch((err) => reject(err))
        })
    },
    create(menu) {
        return new Promise((resolve, reject) => {
            Service.post(resource, menu, { headers: authHeader() })
                .then((response) => resolve(response))
                .catch(err => reject(err))
        })
    },
    read(menu) {
        return new Promise((resolve, reject) => {
            Service.get(`${resource}/${menu.id}`, { headers: authHeader() })
            .then(response => { 
                resolve(response)})
            .catch(err => reject(err))
        })
    },

    allMenu() {
        return new Promise((resolve, reject) => {
            Service.get(`${resource}/allMenu`, { headers: authHeader() })
            .then(response => { 
                resolve(response)})
            .catch(err => reject(err))
        })
    },

    update(menu) {
        return new Promise((resolve, reject) => {
            Service.put(`${resource}/${menu._id}`, menu, { headers: authHeader() })
                .then((response) => resolve(response.data))
                .catch((err) => reject(err))
        })
    },

    delete(menuId) {
        return new Promise((resolve, reject) => {
            Service.delete(`${resource}/${menuId}`, { headers: authHeader() })
                .then((response) => resolve(response.data))
                .catch((err) => reject(err))
        })
    },
}
