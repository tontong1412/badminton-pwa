import axios from 'axios'
import Layout from '../../components/Layout'
import { useState } from 'react'
import { useSelector } from 'react-redux'

import { API_ENDPOINT } from '../../config'
import AddButton from '../../components/addButton'
import Card from '../../components/gangCard'
import { Modal, Form, Input, Radio, InputNumber, Button } from 'antd'

const Gang = (props) => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const { user } = useSelector(state => state)
  const formatPromptpay = (input) => {
    console.log(input.length)
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
  const onFinish = async (values) => {
    console.log(values)
    formatPromptpay(values.paymentCode)
    const res = await axios.post(`${API_ENDPOINT}/gang`, {
      name: values.name,
      location: values.location,
      // type: 'nonRoutine',
      courtFee: {
        type: values.courtFeeType,
        amount: values.courtFee
      },
      shuttlecockFee: values.shuttlecockFee,
      paymentCode: formatPromptpay(values.paymentCode)
    }, {
      headers: {
        'Authorization': `Token ${user.token}`
      }
    })
  }
  return (
    <>
      <div>ก๊วนของฉัน</div>
      <div style={{
        display: 'flex',
        width: '100%',
        overflow: 'scroll'
      }}>
        {props.gangs.map(gang => {
          return <Card key={`gang-card-${gang._id}`} gang={gang} />
        })}
      </div>
      <AddButton onClick={() => setIsModalVisible(true)} />
      <Modal
        title="สร้างก๊วน"
        visible={isModalVisible}
        onOk={() => console.log('on ok')}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      // confirmLoading={confirmLoading}
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
            <Input />
          </Form.Item>
          <Form.Item >
            <Button key='submit' type='primary' htmlType='submit' style={{ width: '100%', marginTop: '20px' }}>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export async function getStaticProps() {
  const res = await axios.get(`${API_ENDPOINT}/gang`)
  const gangs = await res.data

  return {
    props: {
      gangs,
    },
    revalidate: 10, // In seconds
  }
}

Gang.getLayout = (page) => {
  return (
    <Layout>
      {page}
    </Layout>
  )
}

export default Gang