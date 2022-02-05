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
    console.log(tournament?.status);
    if (tournament?.status === 'ongoing') {
      setCurrentStep(4)
    } else if (tournament?.status === 'knockOut') {
      setCurrentStep(6)
    } else {
      setCurrentStep(0)
    }

  }, [tournament?.status])


  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <ManageEvent tournamentID={id} />
      case 1:
        return <Participants isManager tournamentID={id} />
      case 2:
        return <Draw tournamentID={id} />
      case 3:
        return <ArrangeMatch tournamentID={id} setStep={setCurrentStep} />
      case 4:
        return <Matches isManager tournamentID={id} step='group' />
      case 5:
        return <RoundUp tournamentID={id} />
      case 6:
        return <Matches isManager tournamentID={id} step='knockOut' />
      default:
        return
    }
  }


  if (!isManager) return <div>permission denied</div>
  return (
    <Layout>
      <h1>Manage</h1>
      <Steps size="small" current={currentStep} onChange={current => setCurrentStep(current)}>
        <Step title="กำหนดรายการแข่งขัน" />
        <Step title="ประเมินมือ" />
        <Step title="จับสาย" />
        <Step title="จัดตารางแข่ง" />
        <Step title="แข่งรอบแบ่งกลุ่ม" />
        <Step title="สรุปทีมเข้ารอบ" />
        <Step title="แข่งรอบแพ้คัดออก" />
      </Steps>
      {renderStepContent()}

    </Layout>
  )
}
export default Manage