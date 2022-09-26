import 'antd/dist/antd.css'
require('../styles/index.less');
import { wrapper } from '../redux/store'
import Head from 'next/head'
import 'moment/locale/th'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import handleSubscription from '../utils/handleSubscription'

function MyApp({ Component, pageProps }) {
  const getLayout = Component.getLayout || ((page) => page)
  const { user } = useSelector(state => state)

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((swReg) => {
            console.log('ServiceWorker registration successful with scope: ', swReg.scope)
          })
          .catch((err) => {
            console.error('Service Worker Error', err)
          })
      })
    } else {
      console.warn('Push messaging is not supported')
    }
  }, [])

  useEffect(() => {
    if (user.token) {
      handleSubscription(user)
    }
  }, [user])

  return getLayout(<>
    <Head>
      < meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0,user-scalable=0" />
    </Head>
    <Component {...pageProps} />
  </>)
}

export default wrapper.withRedux(MyApp)
