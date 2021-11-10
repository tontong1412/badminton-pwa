import { useDispatch, useSelector } from "react-redux"
import { Form, Input, Button, Modal } from 'antd'
import Layout from '../components/Layout/noFooter'
import axios from 'axios'
import { API_ENDPOINT } from "../config"
import { useRouter } from "next/router"


const EditAccount = () => {
  const { user } = useSelector(state => state)
  const router = useRouter()
  const dispatch = useDispatch()
  const onFinish = (values) => {
    axios.put(`${API_ENDPOINT}/player/${user.playerID}`, values)
      .then(res => {
        dispatch({
          type: 'LOGIN',
          payload: {
            officialName: res.data.officialName,
            displayName: res.data.displayName,
          }
        })
        router.push('/account')
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
        initialValues={{
          officialName: user.officialName,
          displayName: user.displayName
        }}
      >
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
EditAccount.getLayout = (page) => {
  return (
    <Layout back={{ href: '/account', alias: 'account' }}>
      {page}
    </Layout>
  )
}
export default EditAccount