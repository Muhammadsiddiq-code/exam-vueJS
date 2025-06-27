import axios from 'axios'

const api = axios.create({
  baseURL: 'https://api.kodx.uz',
  headers: {
    'Content-Type': 'application/json'
  }
})

export default api
