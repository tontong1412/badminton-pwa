import Layout from '../../../components/Layout/tournamentManager'
import { useDispatch } from 'react-redux'
import { TAB_OPTIONS } from '../../../constant'
import { useEffect, useState } from 'react'
import ManageEvent from '../../../components/TournamentManager/ManageEvent'
import Participants from '../../../components/TournamentManager/participants'
import Matches from '../../../components/TournamentManager/matches'
import Draw from '../../../components/TournamentManager/draw'
import { Steps } from 'antd'
import { useRouter } from 'next/router'
const { Step } = Steps

const Manage = () => {
  const dispatch = useDispatch()
  const router = useRouter()
  const { id } = router.query
  const [currentStep, setCurrentStep] = useState(0)
  useEffect(() => {
    dispatch({ type: 'ACTIVE_MENU', payload: TAB_OPTIONS.TOURNAMENT_MANAGER.MANAGE })
  }, [])


  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <ManageEvent tournamentID={id} />
      case 1:
        return <Participants isManager tournamentID={id} />
      case 2:
        return <Draw tournamentID={id} />
      case 3:
        return <div>จัดเวลา</div>
      case 4:
        return <Matches isManager tournamentID={id} />
      case 5:
        return
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
        <Step title="จัดเวลา" />
        <Step title="ดำเนินการแข่งขัน" />
        <Step title="สรุปผล" />
      </Steps>
      {renderStepContent()}

    </Layout>
  )
}
export default Manage