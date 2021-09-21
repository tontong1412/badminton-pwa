import axios from 'axios'
import Layout from '../../components/Layout'

import { API_ENDPOINT } from '../../config'
import AddButton from '../../components/addButton'
import Card from '../../components/gangCard'

const Gang = (props) => {
  return (
    <>
      <div>ก๊วนของฉัน</div>
      <div style={{
        display: 'flex',
        width: '100%',
        overflow: 'scroll'
      }}>
        {props.gangs.map(gang => {
          return <Card key={gang._id} gang={gang} />
        })}
      </div>
      <AddButton onClick={() => console.log('TODO: create gang')} />
    </>
  )
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

Gang.getLayout = (page) => {
  return (
    <Layout>
      {page}
    </Layout>
  )
}

export default Gang