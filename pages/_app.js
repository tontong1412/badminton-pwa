import 'antd/dist/antd.css'
require('../styles/index.less');
import { wrapper } from '../redux/store'

function MyApp({ Component, pageProps }) {
  const getLayout = Component.getLayout || ((page) => page)

  return getLayout(<Component {...pageProps} />)
}

export default wrapper.withRedux(MyApp)
