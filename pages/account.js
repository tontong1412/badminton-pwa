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
  useEffect(() => {
    if (!user.id) {
      router.push('/login')
      return <div />
    }
    if (!user.playerID) {
      router.push('/claim-player')
      return <div />
    }
  }, [user])

  if (!user.id) {
    return <div>Please login</div>
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