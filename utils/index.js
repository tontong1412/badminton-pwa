import useSWR from 'swr'
import axios from 'axios'
import { API_ENDPOINT } from '../config'
import { useState, useEffect, useLayoutEffect } from 'react'
import io from 'socket.io-client'


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
  const { data, error, mutate } = useSWR(
    `${API_ENDPOINT}/player`,
    fetcher
  )

  return {
    players: data,
    isLoading: !error && !data,
    isError: error,
    mutate
  }
}

export const usePlayer = (id) => {
  const { data, error, mutate } = useSWR(
    `${API_ENDPOINT}/player/${id}`,
    fetcher
  )

  return {
    player: data,
    isLoading: !error && !data,
    isError: error,
    mutate
  }
}

export const useMatchDraws = (eventID) => {
  const { data, error, mutate } = useSWR(
    [eventID ? `${API_ENDPOINT}/match` : null, eventID],
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
    [tournamentID ? `${API_ENDPOINT}/match` : null, tournamentID],
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

export const useMyTournament = (token) => {
  const { data, error, mutate } = useSWR(
    [`${API_ENDPOINT}/tournament/my-tournament`, token],
    (url) => { if (token) return fetcher(url, token) }
  )

  return {
    tournaments: data,
    isLoading: !error && !data,
    isError: error,
    mutate
  }
}

export const useMyGang = (token) => {
  const { data, error, mutate } = useSWR(
    [`${API_ENDPOINT}/gang/my-gang`, token],
    (url) => { if (token) return fetcher(url, token) }
  )

  return {
    myGangs: data,
    isLoading: !error && !data,
    isError: error,
    mutate
  }
}

export const useNextMatch = (token, eventID, tournamentID) => {
  const { data, error, mutate } = useSWR(
    [`${API_ENDPOINT}/match/next`, token, eventID, tournamentID],
    (url) => { if (token) return fetcher(url, token, { eventID, tournamentID }) }
  )

  return {
    matches: data,
    isLoading: !error && !data,
    isError: error,
    mutate
  }
}

export const useMatch = (id) => {
  const { data, error, mutate } = useSWR(
    [`${API_ENDPOINT}/match/${id}`, id],
    (url) => fetcher(url)
  )

  return {
    match: data,
    isLoading: !error && !data,
    isError: error,
    mutate
  }
}

export const useSocket = (url = API_ENDPOINT) => {
  const [socket, setSocket] = useState(null)

  useEffect(() => {
    const socketIo = io(url)
    setSocket(socketIo)

    const cleanup = () => {
      socketIo.disconnect()
    }
    return cleanup
  }, [])

  return socket
}

export const useWindowSize = () => {
  const [size, setSize] = useState([0, 0]);
  useLayoutEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight]);
    }
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);
  return size;
}

export const useBanners = () => {
  const { data, error, mutate } = useSWR(
    `${API_ENDPOINT}/banner`,
    fetcher
  )

  return {
    banners: data,
    isLoading: !error && !data,
    isError: error,
    mutate
  }
}