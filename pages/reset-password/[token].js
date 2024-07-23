// ResetPassword.js
import React, { useState } from 'react';
import { useRouter } from 'next/router'
import Layout from '../../components/Layout/noFooter'
import { Form, Input, Button, Alert } from 'antd'
import request from '../../utils/request';



const ResetPassword = () => {
  const router = useRouter()
  const { token } = router.query
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false)
  const [alertType, setAlertType] = useState()
  const [form] = Form.useForm()


  const handleSubmit = async ({ password }) => {
    setLoading(true)
    try {
      const response = await request.post(`/reset-password/${token}`, { password })
      setAlertType('success')
      setMessage(response.data.message)
      setTimeout(() => router.push('/login'), 2000)
      setLoading(false)

    } catch (err) {
      setAlertType('error')
      setMessage('Somthing went wrong. Please try again later')
      setLoading(false)
    }

  }

  return (
    <Layout>
      {message && <Alert message={message} type={alertType} banner />}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 40 }}>
        <h2>Reset Password</h2>
        <Form
          form={form}
          name='basic'
          initialValues={{ remember: true }}
          onFinish={handleSubmit}
          autoComplete='off'
          style={{ maxWidth: '300px', margin: 'auto', textAlign: 'center' }}
        >

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
            <Input.Password minLength={8} />
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
            <Input.Password minLength={8} />
          </Form.Item>

          <Form.Item >
            <Button type='primary' htmlType='submit' loading={loading}>
              Reset Password
            </Button>
          </Form.Item>
        </Form >
      </div>

    </Layout>
  );
};

export default ResetPassword;
