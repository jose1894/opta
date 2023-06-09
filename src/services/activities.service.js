import Service from './index.js'
import authHeader from './auth.header.js'
const resource = 'api/actividades/'

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
           
            Service.get(`${resource}actividadesDeleted`, {params: data}, { headers: authHeader() })
                .then((response) => resolve(response.data))
                .catch((err) => reject(err))
        })
    },
    create(activity) {
        return new Promise((resolve, reject) => {
            Service.post(resource, activity, { headers: authHeader() })
                .then((response) => resolve(response))
                .catch(err => reject(err))
        })
    },
    read(activity) {
        return new Promise((resolve, reject) => {
            Service.get(`${resource}/${activity.id}`, { headers: authHeader() })
            .then(response => { 
                resolve(response)})
            .catch(err => reject(err))
        })
    },

    allActividades() {
        return new Promise((resolve, reject) => {
            Service.get(`${resource}allActividades`, { headers: authHeader() })
            .then(response => { 
                resolve(response)})
            .catch(err => reject(err))
        })
    },

    update(activity) {
        return new Promise((resolve, reject) => {
            Service.put(`${resource}/${activity._id}`, activity, { headers: authHeader() })
                .then((response) => resolve(response.data))
                .catch((err) => reject(err))
        })
    },

    delete(activityId) {
        return new Promise((resolve, reject) => {
            Service.delete(`${resource}${activityId}`, { headers: authHeader() })
                .then((response) => resolve(response.data))
                .catch((err) => reject(err))
        })
    },
}
