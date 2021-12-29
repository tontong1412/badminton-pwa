import Layout from '../../../components/Layout/tournamentManager'
import { useDispatch, useSelector } from 'react-redux'
import { TAB_OPTIONS } from '../../../constant'
import { useEffect } from 'react'
const Manage = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch({ type: 'ACTIVE_MENU', payload: TAB_OPTIONS.TOURNAMENT_MANAGER.MANAGE })
  }, [])
  return (
    <Layout>
      <h1>Manage</h1>
    </Layout>
  )
}
export default Manage