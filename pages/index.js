import { useSelector, useDispatch } from 'react-redux'
import { useEffect } from 'react'
import Greeting from '../components/greeting'
import Layout from '../components/Layout'
import { TAB_OPTIONS } from '../constant'
import { useRouter } from 'next/router'

const Home = () => {
  const router = useRouter()
  const { user } = useSelector(state => state)
  const dispatch = useDispatch()
  useEffect(() => {
    router.push('/gang')
    dispatch({ type: 'ACTIVE_MENU', payload: TAB_OPTIONS.HOME })
  }, [])
  return (
    <>
      <Greeting user={user} />
    </>
  )
}

Home.getLayout = (page) => {
  return (
    <Layout>
      {page}
    </Layout>
  )
}

export default Home
