import Layout from '../../../components/Layout/tournamentManager'
import { useDispatch, useSelector } from 'react-redux'
import { TAB_OPTIONS } from '../../../constant'
import { useEffect } from 'react'
const Matches = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch({ type: 'ACTIVE_MENU', payload: TAB_OPTIONS.TOURNAMENT_MANAGER.MATCHES })
  }, [])
  return (
    <Layout>
      <h1>Matches</h1>
    </Layout>
  )
}
export default Matches