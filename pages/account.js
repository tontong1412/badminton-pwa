import Layout from '../components/Layout'
const Account = (props) => {
  return (
    <div>
      This is My Account page
    </div>
  )
}
Account.getLayout = (page) => {
  return (
    <Layout>
      {page}
    </Layout>
  )
}
export default Account