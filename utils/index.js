import useSWR from 'swr'
import axios from 'axios'
import { API_ENDPOINT } from '../config'


const fetcher = (url, token, params) => axios.get(url, {
  headers: token ? {
    'Authorization': `Token ${token}`
  } : null,
  params
}).then((res) => {
  return res.data
})

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

export const useBills = (id) => {
  const { data, error, mutate } = useSWR(
    `${API_ENDPOINT}/gang/${id}/bill`,
    fetcher
  )
  return {
    bills: data,
    isLoading: !error && !data,
    isError: error,
    mutate
  }
}

export const useGangs = () => {
  const { data, error, mutate } = useSWR(
    `${API_ENDPOINT}/gang`,
    fetcher
  )

  return {
    gangs: data,
    isLoading: !error && !data,
    isError: error,
    mutate
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