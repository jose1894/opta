import Service from './index.js'
import authHeader from './auth.header.js'
const resource = 'api/contactos'

export default {
    delete(contactoId) {
        return new Promise((resolve, reject) => {
            Service.delete(`${resource}/${contactoId}`, { headers: authHeader() })
                .then((response) => resolve(response.data))
                .catch((err) => reject(err))
        })
    },
    /*create(contacto) {
        return new Promise((resolve, reject) => {
            Service.post(resource, contacto, { headers: authHeader() })
                .then((response) => resolve(response))
                .catch(err => reject(err))
        })
    },*/
}
