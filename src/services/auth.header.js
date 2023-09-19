export default function authHeader(file=false) {
    const user = JSON.parse(localStorage.getItem('user'))
    if (user && user.accessToken) {
        return {
            Accept: 'application/json',
            'Content-Type': file === false ? 'application/json' : 'multipart/form-data',
            'x-token': user.accessToken,
        }
    } else {
        return {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        }
    }
}
