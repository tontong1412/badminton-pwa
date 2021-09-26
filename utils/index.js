import useSWR from 'swr'
import axios from 'axios'
import { API_ENDPOINT } from '../config'


const fetcher = (url, token, params) => axios.get(url, {
  headers: {
    'Authorization': token ? `Token ${token}` : null
  },
  params
}).then((res) => res.data)

export const useGang = (id) => {
  const { data, error, mutate } = useSWR(
    `${API_ENDPOINT}/gang/${id}`,
    fetcher
  )

  return {
    gang: data,
    isLoading: !error && !data,
    isError: error,
    mutate
  }
}

export const useGangs = (token, params) => {
  const { data, error } = useSWR(
    `${API_ENDPOINT}/gang`,
    (url) => fetcher(url, token, params)
  )

  return {
    gangs: data,
    isLoading: !error && !data,
    isError: error
  }
}

export const usePlayers = () => {
  const { data, error } = useSWR(
    `${API_ENDPOINT}/player`,
    fetcher
  )

  return {
    players: data,
    isLoading: !error && !data,
    isError: error
  }
}