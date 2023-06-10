import Service from './index.js'
import authHeader from './auth.header.js'
const resource = 'api/proyectos'

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
           
            Service.get(`${resource}/proyectosDeleted`, {params: data}, { headers: authHeader() })
                .then((response) => resolve(response.data))
                .catch((err) => reject(err))
        })
    },
    create(project) {
        return new Promise((resolve, reject) => {
            Service.post(resource, project, { headers: authHeader() })
                .then((response) => resolve(response))
                .catch(err => reject(err))
        })
    },
    read(project) {
        return new Promise((resolve, reject) => {
            Service.get(`${resource}/${project.id}`, { headers: authHeader() })
            .then(response => { 
                resolve(response)})
            .catch(err => reject(err))
        })
    },

    update(project) {
        return new Promise((resolve, reject) => {
            Service.put(`${resource}/${project._id}`, project, { headers: authHeader() })
                .then((response) => resolve(response.data))
                .catch((err) => reject(err))
        })
    },

    delete(projectId) {
        return new Promise((resolve, reject) => {
            Service.delete(`${resource}/${projectId}`, { headers: authHeader() })
                .then((response) => resolve(response.data))
                .catch((err) => reject(err))
        })
    },

    allProjectsGet() {
        return new Promise((resolve, reject) => {
            Service.get(`${resource}/allProyectos`, { headers: authHeader() })
            .then(response => { 
                resolve(response)})
            .catch(err => reject(err))
        })
    },

}