import Layout from '../../../components/Layout/tournamentManager'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useTournament } from '../../../utils'
import Loading from '../../../components/loading'
import { useDispatch, useSelector } from 'react-redux'
import { TAB_OPTIONS } from '../../../constant'

const TournamentManagerID = () => {
  const router = useRouter()
  const { id } = router.query
  const { tournament, isLoading, isError } = useTournament(id)
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch({ type: 'ACTIVE_MENU', payload: TAB_OPTIONS.TOURNAMENT_MANAGER.DETAIL })
  }, [])
  if (isLoading) return <Loading />
  if (isError) return <p>error</p>

  return (
    <Layout>
      <h1>{tournament.name}</h1>
      <h2>รายการที่รับสมัคร</h2>
      <div>
        {tournament.events.map((event, index) => {
          return (
            <p key={`event-${index + 1}`}>{event.name}</p>
          )
        })}
      </div>
    </Layout>
  )
}
export default TournamentManagerID