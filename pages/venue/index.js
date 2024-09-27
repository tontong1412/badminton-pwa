import { useVenues } from "../../utils"
import Layout from '../../components/Layout'
import Link from 'next/link'

const Venue = () => {
  const { venues, isLoading, isError, mutate } = useVenues()

  return (
    <Layout>
      {
        venues?.map(v => <Link
          href={`/venue/${v._id}`}
          passHref
          key={v._id}
        >
          <div >{v.name}</div>
        </Link>)
      }
    </Layout>
  )
}
export default Venue