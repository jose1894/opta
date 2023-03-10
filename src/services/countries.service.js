import Service from './index.js'
import authHeader from './auth.header.js'
const resource = 'api/paises/'

export default {
    index(data) {
        return new Promise((resolve, reject) => {
            Service.get(resource, {params: data}, { headers: authHeader() })
                .then((response) => resolve(response.data))
                .catch((err) => reject(err))
        })
    },
    create(pais) {
        return new Promise((resolve, reject) => {
            Service.post(resource, pais, { headers: authHeader() }).then((response) => {
                debugger
                console.log(response)
                // if (response.data.success) {
                //     localStorage.clear()
                //     return resolve(response.data.message)
                // }
            }).catch(err => reject(err))
        })
    },
    read(pais) {
        return new Promise((resolve, reject) => {
            Service.get(`${resource}/${pais.id}`, { headers: authHeader() }).then((response) => response.data)
        })
    },

    update(pais) {
        return new Promise((resolve, reject) => {
            Service.put(`${resource}/${pais.id}`, pais, { headers: authHeader() })
                .then((response) => resolve(response.data))
                .catch((err) => reject(err))
        })
    },

    delete(pais) {
        return new Promise((resolve, reject) => {
            Service.delete(`${resource}/${pais.id}`, {}, { headers: authHeader() })
                .then((response) => resolve(response.data))
                .catch((err) => reject(err))
        })
    },
}
