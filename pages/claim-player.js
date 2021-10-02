import { useDispatch, useSelector } from "react-redux"
import { Form, Input, Button, Modal } from 'antd'
import { usePlayers } from "../utils"
import Layout from '../components/Layout/noFooter'
import axios from 'axios'
import { API_ENDPOINT } from "../config"
import { useRouter } from "next/router"


const ClaimPlayer = () => {
  const { user } = useSelector(state => state)
  const { players } = usePlayers()
  const router = useRouter()
  const dispatch = useDispatch()
  const onFinish = (values) => {
    axios.post(`${API_ENDPOINT}/player`, values)
      .then(res => {
        axios.post(`${API_ENDPOINT}/player/claim`, {
          playerID: res.data._id
        }, {
          headers: {
            'Authorization': `Token ${user.token}`
          }
        }).then(() => {
          router.push('/account')
          dispatch({
            type: 'LOGIN',
            payload: {
              ...user,
              playerID: res.data._id,
              officialName: res.data.officialName,
              club: res.data.club
            }
          })
        })
      })
      .catch(err => {
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
          <Button type='primary' htmlType='submit'>
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