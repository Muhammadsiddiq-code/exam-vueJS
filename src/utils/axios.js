import axios from "axios"

const api = axios.create({
  baseURL: process.env.VUE_APP_API_URL || "https://api.kodx.uz",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const user = JSON.parse(localStorage.getItem("user"))
    if (user) {
      config.headers.authorization = `Bearer ${user.accessToken}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem("token")
      window.location.href = "/https://safo-market-login.vercel.app/"
    }
    return Promise.reject(error)
  },
)

export default api
