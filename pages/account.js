import Layout from '../components/Layout'
import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useRouter } from 'next/router'
import { Button } from 'antd'
const Account = (props) => {
  const { user } = useSelector(state => state)
  const dispatch = useDispatch()
  const router = useRouter()
  const logout = () => {
    dispatch({ type: 'LOGOUT' })
    localStorage.clear()
  }
  useEffect(() => {
    if (!user.id) {
      router.push('/login')
    }
    if (!user.playerID) {
      router.push('/claim-player')
    }
  }, [])

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