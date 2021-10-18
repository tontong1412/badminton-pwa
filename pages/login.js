import axios from 'axios'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import logo from '../public/icon/logo.png'
import { Form, Input, Button, Checkbox, Modal } from 'antd'
import { useDispatch, useSelector } from 'react-redux';
import { API_ENDPOINT } from '../config'
import Layout from '../components/Layout/noFooter'
import { useState } from 'react'

const Login = () => {
  const state = useSelector(state => state)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  if (state.user.id) router.push('/')
  const dispatch = useDispatch()

  const onFinish = async (values) => {
    setLoading(true)
    try {
      const { data: login } = await axios.post(`${API_ENDPOINT}/login`,
        {
          user: {
            email: values.email.toLowerCase(),
            password: values.password
          }
        })

      let player
      if (login.user.playerID) {
        const res = await axios.get(`${API_ENDPOINT}/player/${login.user.playerID}`)
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
        photo: player?.photo
      }
      localStorage.setItem('rememberMe', values.remember);
      localStorage.setItem('token', values.remember ? login.user.token : '');
      dispatch({ type: 'LOGIN', payload: user })
      dispatch({ type: 'ACTIVE_MENU', payload: 'home' })
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
    <Form
      name='basic'
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete='off'
      style={{ maxWidth: '320px', margin: 'auto', textAlign: 'center' }}
    >
      <Image src={logo} alt='logo' />
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

      <Link href="/signup" passHref><div>{'Don\'t have an account?'}<span style={{ color: '#4F708A' }}>{'Sign up now!'}</span></div></Link>

      <Form.Item
        name='remember'
        valuePropName='checked'
      >
        <Checkbox>Remember me</Checkbox>
      </Form.Item>


      <Form.Item >
        <Button type='primary' htmlType='submit' loading={loading}>
          Submit
        </Button>
      </Form.Item>
    </Form>
  )
}

Login.getLayout = (page) => {
  return (
    <Layout>
      {page}
    </Layout>
  )
}
export default Login
