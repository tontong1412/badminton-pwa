import axios from 'axios'
import { analytics, logEvent } from '../../utils/firebase'
import Layout from '../../components/Layout'
import { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { API_ENDPOINT } from '../../config'
import AddButton from '../../components/addButton'
import Card from '../../components/gangCard'
import { Modal, Form, Input, Radio, InputNumber, Button, Checkbox } from 'antd'
import Loading from '../../components/loading'
import MyGang from '../../components/gang/myGang'
import router from 'next/router'
import { useGangs } from '../../utils'

const Gang = () => {
  const myGangRef = useRef()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [courtFeeType, setCourtFeeType] = useState('buffet')
  const { user } = useSelector(state => state)
  const { gangs, mutate, isLoading, isError } = useGangs()
  const dispatch = useDispatch()
  const [displayGangs, setDisplayGangs] = useState()
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
    mutate()
    setDisplayGangs(gangs)
  }

  useEffect(() => {
    logEvent(analytics, 'gang')
    dispatch({ type: 'ACTIVE_MENU', payload: 'gang' })
  }, [])

  useEffect(() => {
    setDisplayGangs(gangs)
  }, [gangs])

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
  const onSearch = (value) => {
    const searchTextLower = value.toLowerCase().trim()
    const searchGang = gangs.filter(gang => gang.name?.toLowerCase().includes(searchTextLower)
      || gang.location?.toLowerCase().includes(searchTextLower)
      || gang.area?.toLowerCase().includes(searchTextLower)
    )
    setDisplayGangs(searchGang)
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
      },
      area: values.area
    }, {
      headers: {
        'Authorization': `Token ${user.token}`
      }
    }).then(res => {
      fetchData()
      setIsModalVisible(false)
      setConfirmLoading(false)
      myGangRef.current.mutateMyGang()
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
  if (isLoading) return <Loading />
  return (
    <div>
      <MyGang bottomLine ref={myGangRef} />
      <div style={{ margin: '10px' }}><Input.Search allowClear enterButton="Search" placeholder='ค้นหาโดยชื่อก๊วน ชื่อสนาม จังหวัด หรือย่าน' onSearch={onSearch} /></div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', margin: '5px' }}>
        {displayGangs?.length > 0 ? displayGangs?.map(gang => {
          return <Card key={`gang-card-${gang._id}`} gang={gang} />
        })
          : <div style={{ margin: '20px auto' }}><div style={{ color: '#ccc' }}>ไม่พบก๊วน</div></div>
        }
      </div>

      <AddButton onClick={() => {
        if (user.id) setIsModalVisible(true)
        else {
          Modal.info({
            title: 'กรุณา Log in ก่อนสร้างก๊วน',
            onOk: () => router.push('/login')
          })
        }
      }} />
      <Modal
        title="สร้างก๊วน"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        destroyOnClose
        initialValues={{ courtFeeType: courtFeeType }}
      >
        <Form
          style={{ height: '500px', overflow: 'scroll' }}
          onFinish={onFinish}
          scrollToFirstError
          {...formItemLayout}
        >
          <Form.Item
            label='ชื่อก๊วน'
            name='name'
            rules={[
              {
                required: true,
                message: 'กรุณาระบุชื่อก๊วน',
              },
            ]}
          >
            <Input maxLength={30} />
          </Form.Item>
          <Form.Item
            label='สนาม'
            name='location'
          >
            <Input />
          </Form.Item>
          <Form.Item
            label='สถานที่'
            name='area'
            help='เช่น วงเวียนใหญ่, เชียงใหม่ ใช้สำหรับการค้นหา'
          >
            <Input />
          </Form.Item>
          <Form.Item
            label='ค่าสนาม'
            name='courtFeeType'
            rules={[
              {
                required: true,
                message: 'กรุณาเลือกประเภทการเก็บค่าสนาม',
              },
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
                message: 'กรุณาระบุค่าสนาม',
              },
            ]}
          >
            <div><InputNumber min={0} /> บาท</div>
          </Form.Item>

          <Form.Item
            label='ค่าลูกขนไก่'
            name='shuttlecockFee'
            rules={[
              {
                required: true,
                message: 'กรุณาระบุค่าลูกขนไก่',
              },
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
            <Button key='submit' loading={confirmLoading} type='primary' htmlType='submit' style={{ width: '100%', marginTop: '20px' }}>
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