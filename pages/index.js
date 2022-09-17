import { useSelector, useDispatch } from 'react-redux'
import { analytics, logEvent } from '../utils/firebase'
import { useEffect, useState } from 'react'
import Greeting from '../components/greeting'
import Layout from '../components/Layout'
import { TAB_OPTIONS } from '../constant'
import { useRouter } from 'next/router'
import MyGang from '../components/gang/myGang'
import MyTournament from '../components/Tournament/MyTournament'
import AddToHomeScreenCard from '../components/addToHomeScreenCard'
import RegisteringTournament from '../components/Tournament/RegisteringTournament'
import Banner from '../components/Tournament/Banner'
import { isMobileOnly } from 'react-device-detect'


const Home = () => {
  const router = useRouter()
  const { user } = useSelector(state => state)
  const dispatch = useDispatch()
  const [isDownloaded, setIsDownloaded] = useState(false)
  useEffect(() => {
    logEvent(analytics, 'home')
    dispatch({ type: 'ACTIVE_MENU', payload: TAB_OPTIONS.HOME })
  }, [])
  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia('(display-mode: standalone)').matches) {
      setIsDownloaded(true)
    }
  }, [])
  return (
    <>
      <Greeting user={user} />
      {isMobileOnly && <Banner />}
      <RegisteringTournament />
      <MyTournament homePage />
      <MyGang />
      {!isDownloaded && <AddToHomeScreenCard />}

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
