
import { useEffect } from 'react'
import { analytics, logEvent } from '../../utils/firebase'
import { useSelector, useDispatch } from 'react-redux'
import Layout from '../../components/Layout'
import { TAB_OPTIONS } from '../../constant'
const Tournament = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    logEvent(analytics, 'tournament')
    dispatch({ type: 'ACTIVE_MENU', payload: TAB_OPTIONS.TOURNAMENT })
  }, [])
  return <Layout />
}
export default Tournament