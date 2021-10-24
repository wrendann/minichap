import axios from 'axios'
const baseUrl = 'http://localhost:8080/api/join'

const join = async (credentials) => {
    const response = await axios.post(baseUrl, credentials)
    return response.data
  }

export default {join}