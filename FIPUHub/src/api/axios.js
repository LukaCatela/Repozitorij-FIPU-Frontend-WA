import axios from 'axios'

const api_axios = axios.create({ baseURL: 'http://localhost:3000' })

export default api_axios
