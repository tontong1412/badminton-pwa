import axios from 'axios'
import { useSelector } from 'react-redux';
import { wrapper } from '../../../redux/store'
import { API_ENDPOINT } from '../../../config'

const GangID = (props) => {
  const { tick } = useSelector(state => state);
  console.log(props)
  return <>
    <p>Gang: {props.gang.name} </p>
    <p>Tick: {tick}</p>
  </>
}

export async function getStaticPaths() {
  const res = await axios.get(`${API_ENDPOINT}/gang`)
  const gangs = await res.data

  const paths = gangs.map((gang) => ({
    params: { id: gang._id },
  }))

  return { paths, fallback: false }
}

export const getStaticProps = wrapper.getStaticProps((store) => async ({ params, preview }) => {
  const res = await axios.get(`${API_ENDPOINT}/gang/${params.id}`)
  const gang = await res.data
  console.log('2. Page.getStaticProps uses the store to dispatch things');
  store.dispatch({ type: 'TICK', payload: 'was set in other page ' + preview });

  return { props: { gang } }
}
)

export default GangID