import axios from 'axios'
import Link from 'next/link'
import { API_ENDPOINT } from '../../config'

const Gang = (props) => {
  return props.gangs.map(gang => {
    return (
      <Link
        key={gang._id}
        href={`/gang/${gang._id}`}
        passHref
      >
        <div style={{ margin: '5px', border: '1px solid pink' }}>
          <div>{gang.name}</div>
          <div>{`Location: ${gang.location}`}</div>
        </div>
      </Link>
    )
  })
}

export async function getStaticProps() {
  const res = await axios.get(`${API_ENDPOINT}/gang`)
  const gangs = await res.data

  return {
    props: {
      gangs,
    },
    revalidate: 10, // In seconds
  }
}

export default Gang