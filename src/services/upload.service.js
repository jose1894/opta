import Service from './index.js'
import authHeader from './auth.header.js'
const resource = 'api/uploads/'

export default {
    create(data) {
        return new Promise((resolve, reject) => {
            Service.post(resource, data, { headers: authHeader(true)})
                .then((response) => resolve(response))
                .catch(err => reject(err))
        })
    },

    read(projectId, approacheId, data={}) {
        return new Promise((resolve, reject) => {
            Service.get(`${resource}archivoProyectoYEnfoquesGet/${projectId}/${approacheId}`, {params: data}, { headers: authHeader() })
            .then((response) => resolve(response.data))
            .catch((err) => reject(err))
        })
    },

    downloadFiled(id) {
        return new Promise((resolve, reject) => {
            Service.get(`${resource}download/${id}`,  { headers: authHeader() })
            .then((response) => resolve(response))
            .catch((err) => reject(err))
        })
    },
}