// ForgotPassword.js
import React, { useState } from 'react';
import { Form, Input, Button, Alert } from 'antd'
import Layout from '../components/Layout/noFooter';
import request from '../utils/request';

const ForgotPassword = () => {
  const [message, setMessage] = useState('');
  const [alertType, setAlertType] = useState('success')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async ({ email }) => {
    setLoading(true)
    try {
      const response = await request.post(`/forgot-password`, { email })
      setAlertType('success')
      setMessage(response.data.message)
      setLoading(false)

    } catch (error) {
      console.log(typeof error.response.data.message)
      setAlertType('error')
      setMessage(error.response.data.message)
      setTimeout(() => setMessage(''), 5000)
      setLoading(false)
    }
  };

  return (
    <div>
      <Layout>
        {message && <Alert message={message} type={alertType} showIcon />}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 40 }}>
          <h2>Forgot Password</h2>
          <Form
            name='basic'
            onFinish={handleSubmit}
            autoComplete='off'
            style={{ maxWidth: '300px', margin: 'auto', textAlign: 'center' }}
          >

            <Form.Item
              label='Email'
              name='email'
              rules={[
                {
                  required: true,
                  message: 'Please input your email!',
                },
              ]}
            >
              <Input type='email' />
            </Form.Item>

            <Form.Item >
              <Button type='primary' htmlType='submit' loading={loading}>
                Send Reset Link
              </Button>
            </Form.Item>
          </Form >
        </div>
      </Layout>
    </div>
  );
};

export default ForgotPassword;
