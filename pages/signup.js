import Image from 'next/image'
import { useRouter } from 'next/router'
import logo from '../public/icon/logo.png'
import { Form, Input, Button, Modal, Divider } from 'antd'
import { useDispatch } from 'react-redux';
import request from '../utils/request'
import Layout from '../components/Layout/noFooter'
import { useState, useEffect } from 'react'
import { analytics, logEvent } from '../utils/firebase'
// import FacebookLogin from 'react-facebook-login'
// import { FACEBOOK } from '../config';

const Signup = () => {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const [form] = Form.useForm()
  const dispatch = useDispatch()

  useEffect(() => {
    logEvent(analytics, 'sign up')
  }, [])

  const responseFacebook = (response) => {

    request.post('/signup',
      {
        user: {
          email: response.email,
          facebookID: response.id
        }
      }).then(async res => {
        if (res.data.user.playerID) {
          const playerResponse = await request.get(`/player/${res.data.user.playerID}`)
          const player = playerResponse.data
          const user = {
            id: res.data.user._id,
            token: res.data.user.token,
            email: res.data.user.email,
            playerID: res.data.user.playerID,
            officialName: player?.officialName,
            displayName: player?.displayName,
            club: player?.club,
            photo: player?.photo,
            tel: player?.tel,
            lineID: player?.lineID,
            birthDate: player?.birthDate,
            gender: player?.gender,
          }
          localStorage.setItem('rememberMe', true);
          localStorage.setItem('token', res.data.user.token);
          dispatch({ type: 'LOGIN', payload: user })
          router.push('/')
        } else {
          const user = {
            id: res.data.user._id,
            token: res.data.user.token,
            email: res.data.user.email,
          }
          localStorage.setItem('rememberMe', true);
          localStorage.setItem('token', res.data.user.token);
          dispatch({ type: 'LOGIN', payload: user })
          router.push('/claim-player')
        }

        setLoading(false)
      })
  }

  const onFinish = async (values) => {
    setLoading(true)

    request.post(`/signup`,
      {
        user: {
          email: values.email.toLowerCase(),
          password: values.password,
        },

      }).then(res => {
        const user = {
          id: res.data.user._id,
          token: res.data.user.token,
          email: res.data.user.email,
        }
        dispatch({ type: 'LOGIN', payload: user })
        router.push('/claim-player')
        setLoading(false)
      }).catch((err) => {
        setLoading(false)
        Modal.error({
          title: 'ผิดพลาด',
          content: (
            <div>
              <p>{err.response.data.message || 'เกิดปัญหาขณะอัพเดทข้อมูล กรุณาลองใหม่ในภายหลัง'}</p>
            </div>
          ),
          onOk() { },
        })
      })

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
          // onClick={componentClicked}
          callback={responseFacebook}
          cssClass='facebook-login-button'
        />
      </div>
      <Divider>Or</Divider> */}
      <Form
        form={form}
        name='basic'
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete='off'
        style={{ maxWidth: '300px', margin: 'auto', textAlign: 'center' }}
      >

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
          label='Confirm Email'
          name='confirmEmail'
          dependencies={['email']}
          rules={[
            {
              required: true,
              message: 'Please confirm email!',
            },
            {
              type: 'email',
              message: 'Please use a valid email'
            },
            {
              validator: async () => {
                if (form.getFieldValue('email') !== form.getFieldValue('confirmEmail')) {
                  throw new Error('Something wrong!');
                }
              },
              message: 'email mismatch'
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
            Sign Up
          </Button>
        </Form.Item>
      </Form >
    </>
  )
}

Signup.getLayout = (page) => {
  return (
    <Layout back={{ href: '/' }}>
      {page}
    </Layout>
  )
}
export default Signup
