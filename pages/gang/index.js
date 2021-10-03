import axios from 'axios'
import Layout from '../../components/Layout'
import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { mutate } from 'swr'

import { API_ENDPOINT } from '../../config'
import AddButton from '../../components/addButton'
import Card from '../../components/gangCard'
import { Modal, Form, Input, Radio, InputNumber, Button } from 'antd'
import { useGangs } from '../../utils'
import Loading from '../../components/loading'

const Gang = () => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const { user } = useSelector(state => state)
  const { gangs, isLoading, isError } = useGangs(user.token)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch({ type: 'ACTIVE_MENU', payload: 'gang' })
  }, [])
  const formatPromptpay = (input) => {
    if (input.length === 10) {
      const formattedCode = input.slice(0, 3) + '-' + input.slice(3, 6) + '-' + input.slice(6)
      return formattedCode
    } else if (input.length === 13) {
      const formattedCode = input.slice(0, 1) + '-' + input.slice(1, 5) + '-' + input.slice(5, 10) + '-' + input.slice(10, 12) + '-' + input.slice(12)
      return formattedCode
    } else {
      return null
    }
  }
  const onFinish = (values) => {
    setConfirmLoading(true)
    axios.post(`${API_ENDPOINT}/gang`, {
      name: values.name,
      location: values.location,
      // type: 'nonRoutine',
      courtFee: {
        type: values.courtFeeType,
        amount: values.courtFee
      },
      shuttlecockFee: values.shuttlecockFee,
      payment: {
        code: values.paymentCode ? formatPromptpay(values.paymentCode) : null,
        name: values.paymentName
      }
    }, {
      headers: {
        'Authorization': `Token ${user.token}`
      }
    }).then(res => {
      mutate(`${API_ENDPOINT}/gang`)
      setIsModalVisible(false)
      setConfirmLoading(false)
    }).catch(err => {
      setIsModalVisible(false)
      setConfirmLoading(false)
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
  if (isError) return "An error has occurred."
  if (isLoading) return <Loading />
  return (
    <div>
      <div>ก๊วนของฉัน</div>
      <div style={{
        width: '100%',
        overflow: 'scroll',
        display: 'flex',
      }}>
        {gangs?.map(gang => {
          return <Card key={`gang-card-${gang._id}`} gang={gang} style={{ float: 'right' }} />
        })}
      </div>
      <AddButton onClick={() => setIsModalVisible(true)} />
      <Modal
        title="สร้างก๊วน"
        visible={isModalVisible}
        onOk={() => console.log('on ok')}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        confirmLoading={confirmLoading}
        destroyOnClose
      >
        <Form
          style={{ height: '500px', overflow: 'scroll' }}
          onFinish={onFinish}
        >
          <Form.Item
            label='ชื่อก๊วน'
            name='name'
          >
            <Input />
          </Form.Item>
          <Form.Item
            label='สนาม'
            name='location'
          >
            <Input />
          </Form.Item>
          <Form.Item
            label='ค่าสนาม'
            name='courtFeeType'
          >
            <Radio.Group>
              <Radio value="buffet">บุฟเฟต์</Radio>
              <Radio value="share">หารเท่า</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            name='courtFee'
          >
            <Input />
          </Form.Item>
          <Form.Item
            label='ค่าลูกขนไก่'
            name='shuttlecockFee'
          >
            <div><InputNumber min={1} /> บาท/ลูก/คน</div>
          </Form.Item>
          <Form.Item
            label='พร้อมเพย์'
            name='paymentCode'
            help="ใช้สำหรับสร้าง QR code รับเงิน"
          >
            <Input placeholder='เบอร์โทรศัพท์ หรือ หมายเลขบัตรประชาชน' />
          </Form.Item>
          <Form.Item
            name='paymentName'
            style={{ marginTop: '20px' }}
          >
            <Input placeholder='ชื่อบัญชีพร้อมเพย์' />
          </Form.Item>
          <Form.Item >
            <Button key='submit' type='primary' htmlType='submit' style={{ width: '100%', marginTop: '20px' }}>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

Gang.getLayout = (page) => {
  return (
    <Layout>
      {page}
    </Layout>
  )
}

export default Gang