import axios from 'axios'
import { API_ENDPOINT } from '../../config'
const GangID = (props) => {
  return <p>Gang: {props.gang.name}</p>
}

export async function getStaticPaths() {
  const res = await axios.get(`${API_ENDPOINT}/gang`)
  const gangs = await res.data

  const paths = gangs.map((gang) => ({
    params: { id: gang._id },
  }))

  return { paths, fallback: false }
}

export async function getStaticProps({ params }) {
  const res = await axios.get(`${API_ENDPOINT}/gang/${params.id}`)
  const gang = await res.data

  return { props: { gang } }
}

export default GangID