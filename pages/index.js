import { useSelector } from 'react-redux'
import Greeting from '../components/greeting'
import Layout from '../components/Layout'
const Home = () => {
  const state = useSelector(state => state);
  return (
    <>
      <Greeting user={state.user} />
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
