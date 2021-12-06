import { useDispatch, useSelector } from "react-redux"
import { Form, Input, Button, Modal } from 'antd'
import Layout from '../components/Layout/noFooter'
import { useRouter } from "next/router"
import { useState } from "react"
import request from "../utils/request"


const ClaimPlayer = () => {
  const { user } = useSelector(state => state)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const dispatch = useDispatch()
  const onFinish = (values) => {
    setLoading(true)
    request.post(`/player`, values, user.token)
      .then(res => {
        request.post(`/player/claim`, {
          playerID: res.data._id
        },
          user.token
        ).then(() => {
          request.get(`/user/current`,
            { token: user.token }
          ).then((res2) => {
            router.push('/account')
            dispatch({
              type: 'LOGIN',
              payload: {
                ...user,
                token: res2.data.user.token,
                playerID: res.data._id,
                officialName: res.data.officialName,
                displayName: res.data.displayName,
                club: res.data.club
              }
            })
            setLoading(false)
          })

        })
      })
      .catch(err => {
        setLoading(false)
        Modal.error({
          title: 'ผิดพลาด',
          content: (
            <div>
              <p>เกิดปัญหาขณะอัพเดทข้อมูล กรุณาลองใหม่ในภายหลัง</p>
            </div>
          ),
          onOk() { },
        })
      })
  }
  return (
    <div style={{ margin: '10px' }}>
      <Form
        name='basic'
        onFinish={onFinish}
        style={{ maxWidth: '320px', margin: 'auto' }}
      >
        <div>อีกนิดเดียว!</div>
        <Form.Item
          label='ชื่อ-นามสกุล'
          name='officialName'
          rules={[
            {
              required: true,
              message: 'Please input your username!',
            },
          ]}
          help='ชื่อจริง-นามสกุล เพื่อใช้ในการระบุตัวตน'
        >
          <Input />
        </Form.Item>
        <Form.Item
          label='ชื่อเล่น'
          name='displayName'
          help='ชื่อที่ใช้แสดงบนแอพ จะเป็นชื่อเล่น หรือชื่อที่คนอื่นๆในวงการใช้เรียกคุณก็ได้'
        >
          <Input />
        </Form.Item>
        <Form.Item style={{ textAlign: "center", marginTop: '20px' }}>
          <Button type='primary' htmlType='submit' loading={loading}>
            Submit
          </Button>
        </Form.Item>
      </Form>

    </div>
  )
}
ClaimPlayer.getLayout = (page) => {
  return (
    <Layout>
      {page}
    </Layout>
  )
}
export default ClaimPlayer