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
    id ? `${API_ENDPOINT}/gang/${id}` : null,
    fetcher
  )

  return {
    gang: data,
    isLoading: !error && !data,
    isError: error,
    mutate
  }
}
export const useTournament = (id) => {
  const { data, error, mutate } = useSWR(
    id ? `${API_ENDPOINT}/tournament/${id}` : null,
    fetcher
  )

  return {
    tournament: data,
    isLoading: !error && !data,
    isError: error,
    mutate
  }
}

export const useBills = (id) => {
  const { data, error, mutate } = useSWR(
    id ? `${API_ENDPOINT}/gang/${id}/bill` : null,
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
export const useTournaments = () => {
  const { data, error, mutate } = useSWR(
    `${API_ENDPOINT}/tournament`,
    fetcher
  )

  return {
    tournaments: data,
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

export const useMatchDraws = (eventID) => {
  const { data, error, mutate } = useSWR(
    eventID ? `${API_ENDPOINT}/match` : null,
    (url) => fetcher(url, null, { eventID })
  )

  return {
    matches: data,
    isLoading: !error && !data,
    isError: error,
    mutate
  }
}

export const useMatches = (tournamentID) => {
  const { data, error, mutate } = useSWR(
    tournamentID ? `${API_ENDPOINT}/match` : null,
    (url) => fetcher(url, null, { tournamentID })
  )

  return {
    matches: data,
    isLoading: !error && !data,
    isError: error,
    mutate
  }
}


export const useEvent = (id) => {
  const { data, error, mutate } = useSWR(
    id ? `${API_ENDPOINT}/event/${id}` : null,
    fetcher
  )

  return {
    event: data,
    isLoading: !error && !data,
    isError: error,
    mutate
  }
}