import axios from 'axios'
const baseUrl = '/api/login'

const logIn = async (username, password) => {
  const credentials = { username, password }
  const response = await axios.post(baseUrl, credentials)
  return response.data
}

export default { logIn }