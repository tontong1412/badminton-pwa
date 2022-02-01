import { useSelector, useDispatch } from 'react-redux'
import { analytics, logEvent } from '../utils/firebase'
import { useEffect } from 'react'
import Greeting from '../components/greeting'
import Layout from '../components/Layout'
import { TAB_OPTIONS } from '../constant'
import { useRouter } from 'next/router'
import MyGang from '../components/gang/myGang'
import MyTournament from '../components/Tournament/MyTournament'

const Home = () => {
  const router = useRouter()
  const { user } = useSelector(state => state)
  const dispatch = useDispatch()
  useEffect(() => {
    logEvent(analytics, 'home')
    dispatch({ type: 'ACTIVE_MENU', payload: TAB_OPTIONS.HOME })
  }, [])
  return (
    <>
      <Greeting user={user} />
      <MyTournament homePage />
      <MyGang />
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
