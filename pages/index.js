import { useSelector } from 'react-redux';
const Home = () => {
  const state = useSelector(state => state);
  return (
    <>
      <p>Hello {state.user.officialName}</p>
    </>
  )
}

export default Home
