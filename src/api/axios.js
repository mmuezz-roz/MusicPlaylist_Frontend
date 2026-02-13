import axios from 'axios'

// const api = axios.create({ baseURL: "http://localhost:3000" })
const api = axios.create({ baseURL: "https://melodyhub-backend.vercel.app" })

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token")

    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

export default api;