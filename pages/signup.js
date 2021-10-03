import axios from 'axios'
import Image from 'next/image'
import { useRouter } from 'next/router'
import logo from '../public/icon/logo.png'
import { Form, Input, Button, Checkbox, Steps } from 'antd'
import { useDispatch, useSelector } from 'react-redux';
import { API_ENDPOINT } from '../config'
import Layout from '../components/Layout/noFooter'
import { useState } from 'react'

const Signup = () => {
  const state = useSelector(state => state)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const [form] = Form.useForm()
  const dispatch = useDispatch()

  const onFinish = async (values) => {
    setLoading(true)
    const { data: login } = await axios.post(`${API_ENDPOINT}/signup`,
      {
        user: {
          email: values.email,
          password: values.password
        }
      })

    const user = {
      id: login.user._id,
      token: login.user.token,
      email: login.user.email,
    }

    dispatch({ type: 'LOGIN', payload: user })
    router.push('/claim-player')
    setLoading(false)
  }

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo)
  }
  return (
    <Form
      form={form}
      name='basic'
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete='off'
      style={{ maxWidth: '300px', margin: 'auto', textAlign: 'center' }}
    >
      {/* <Image src={logo} alt='logo' /> */}
      <Form.Item
        label='Email'
        name='email'
        rules={[
          {
            required: true,
            message: 'Please input your username!',
          },
          {
            type: 'email',
            message: 'Please use a valid email'
          }
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
        label='Confirm Password'
        name='confirmPassword'
        dependencies={['password']}
        rules={[
          {
            required: true,
            message: 'Please input your password!',
          },
          {
            validator: async () => {
              if (form.getFieldValue('password') !== form.getFieldValue('confirmPassword')) {
                throw new Error('Something wrong!');
              }
            },
            message: 'password mismatch'
          }
        ]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item >
        <Button type='primary' htmlType='submit' loading={loading}>
          Submit
        </Button>
      </Form.Item>
    </Form>

  )
}

Signup.getLayout = (page) => {
  return (
    <Layout>
      {page}
    </Layout>
  )
}
export default Signup
