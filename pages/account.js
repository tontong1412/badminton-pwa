import Layout from '../components/Layout'
import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useRouter } from 'next/router'
import { Button } from 'antd'
import Loading from '../components/loading'
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
      return <div />
    }
    if (!user.playerID) {
      router.push('/claim-player')
      return <div />
    }
  }, [])

  if (!user.id) return <Loading />

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