import Layout from '../../../components/Layout/tournamentManager'
import { useDispatch, useSelector } from 'react-redux'
import { TAB_OPTIONS } from '../../../constant'
import { useEffect, useState } from 'react'
import ManageEvent from '../../../components/TournamentManager/ManageEvent'
import Participants from '../../../components/TournamentManager/participants'
import Matches from '../../../components/TournamentManager/matches'
import Draw from '../../../components/TournamentManager/draw'
import ArrangeMatch from '../../../components/TournamentManager/arrangeMatch'
import RoundUp from '../../../components/TournamentManager/roundUp'
import Result from '../../../components/TournamentManager/result'
import { Steps } from 'antd'
import { useRouter } from 'next/router'
import { useTournament } from '../../../utils'
const { Step } = Steps

const Manage = () => {
  const dispatch = useDispatch()
  const router = useRouter()
  const { id } = router.query
  const { tournament } = useTournament(id)
  const [currentStep, setCurrentStep] = useState(0)
  const [isManager, setIsManager] = useState(false)
  const { user } = useSelector(state => state)
  useEffect(() => {
    dispatch({ type: 'ACTIVE_MENU', payload: TAB_OPTIONS.TOURNAMENT_MANAGER.MANAGE })
  }, [])

  useEffect(() => {
    if (user && tournament && (user.playerID === tournament.creator || tournament.managers.map(e => e._id).includes(user.playerID))) {
      setIsManager(true)
    } else {
      setIsManager(false)
    }
  }, [user, tournament])

  useEffect(() => {
    if (tournament?.status === 'ongoing') {
      setCurrentStep(4)
    } else if (tournament?.status === 'knockOut') {
      setCurrentStep(4)
    } else if (tournament?.status === 'register') {
      setCurrentStep(1)
    } else {
      setCurrentStep(0)
    }

  }, [tournament?.status])


  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <ManageEvent tournamentID={id} />
      case 1:
        return <Participants isManager tournamentID={id} controls />
      case 2:
        return <Draw tournamentID={id} />
      case 3:
        return <ArrangeMatch tournamentID={id} setStep={setCurrentStep} />
      case 4:
        return <Matches isManager tournamentID={id} />
      case 5:
        return <RoundUp tournamentID={id} />
      case 6:
        return <Result tournamentID={id} />
      // case 6:
      //   return <Matches isManager tournamentID={id} step='knockOut' />
      default:
        return
    }
  }


  if (!isManager) return <Layout><div>permission denied</div></Layout>
  return (
    <Layout>
      <h2 style={{ marginBottom: 0 }}>{tournament?.name}</h2>
      <h2>Manage</h2>
      <Steps size="small" current={currentStep} onChange={current => setCurrentStep(current)}>
        <Step title="กำหนดรายการแข่งขัน" />
        <Step title="รายชื่อ" />
        <Step title="จับสาย" />
        <Step title="จัดตารางแข่ง" />
        <Step title="แมตช์แข่งขัน" />
        {/* <Step title="แข่งรอบแบ่งกลุ่ม" /> */}
        <Step title="สรุปทีมเข้ารอบ" />
        <Step title="สรุปผลการแข่งขัน" />
        {/* <Step title="แข่งรอบแพ้คัดออก" /> */}
      </Steps>
      {renderStepContent()}

    </Layout>
  )
}
export default Manage