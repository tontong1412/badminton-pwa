import axios from 'axios'
import Layout from '../../components/Layout'
import { useState } from 'react'

import { API_ENDPOINT } from '../../config'
import AddButton from '../../components/addButton'
import Card from '../../components/gangCard'
import { Modal, Form, Input, Radio, InputNumber } from 'antd'

const Gang = (props) => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  return (
    <>
      <div>ก๊วนของฉัน</div>
      <div style={{
        display: 'flex',
        width: '100%',
        overflow: 'scroll'
      }}>
        {props.gangs.map(gang => {
          return <Card key={gang._id} gang={gang} />
        })}
      </div>
      <AddButton onClick={() => setIsModalVisible(true)} />
      <Modal
        title="สร้างก๊วน"
        visible={isModalVisible}
        onOk={() => console.log('on ok')}
        onCancel={() => setIsModalVisible(false)}
      // confirmLoading={confirmLoading}
      >
        <Form style={{ height: '500px', overflow: 'scroll' }}>
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
            <InputNumber min={1} /> บาท/ลูก/คน
          </Form.Item>
          <Form.Item
            label='พร้อมเพย์'
            name='paymentCode'
            help="ใช้สำหรับสร้าง QR code รับเงิน"
          >
            <Input />
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