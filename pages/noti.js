import Layout from '../components/Layout'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { TAB_OPTIONS } from '../constant'
const Noti = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch({ type: 'ACTIVE_MENU', payload: TAB_OPTIONS.NOTI })
  }, [])
  return (
    <div>
      This is Noti page
    </div>
  )
}
Noti.getLayout = (page) => {
  return (
    <Layout>
      {page}
    </Layout>
  )
}
export default Noti