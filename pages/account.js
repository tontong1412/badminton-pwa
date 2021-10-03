import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useRouter } from 'next/router'
import { Button } from 'antd'
import Layout from '../components/Layout'
import { TAB_OPTIONS } from '../constant'

const Account = () => {
  const { user } = useSelector(state => state)
  const dispatch = useDispatch()
  const router = useRouter()
  const logout = () => {
    dispatch({ type: 'LOGOUT' })
    localStorage.clear()
  }
  useEffect(() => {
    dispatch({ type: 'ACTIVE_MENU', payload: TAB_OPTIONS.ACCOUNT })
  }, [])

  if (!user.id) {
    return <div onClick={() => router.push('/login')}>Please login <span style={{ color: '#4F708A' }}>Click here</span></div>
  }
  if (!user.playerID) {
    return <div onClick={() => router.push('/claim-player')}>Please create profile <span style={{ color: '#4F708A' }}>Click here</span></div>
  }

  return (
    <div>
      <div>This is My Account page</div>
      <Button type='danger' onClick={logout}>Log Out</Button>
    </div>
  )
}
Account.getLayout = (page) => {
  return (
    <Layout>
      {page}
    </Layout>
  )
}
export default Account