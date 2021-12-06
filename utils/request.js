import axios from 'axios'
import { API_ENDPOINT } from '../config'

const get = (path, { params, token }) =>
  axios.get(`${API_ENDPOINT}${path}`, {
    headers: {
      'Authorization': `Token ${token}`
    },
    params
  })


const post = (path, body, token) =>
  axios.post(`${API_ENDPOINT}${path}`,
    body,
    {
      headers: {
        'Authorization': `Token ${token}`
      },
    })


const put = (path, body, token) =>
  axios.put(`${API_ENDPOINT}${path}`,
    body,
    {
      headers: {
        'Authorization': `Token ${token}`
      },
    })


export default {
  get,
  put,
  post
}