import Layout from '../../../components/Layout/tournamentManager'
import { useDispatch } from 'react-redux'
import { TAB_OPTIONS } from '../../../constant'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import 'moment/locale/th'
import Loading from '../../../components/loading'
import MatchesTable from '../../../components/TournamentManager/matches'
const Matches = () => {
  const dispatch = useDispatch()
  const router = useRouter()
  const { id } = router.query
  useEffect(() => {
    dispatch({ type: 'ACTIVE_MENU', payload: TAB_OPTIONS.TOURNAMENT_MANAGER.MATCHES })
  }, [])
  return (
    <Layout>
      <h1>รายการแข่งขัน</h1>
      <MatchesTable tournamentID={id} />
    </Layout>
  )
}
export default Matches