import Service from './index.js'
import authHeader from './auth.header.js'
const resource = 'api/personasProyectos/'

export default {
    create(personasProyectos) {
        return new Promise((resolve, reject) => {
            Service.post(resource, personasProyectos, { headers: authHeader() })
                .then((response) => resolve(response))
                .catch(err => reject(err))
        })
    },
    read(personasProyectos) {
        return new Promise((resolve, reject) => {
            Service.get(`${resource}/${personasProyectos._id}`, { headers: authHeader() })
            .then(response => { 
                resolve(response)})
            .catch(err => reject(err))
        })
    },
    update(personasProyectos) {
        return new Promise((resolve, reject) => {
            Service.put(`${resource}/${personasProyectos._id}`, personasProyectos, { headers: authHeader() })
                .then((response) => resolve(response.data))
                .catch((err) => reject(err))
        })
    },

    delete(dataDelete) {
        return new Promise((resolve, reject) => {
            Service.delete(`${resource}${dataDelete.id}/${dataDelete.personaId}`, { headers: authHeader() })
                .then((response) => resolve(response.data))
                .catch((err) => reject(err))
        })
    },

    restore(personaId) {
        return new Promise((resolve, reject) => {
            Service.delete(`${resource}/restore/${personaId}`, { headers: authHeader() })
                .then((response) => resolve(response.data))
                .catch((err) => reject(err))
        })
    },
}
