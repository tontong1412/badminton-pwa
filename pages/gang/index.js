import axios from 'axios'
import { analytics, logEvent } from '../../utils/firebase'
import Layout from '../../components/Layout'
import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import MyCard from '../../components/myCard'

import { API_ENDPOINT } from '../../config'
import AddButton from '../../components/addButton'
import Card from '../../components/gangCard'
import { Modal, Form, Input, Radio, InputNumber, Button, Checkbox, Empty } from 'antd'
import Loading from '../../components/loading'

// TODO: search gang
// TODO: my gang

const Gang = () => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [courtFeeType, setCourtFeeType] = useState('buffet')
  const { user } = useSelector(state => state)
  const [gangs, setGangs] = useState()
  const [myGang, setMyGang] = useState([])
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(true)
  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 24 },
      lg: { span: 24 },
      xl: { span: 24 }
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 24 },
      lg: { span: 24 },
      xl: { span: 24 }
    },
  };

  const fetchData = async () => {
    setLoading(true)
    await axios.get(`${API_ENDPOINT}/gang`)
      .then(res => {
        console.log(res.data)
        setGangs(res.data)
      })
      .catch(() => { })


    if (user.token) {
      await axios.get(`${API_ENDPOINT}/gang/my-gang`, {
        headers: {
          'Authorization': `Token ${user.token}`
        }
      }).then(res => {
        setMyGang(res.data)
      })
        .catch(() => { })
    }

    setLoading(false)
  }

  useEffect(() => {
    logEvent(analytics, 'gang')
    dispatch({ type: 'ACTIVE_MENU', payload: 'gang' })
    fetchData()
  }, [])

  useEffect(() => {
    if (user.token) {
      fetchData()
    }
  }, [user])

  const formatPromptpay = (input) => {
    if (input.length === 10) {
      const formattedCode = input.slice(0, 3) + '-' + input.slice(3, 6) + '-' + input.slice(6)
      return formattedCode
    } else if (input.length === 13) {
      const formattedCode = input.slice(0, 1) + '-' + input.slice(1, 5) + '-' + input.slice(5, 10) + '-' + input.slice(10, 12) + '-' + input.slice(12)
      return formattedCode
    } else {
      return input
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
      },
      isPrivate: values.isPrivate,
      contact: {
        name: values.contactName,
        tel: values.tel,
        lineID: values.lineID
      }
    }, {
      headers: {
        'Authorization': `Token ${user.token}`
      }
    }).then(res => {
      fetchData()
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
  if (loading) return <Loading />
  // if (isError) return "An error has occurred."
  // if (isLoading) return <Loading />
  return (
    <div>
      {myGang?.length > 0 &&
        <><div style={{ margin: '15px 0 0 5px' }}>ก๊วนของฉัน</div>
          <div style={{
            width: '100%',
            overflowX: 'scroll',
            overflowY: 'hidden',
            display: 'flex',
          }}>
            {myGang?.length > 0 ? myGang?.map(gang => {
              return <MyCard key={`mygang-card-${gang._id}`} gang={gang} style={{ float: 'right' }} />
            })
              : <div style={{ margin: 'auto' }}><Empty image={Empty.PRESENTED_IMAGE_SIMPLE} /></div>
            }
          </div>
          <div style={{ borderBottom: '1px solid #eee', marginTop: '10px' }}></div>
        </>}
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {gangs?.length > 0 ? gangs?.map(gang => {
          return <Card key={`gang-card-${gang._id}`} gang={gang} />
        })
          : <div style={{ margin: 'auto' }}><Empty image={Empty.PRESENTED_IMAGE_SIMPLE} /></div>
        }
      </div>

      <AddButton onClick={() => {
        if (user.id) setIsModalVisible(true)
        else {
          Modal.info({
            title: 'กรุณา Log in ก่อนสร้างก๊วน'
          })
        }
      }} />
      <Modal
        title="สร้างก๊วน"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        confirmLoading={confirmLoading}
        destroyOnClose
        initialValues={{ courtFeeType: courtFeeType }}
      >
        <Form
          style={{ height: '500px', overflow: 'scroll' }}
          onFinish={onFinish}
          {...formItemLayout}
        >
          <Form.Item
            label='ชื่อก๊วน'
            name='name'
            rules={[
              { required: true },
            ]}
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
            rules={[
              { required: true },
            ]}
          >
            <Radio.Group onChange={(e) => setCourtFeeType(e.target.value)}>
              <Radio value="buffet">บุฟเฟต์</Radio>
              <Radio value="share">หารเท่า</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            name='courtFee'
            help={courtFeeType === 'buffet' ? 'ค่าสนาม/คน' : 'ค่าสนามทั้งหมด'}
            rules={[
              {
                required: true,
              },
            ]}
          >
            <div><InputNumber min={0} /> บาท</div>
          </Form.Item>

          <Form.Item
            label='ค่าลูกขนไก่'
            name='shuttlecockFee'
            rules={[
              { required: true },
            ]}
          >
            <div><InputNumber min={0} /> บาท/ลูก/คน</div>
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

          <Form.Item
            label='ชื่อผู้ดูแลก๊วน'
            name='contactName'
          >
            <Input />
          </Form.Item>

          <Form.Item
            label='เบอร์โทรศัพท์'
            name='tel'
          >
            <Input />
          </Form.Item>
          <Form.Item
            label='Line id'
            name='lineID'
          >
            <Input />
          </Form.Item>

          <Form.Item
            name='isPrivate'
            valuePropName='checked'
            help='ก๊วนของคุณจะไม่แสดงบนหน้าค้นหา'
          >
            <Checkbox>ก๊วนส่วนตัว</Checkbox>
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