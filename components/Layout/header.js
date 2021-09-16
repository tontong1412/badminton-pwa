import Link from 'next/link'
import { useEffect } from 'react'
import Head from 'next/head'
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios'
import { API_ENDPOINT } from '../../config'
import { LeftOutlined } from '@ant-design/icons'


const Header = (props) => {
  const state = useSelector(state => state);
  const dispatch = useDispatch()

  useEffect(() => {
    const login = async () => {
      const rememberMe = localStorage.getItem('rememberMe') === 'true'
      const token = rememberMe ? localStorage.getItem('token') : ''
      if (rememberMe && token) {
        const { data: login } = await axios.get(`${API_ENDPOINT}/user/current`, {
          headers: {
            'Authorization': `Token ${token}`
          }
        })
        const { data: player } = await axios.get(`${API_ENDPOINT}/player/${login.user.playerID}`)

        const user = {
          id: login.user._id,
          token: login.user.token,
          email: login.user.email,
          playerID: login.user.playerID,
          officialName: player.officialName,
          club: player.club
        }
        localStorage.setItem('rememberMe', true);
        localStorage.setItem('token', login.user.token);
        dispatch({ type: 'LOGIN', payload: user })
      }
    }
    login()
  })

  return (
    <>
      <Head>
        <title>Bad Bay | Badminton Data Center</title>
        <meta name="description" content={props.description} />
      </Head>
      <div className='header'>
        <div>{props.backHref ? <Link passHref href={props.backHref}><LeftOutlined /></Link> : null}</div>
        <div>badbay</div>
        <div>{props.rightIcon ? props.rightIcon : null}</div>
      </div>
    </>
  )
}
export default Header