import Layout from '../../../components/Layout/tournamentManager'
import { useDispatch } from 'react-redux'
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
  const [currentStep, setCurrentStep] = useState(tournament?.status === 'ongoing' || 0)
  useEffect(() => {
    dispatch({ type: 'ACTIVE_MENU', payload: TAB_OPTIONS.TOURNAMENT_MANAGER.MANAGE })
  }, [])

  useEffect(() => {
    console.log(tournament?.status === 'ongoing' || 0)
    setCurrentStep(tournament?.status === 'ongoing' ? 4 : 0)
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
        return <Matches isManager tournamentID={id} />
      case 5:
        return <RoundUp tournamentID={id} />
      case 4:
        return <Matches isManager tournamentID={id} />
      default:
        return
    }
  }
  return (
    <Layout>
      <h1>Manage</h1>
      <Steps size="small" current={currentStep} onChange={current => setCurrentStep(current)}>
        <Step title="กำหนดรายการแข่งขัน" />
        <Step title="ประเมินมือ" />
        <Step title="จับสาย" />
        <Step title="จัดตารางแข่ง" />
        <Step title="ดำเนินการแข่งขัน" />
        <Step title="สรุปทีมเข้ารอบ" />
      </Steps>
      {renderStepContent()}

    </Layout>
  )
}
export default Manage