import axios from 'axios'
import Image from 'next/Image'
import { useRouter } from 'next/router'
import logo from '../public/icon/logo.png'
import { Form, Input, Button, Checkbox } from 'antd'
import { useDispatch, useSelector } from 'react-redux';
import { API_ENDPOINT } from '../config'

const Login = () => {
  const state = useSelector(state => state);
  const router = useRouter()
  if (state.user.id) router.push('/')
  const dispatch = useDispatch()

  const onFinish = async (values) => {
    const { data: login } = await axios.post(`${API_ENDPOINT}/login`,
      {
        user: {
          email: values.email,
          password: values.password
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
    localStorage.setItem('rememberMe', values.remember);
    localStorage.setItem('token', values.remember ? login.user.token : '');
    dispatch({ type: 'LOGIN', payload: user })
    router.push('/')
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
      style={{ maxWidth: '300px', margin: 'auto', textAlign: 'center' }}
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

      <Form.Item
        name='remember'
        valuePropName='checked'
      >
        <Checkbox>Remember me</Checkbox>
      </Form.Item>

      <Form.Item >
        <Button type='primary' htmlType='submit'>
          Submit
        </Button>
      </Form.Item>
    </Form>
  )
}
export default Login
