import Layout from '../../../components/Layout/gang'
import { analytics, logEvent } from '../../../utils/firebase'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import { TAB_OPTIONS } from '../../../constant'
import Image from 'next/image'
import { useGang } from '../../../utils'
import Loading from '../../../components/loading'
import { Button, Modal, Form, Checkbox, Input, InputNumber, Radio, Popconfirm } from 'antd'
import { EnvironmentOutlined } from '@ant-design/icons';
import axios from 'axios'
import { API_ENDPOINT } from '../../../config'
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
const GangDetail = () => {
  const router = useRouter()
  const { id } = router.query
  const dispatch = useDispatch()
  const { gang, isLoading, isError, mutate } = useGang(id)
  const { user } = useSelector(state => state)
  const [isManager, setIsManager] = useState(false)
  const [editModal, setEditModal] = useState(false)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [courtFeeType, setCourtFeeType] = useState('buffet')
  const [initialValue, setInitialValue] = useState()
  useEffect(() => {
    logEvent(analytics, `gang-${id}`)
    dispatch({ type: 'ACTIVE_MENU', payload: TAB_OPTIONS.GANG.DETAIL })
  }, [])

  useEffect(() => {
    if (user && gang && (user.playerID === gang.creator?._id || gang.managers?.includes(user.playerID))) {
      setIsManager(true)
    } else {
      setIsManager(false)
    }
  }, [user, gang])

  useEffect(() => {
    setCourtFeeType(gang?.courtFee.type)
    setInitialValue({
      name: gang?.name,
      location: gang?.location,
      courtFeeType: gang?.courtFee.type,
      courtFee: gang?.courtFee.amount,
      shuttlecockFee: gang?.shuttlecockFee,
      paymentCode: gang?.payment?.code,
      paymentName: gang?.payment?.name,
      contactName: gang?.contact?.name,
      tel: gang?.contact?.tel,
      lineID: gang?.contact?.lineID,
      isPrivate: gang?.isPrivate,
      area: gang?.area
    })
  }, [gang])

  const formatTel = (input) => {
    if (input?.length === 10) {
      const formattedCode = input.slice(0, 3) + '-' + input.slice(3, 6) + '-' + input.slice(6)
      return formattedCode
    }
    return input
  }

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
    axios.put(`${API_ENDPOINT}/gang/${id}`, {
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
      mutate(res.data)
      setEditModal(false)
      setConfirmLoading(false)
    }).catch(err => {
      setEditModal(false)
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

  const joinGang = () => {
    if (user.playerID) {
      logEvent(analytics, 'player register')
      axios.post(`${API_ENDPOINT}/gang/register`, {
        gangID: id,
        player: {
          _id: user.playerID
        }
      }).then(() => router.push(`/gang/${id}/player`))
    } else {
      Modal.confirm({
        title: 'กรุณาเข้าสู่ระบบ',
        content: (
          <div>
            <p>คุณจำเป็นต้องเข้าสู่ระบบเพื่อเข้าร่วมก๊วน</p>
          </div>
        ),
        onOk() { router.push('/login') },
        onCancel() {
          logEvent(analytics, 'not register')
        }
      })
    }

  }

  if (isError) return "An error has occurred."
  if (isLoading) return <Loading />
  return (
    <>
      <div style={{ width: '100%', height: '300px', overflow: 'hidden', borderBottom: '1px solid #eee' }}>
        <Image
          src='/icon/logo.png'
          alt=''
          width={100}
          height={120}
          objectFit='cover'
          layout='responsive'
        />
      </div>
      <div style={{ padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{gang.name}</div>
          <div style={{ marginLeft: '5px', padding: '0px 10px', border: '1px solid #87e8de', backgroundColor: '#e6fffb', color: "#08979c", borderRadius: '20px' }}>{gang.courtFee.type}</div>
        </div>
        {gang.location && <div><EnvironmentOutlined style={{ marginRight: '5px' }} />{gang.location}</div>}

        <div style={{ marginTop: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ fontWeight: 'bold', marginRight: '5px', width: '80px' }}>ค่าสนาม</div>
            <div>{`${gang.courtFee.amount} บาท`}</div>
          </div>
          <div style={{ display: 'flex', }}>
            <div style={{ fontWeight: 'bold', marginRight: '5px', width: '80px' }}>ค่าลูกแบด</div>
            <div>{`${gang.shuttlecockFee} บาท/ลูก/คน`}</div>
          </div>
          <div style={{ display: 'flex', }}>
            <div style={{ fontWeight: 'bold', marginRight: '5px', width: '80px' }}>เบอร์โทร</div>
            <div>{`${formatTel(gang.contact?.tel) || '-'} ${gang.contact?.name ? `(${gang.contact?.name})` : ''}`}</div>
          </div>
          <div style={{ display: 'flex', }}>
            <div style={{ fontWeight: 'bold', marginRight: '5px', width: '80px' }}>Line ID</div>
            <div>{gang.contact?.lineID || '-'}</div>
          </div>
        </div>

        {isManager ?
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
            <Button type='primary' style={{ width: '100%' }} onClick={() => setEditModal(true)}>แก้ไขข้อมูล</Button>
          </div>
          :
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
            <Popconfirm
              title="คุณแน่ใจที่จะเข้าร่วมก๊วนนี้หรือไม่"
              onConfirm={() => joinGang()}
              onCancel={() => { }}
              okText="Yes"
              cancelText="No"
            >
              <Button type='primary' style={{ width: '100%' }}>เข้าร่วมก๊วน</Button>
            </Popconfirm>
          </div>
        }

      </div>

      <Modal
        title="แก้ไขข้อมูล"
        visible={editModal}
        onCancel={() => setEditModal(false)}
        footer={null}
        confirmLoading={confirmLoading}
        destroyOnClose

      >
        <Form
          style={{ height: '500px', overflow: 'scroll' }}
          onFinish={onFinish}
          {...formItemLayout}
          initialValues={initialValue}
        >
          <Form.Item
            label='ชื่อก๊วน'
            name='name'
            rules={[
              { required: true },
            ]}
          >
            <Input maxLength={15} />
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
            <div><InputNumber min={0} defaultValue={initialValue?.courtFee} /> บาท</div>
          </Form.Item>

          <Form.Item
            label='ค่าลูกขนไก่'
            name='shuttlecockFee'
            rules={[
              { required: true },
            ]}
          >
            <div><InputNumber min={0} defaultValue={initialValue?.shuttlecockFee} /> บาท/ลูก/คน</div>
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

    </>
  )
}

GangDetail.getLayout = (page) => {
  return (
    <Layout>
      {page}
    </Layout>
  )
}
export default GangDetail