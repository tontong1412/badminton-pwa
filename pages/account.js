import Layout from '../components/Layout'
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
  if (!user.id) {
    router.push('/login')
    return <div>Redirecting</div>
  }
  if (!user.playerID) {
    router.push('/claim-player')
    return <div>Redirecting</div>
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