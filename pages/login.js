import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import logo from '../public/icon/logo.png'
import { Form, Input, Button, Checkbox, Modal, Divider } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import Layout from '../components/Layout/noFooter'
import { useState, useEffect } from 'react'
import { analytics, logEvent } from '../utils/firebase'
import request from '../utils/request'
// import FacebookLogin from 'react-facebook-login'
// import { FACEBOOK } from '../config'

const Login = () => {
  const [loading, setLoading] = useState(false)
  const { user } = useSelector(state => state)
  const router = useRouter()
  const dispatch = useDispatch()

  useEffect(() => {
    logEvent(analytics, 'log in')
    if (user.token) {
      router.push('/')
    }
  }, [])


  const responseFacebook = async (response) => {
    try {
      const { data: login } = await request.post(
        '/login',
        {
          user: {
            facebookID: response.id
          }
        }
      )
      let player
      if (login.user.playerID) {
        const res = await request.get(`/player/${login.user.playerID}`)
        player = res.data
      }
      const user = {
        id: login.user._id,
        token: login.user.token,
        email: login.user.email,
        playerID: login.user.playerID,
        officialName: player?.officialName,
        displayName: player?.displayName,
        club: player?.club,
        photo: player?.photo,
        tel: player?.tel,
        lineID: player?.lineID,
        birthDate: player?.birthDate,
        gender: player?.gender,
        admin: player?.admin
      }
      localStorage.setItem('rememberMe', true);
      localStorage.setItem('token', login.user.token);
      dispatch({ type: 'LOGIN', payload: user })
      setLoading(false)
      router.push('/')
    } catch (error) {
      Modal.error({
        title: 'Log in ด้วย Facebook ไม่สำเร็จ',
        content: (
          <div>
            <p>กรุณาสมัครสมาชิกด้วยเฟสบุ๊คก่อน โดยกดที่ลิงค์ Sign up now!</p>
          </div>
        ),
        onOk() { router.push('/signup') },
      })
      setLoading(false)
    }
  }

  const onFinish = async (values) => {
    setLoading(true)
    try {
      const { data: login } = await request.post(
        `/login`,
        {
          user: {
            email: values.email.toLowerCase(),
            password: values.password
          }
        })

      let player
      if (login.user.playerID) {
        const res = await request.get(`/player/${login.user.playerID}`)
        player = res.data
      }
      const user = {
        id: login.user._id,
        token: login.user.token,
        email: login.user.email,
        playerID: login.user.playerID,
        officialName: player?.officialName,
        displayName: player?.displayName,
        club: player?.club,
        photo: player?.photo,
        tel: player?.tel,
        lineID: player?.lineID,
        birthDate: player?.birthDate,
        gender: player?.gender,
        admin: player?.admin
      }
      localStorage.setItem('rememberMe', values.remember);
      localStorage.setItem('token', values.remember ? login.user.token : '');
      dispatch({ type: 'LOGIN', payload: user })
      setLoading(false)
      router.push('/')
    } catch (error) {
      Modal.error({
        title: 'Log in ไม่สำเร็จ',
        content: (
          <div>
            <p>โปรดตรวจสอบ Email หรือ Password ของคุณ</p>
          </div>
        ),
        onOk() { },
      })
      setLoading(false)
    }

  }

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo)
  }
  return (

    <>
      <div style={{ width: '250px', height: '250px', margin: 'auto' }}><Image unoptimized src={logo} alt='logo' /></div>

      {/* <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '15px' }}>
        <FacebookLogin
          appId={FACEBOOK.APP_ID}
          // autoLoad={true}
          fields="name,email,picture"
          // onClick={responseFacebook}
          callback={responseFacebook}
          cssClass='facebook-login-button'
        />
      </div>
      <Divider>Or</Divider> */}


      <Form
        name='basic'
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete='off'
        style={{ maxWidth: '320px', margin: 'auto', textAlign: 'center' }}
      >
        <Form.Item
          label='Email'
          name='email'
          rules={[
            {
              required: true,
              message: 'Please input your username!',
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label='Password'
          name='password'
          rules={[
            {
              required: true,
              message: 'Please input your password!',
            },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Link href="/forgot" passHref><div><span style={{ color: '#4F708A' }}>{'Forgot password?'}</span></div></Link>
        <Link href="/signup" passHref><div>{'Don\'t have an account? '}<span style={{ color: '#4F708A' }}>{'Sign up now!'}</span></div></Link>


        <Form.Item
          name='remember'
          valuePropName='checked'
        >
          <Checkbox>Remember me</Checkbox>
        </Form.Item>


        <Form.Item >
          <Button type='primary' htmlType='submit' loading={loading}>
            Log in
          </Button>
        </Form.Item>
      </Form>
    </>
  )
}

Login.getLayout = (page) => {
  return (
    <Layout back={{ href: '/' }}>
      {page}
    </Layout>
  )
}
export default Login
