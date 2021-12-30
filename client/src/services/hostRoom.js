import axios from 'axios'
const baseUrl = 'https://pure-cliffs-62315.herokuapp.com/api/host'

const host = async (credentials) => {
    const response = await axios.post(baseUrl, credentials)
    return response.data
  }

export default {host}