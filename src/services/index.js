import axios from 'axios'
// const baseURL = 'http://localhost:8000/'
const baseURL = 'https://opta-1ff1931ce193.herokuapp.com/'
export default axios.create({ baseURL })
