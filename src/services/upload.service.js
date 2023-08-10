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
}