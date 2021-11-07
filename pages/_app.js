import 'antd/dist/antd.css'
require('../styles/index.less');
import { wrapper } from '../redux/store'
import Head from 'next/head'

function MyApp({ Component, pageProps }) {
  const getLayout = Component.getLayout || ((page) => page)

  return getLayout(<>
    <Head>
      < meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0,user-scalable=0" />
    </Head>
    <Component {...pageProps} />
  </>)
}

export default wrapper.withRedux(MyApp)
