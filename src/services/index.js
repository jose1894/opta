import axios from 'axios'
import AuthService from './auth.service'
import { urlBack } from "@/config.js";
const baseURL = process.env.NODE_ENV === 'development' ? 
                urlBack.development.apiUrl : 
                urlBack.production.apiUrl
const Service = axios.create({ baseURL })
const user = JSON.parse(localStorage.getItem('user'))

Service.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                /*const { data } = await store.dispatch('refreshToken');
                api.defaults.headers.common.Authorization = `Bearer ${data.token}`;
                originalRequest.headers.Authorization = `Bearer ${data.token}`;*/
                return api(originalRequest);
            } catch (err) {
               await AuthService.logout(user)
               window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    },
);
export default Service;
//export default axios.create({ baseURL })
