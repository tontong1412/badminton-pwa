import { useSelector } from 'react-redux'
import Greeting from '../components/greeting'
const Home = () => {
  const state = useSelector(state => state);
  return (
    <>
      <Greeting user={state.user} />
    </>
  )
}

export default Home
