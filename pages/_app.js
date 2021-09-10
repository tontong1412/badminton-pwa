import '../styles/globals.css'
import 'antd/dist/antd.css'
require('../styles/index.less');
import Layout from '../components/Layout'
import { wrapper } from '../redux/store'

function MyApp({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  )
}

export default wrapper.withRedux(MyApp)
