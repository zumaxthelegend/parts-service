import axios from 'axios'

const client = axios.create({
  baseURL: 'https://api.favorit-parts.ru',
})

export default client
