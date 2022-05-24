import Link from 'next/link'
import { useEffect } from 'react'
import { useRouter } from 'next/router';
import Head from 'next/head'
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios'
import { API_ENDPOINT } from '../../config'
import { LeftOutlined } from '@ant-design/icons'


const Header = (props) => {
  const { user } = useSelector(state => state);
  const dispatch = useDispatch()
  const router = useRouter()

  useEffect(() => {
    const login = async () => {
      const rememberMe = localStorage.getItem('rememberMe') === 'true'
      const token = rememberMe ? localStorage.getItem('token') : ''
      if (rememberMe && token) {
        try {
          const { data: login } = await axios.get(`${API_ENDPOINT}/user/current`, {
            headers: {
              'Authorization': `Token ${token}`
            }
          })

          let player
          if (login.user.playerID) {
            const res = await axios.get(`${API_ENDPOINT}/player/${login.user.playerID}`)
            player = res.data
          }

          const userObj = {
            id: login.user._id,
            token: login.user.token,
            email: login.user.email,
            playerID: login.user.playerID,
            officialName: player?.officialName,
            displayName: player?.displayName,
            club: player?.club,
            photo: player?.photo,
            tel: player?.tel,
            lineID: player?.lineID
          }
          localStorage.setItem('rememberMe', true);
          localStorage.setItem('token', login.user.token);
          dispatch({ type: 'LOGIN', payload: userObj })
        } catch (error) {
          dispatch({ type: 'LOGOUT' })
          localStorage.clear()
        }

      }
    }
    if (!user.id) login()
  }, [user])

  return (
    <>
      <Head>
        <title>Badminstar - โปรแกรมจัดก๊วน จัดแข่งแบดมินตัน</title>
        <meta name="description" content={props.description} />
      </Head>
      <div className='header'>
        <div>{props.back?.href || props.previous ?
          <div onClick={props.previous ? router.back : () => router.push(props.back.href)}>
            <LeftOutlined />
          </div>
          :
          null}
        </div>
        <Link passHref href='/'><div>badminstar</div></Link>
        <div>{props.rightIcon ? props.rightIcon : null}</div>
      </div>
    </>
  )
}
export default Header