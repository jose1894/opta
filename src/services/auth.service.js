import Service from './index.js'
import authHeader from './auth.header.js'
const resource = 'api/auth/'

export default {
    login(user) {
        return new Promise((resolve, reject) => {
            Service.post(resource + 'login', user, { headers: authHeader() })
                .then((response) => {
                    localStorage.setItem('user', JSON.stringify(response.data))
                    return resolve(response.data)
                })
                .catch((err) => { 
                    console.log(err)
                    reject(err)
                })
        })
    },
    async logout(user) {
        return new Promise((resolve, reject) => {
            Service.post(resource + 'logout', user, { headers: authHeader() }).then((response) => {
                if (response.data.success) {                   
                    localStorage.clear() 
                    return resolve(response.data.message)
                }
            })
        })
    },
    async getUserInf() {
        return await Service.get(resource + 'user', { headers: authHeader() }).then((response) => {
            localStorage.setItem('userNane', JSON.stringify(response.data))
            return response.data
        })
    },

    register(user) {
        return new Promise((resolve, reject) => {
            Service.post(resource + 'register', user, { headers: authHeader() })
                .then((response) => {
                    if (response.data.status) {
                        localStorage.setItem('user', JSON.stringify(response.data))
                    }
                    return resolve(response.data)
                })
                .catch((err) => reject(err))
        })
    },
}
