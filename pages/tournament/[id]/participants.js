import Layout from '../../../components/Layout/tournamentManager'
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'
import { TAB_OPTIONS } from '../../../constant'
import { useEffect } from 'react'
import ParticipantsTable from '../../../components/TournamentManager/participants'

const Participants = (props) => {
  const dispatch = useDispatch()
  const router = useRouter()
  const { id } = router.query
  useEffect(() => {
    dispatch({ type: 'ACTIVE_MENU', payload: TAB_OPTIONS.TOURNAMENT_MANAGER.PARTICIPANTS })
  }, [])
  return (
    <Layout>
      <h1>ตรวจสอบรายชื่อ</h1>
      <ParticipantsTable tournamentID={id} />
    </Layout>
  )
}
export default Participants