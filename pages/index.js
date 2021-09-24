import { useSelector, useDispatch } from 'react-redux'
import Greeting from '../components/greeting'
import Layout from '../components/Layout'

const Home = () => {
  const { user } = useSelector(state => state)
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
