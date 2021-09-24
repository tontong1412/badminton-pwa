import useSWR from 'swr'
import axios from 'axios'
import { API_ENDPOINT } from '../config'

const fetcher = (url) => axios.get(url).then((res) => res.data)

export const useGang = (id) => {
  const { data, error } = useSWR(
    `${API_ENDPOINT}/gang/${id}`,
    fetcher
  )

  return {
    gang: data,
    isLoading: !error && !data,
    isError: error
  }
}

export const useGangs = (id) => {
  const { data, error } = useSWR(
    `${API_ENDPOINT}/gang`,
    fetcher
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