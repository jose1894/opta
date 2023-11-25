import Service from './index.js'
import authHeader from './auth.header.js'
const resource = 'api/planes'

export default {
    index() {
        return new Promise((resolve, reject) => {
            Service.get(resource, {}, { headers: authHeader() })
                .then((response) => resolve(response.data))
                .catch((err) => reject(err))
        })
    },
}