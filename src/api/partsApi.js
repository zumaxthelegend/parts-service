import client from './client.js'

const API_KEY = import.meta.env.VITE_API_KEY

export function searchByNumber(number) {
  return client.get('/hs/hsprice/', {
    params: { key: API_KEY, number },
  })
}

export function searchWithAnalogues(number, brand) {
  return client.get('/hs/hsprice/', {
    params: { key: API_KEY, number, brand, analogues: 'on' },
  })
}
