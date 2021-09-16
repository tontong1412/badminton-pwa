import Layout from '../components/Layout'
const Noti = (props) => {
  return (
    <div>
      This is Noti page
    </div>
  )
}
Noti.getLayout = (page) => {
  return (
    <Layout>
      {page}
    </Layout>
  )
}
export default Noti