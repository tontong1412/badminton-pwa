import Layout from '../../../components/Layout/gang'

const MatchList = () => {
  return (
    <div>MatchList</div>
  )
}
MatchList.getLayout = (page) => {
  return (
    <Layout>
      {page}
    </Layout>
  )
}
export default MatchList