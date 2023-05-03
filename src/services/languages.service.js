import Service from './index.js'
import authHeader from './auth.header.js'
const resource = 'api/idiomas/'

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
           
            Service.get(`${resource}idiomasDeleted`, {params: data}, { headers: authHeader() })
                .then((response) => resolve(response.data))
                .catch((err) => reject(err))
        })
    },
    create(language) {
        return new Promise((resolve, reject) => {
            Service.post(resource, language, { headers: authHeader() })
                .then((response) => resolve(response))
                .catch(err => reject(err))
        })
    },
    read(language) {
        return new Promise((resolve, reject) => {
            Service.get(`${resource}/${language.id}`, { headers: authHeader() })
            .then(response => { 
                resolve(response)})
            .catch(err => reject(err))
        })
    },

    allIdiomas() {
        return new Promise((resolve, reject) => {
            Service.get(`${resource}allIdiomas`, { headers: authHeader() })
            .then(response => { 
                resolve(response)})
            .catch(err => reject(err))
        })
    },

    update(language) {
        return new Promise((resolve, reject) => {
            Service.put(`${resource}/${language._id}`, language, { headers: authHeader() })
                .then((response) => resolve(response.data))
                .catch((err) => reject(err))
        })
    },

    delete(languageId) {
        return new Promise((resolve, reject) => {
            Service.delete(`${resource}${languageId}`, { headers: authHeader() })
                .then((response) => resolve(response.data))
                .catch((err) => reject(err))
        })
    },
}
