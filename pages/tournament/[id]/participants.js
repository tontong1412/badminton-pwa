import Layout from '../../../components/Layout/tournamentManager'
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'
import { TAB_OPTIONS } from '../../../constant'
import { useEffect, useState } from 'react'
import ParticipantsTable from '../../../components/TournamentManager/participants'
import RegisterModal from '../../../components/Tournament/RegisterModal'
import AddButton from '../../../components/addButton'

const Participants = (props) => {
  const dispatch = useDispatch()
  const router = useRouter()
  const { id } = router.query
  const [registerModalVisible, setRegisterModalVisible] = useState(false)
  useEffect(() => {
    dispatch({ type: 'ACTIVE_MENU', payload: TAB_OPTIONS.TOURNAMENT_MANAGER.PARTICIPANTS })
  }, [])
  return (
    <Layout>
      <h1>ตรวจสอบรายชื่อ</h1>
      <ParticipantsTable tournamentID={id} />
      <AddButton onClick={() => setRegisterModalVisible(true)} />
      <RegisterModal
        visible={registerModalVisible}
        setVisible={setRegisterModalVisible}
        tournamentID={id} />
    </Layout>
  )
}
export default Participants