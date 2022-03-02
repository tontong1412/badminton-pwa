import { useState, useEffect } from "react"
import { useTournament } from "../../utils"
import { Table, Modal, Form, Input, Checkbox, Button, InputNumber, Popconfirm, Select, Radio } from "antd"
import AddButton from '../../components/addButton'
import request from "../../utils/request"
import axios from "axios"
import { API_ENDPOINT } from "../../config"
import { MAP_FORMAT } from "../../constant"

const ManageEvent = ({ tournamentID }) => {
  const { tournament, isError, isLoading, mutate } = useTournament(tournamentID)
  const [data, setData] = useState([])
  const [modalVisible, setModalVisible] = useState(false)
  const [mode, setMode] = useState('create')
  const [loading, setLoading] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState()
  const [form] = Form.useForm()
  useEffect(() => {
    if (selectedEvent) {
      setModalVisible(true)
    } else {
      setModalVisible(false)
    }
  }, [selectedEvent])
  useEffect(() => {
    const tempData = tournament?.events.map(event => {
      return {
        key: event._id,
        name: event.name,
        type: event.type,
        description: event.description,
        limit: event.limit,
        fee: event.fee,
        prize: event.prize,
        format: MAP_FORMAT[event.format],
        registered: event.teams.length,
        action: <div onClick={() => {
          setMode('edit')
          form.resetFields()
          setSelectedEvent(event)
          // setModalVisible(true)
        }}>แก้ไข</div>
      }
    })
    setData(tempData)
  }, [tournament])

  const onFinish = (value) => {
    setLoading(true)
    if (mode === 'create') {
      request.post('/event', { ...value, tournamentID })
        .then(res => {
          mutate()
          setLoading(false)
          // setModalVisible(false)
          form.resetFields()
          setSelectedEvent()
        }).catch((err) => {
          console.log(err)
          setLoading(false)
          // setModalVisible(false)
          setSelectedEvent()
          form.resetFields()
        })
    } else {
      request.put(`/event/${selectedEvent._id}`, { ...value, tournamentID })
        .then(res => {
          mutate()
          setLoading(false)
          // setModalVisible(false)
          setSelectedEvent()
          form.resetFields()
        }).catch((err) => {
          console.log(err)
          setLoading(false)
          // setModalVisible(false)
          setSelectedEvent()
          form.resetFields()
        })
    }
  }

  const onRemoveEvent = () => {
    axios.delete(`${API_ENDPOINT}/event/${selectedEvent._id}`)
      .then(() => {
        setSelectedEvent()
        // setModalVisible(false)
        form.resetFields()
        mutate()
      })
      .catch((e) => {
        setSelectedEvent()
        // setModalVisible(false)
        form.resetFields()
        console.log(e)
      })
  }

  const columns = [
    {
      title: 'รายการแข่งขัน',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
      width: 100,
      fixed: 'left'
    },
    {
      title: 'ประเภท',
      dataIndex: 'type',
      key: 'type',
      align: 'center',
      width: 80
    },
    {
      title: 'คำอธิบาย',
      dataIndex: 'description',
      key: 'description',
      align: 'center',
      width: 150
    },
    {
      title: 'จำกัดจำนวน',
      dataIndex: 'limit',
      key: 'limit',
      align: 'center',
      width: 50
    },
    {
      title: 'ค่าสมัคร',
      dataIndex: 'fee',
      key: 'fee',
      align: 'center',
      width: 50
    },
    {
      title: 'รางวัล',
      dataIndex: 'prize',
      key: 'prize',
      align: 'center',
      width: 150
    },
    {
      title: 'รูปแบบการแข่งขัน',
      dataIndex: 'format',
      key: 'format',
      align: 'center',
      width: 100
    },
    {
      title: 'จำนวนคู่ที่สมัคร',
      dataIndex: 'registered',
      key: 'registered',
      align: 'center',
      width: 50
    },
    {
      title: '',
      dataIndex: 'action',
      key: 'action',
      align: 'center',
      width: 50
    },

  ]
  const footer = () => {
    let base = []
    if (mode === 'edit') {
      base.push(<Popconfirm
        key='remove'
        title="คุณแน่ใจที่จะลบรายการนี้?"
        onConfirm={onRemoveEvent}
        okText="yes"
        cancelText="No"
      >
        <Button type='danger'>ลบรายการนี้</Button>
      </Popconfirm>)
    }
    base = [
      ...base,
      <Button key='cancle' onClick={() => {
        setSelectedEvent()
        // setModalVisible(false)
        form.resetFields()
      }}>ยกเลิก</Button>,
      <Button
        onClick={() => form.submit()}
        key='ok'
        type='primary'>ตกลง</Button>
    ]
    return base
  }
  return (
    <div>
      <Table dataSource={data} columns={columns} size='small' pagination={false} scroll={{ x: 1000 }} />
      <AddButton onClick={() => {
        setModalVisible(true)
        setMode('create')
      }} />
      <Modal
        visible={modalVisible}
        title={mode === 'create' ? 'เพิ่มรายการแข่งขัน' : 'แก้ไขรายการแข่งขัน'}
        onCancel={() => {
          setSelectedEvent()
          form.resetFields()
          // setModalVisible(false)
        }}
        onOk={() => form.submit()}
        footer={footer()}
        destroyOnClose
      >
        <div>
          <Form
            name="event"
            form={form}
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            initialValues={mode === 'edit' && selectedEvent}
            onFinish={onFinish}
            // onFinishFailed={onFinishFailed}
            autoComplete="off"
            style={{ maxHeight: '500px', overflow: 'scroll' }}
          >
            <Form.Item
              label="ชื่อรายการ"
              name="name"
              rules={[{ required: true, message: 'กรุณาใส่ชื่อรายการ' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="ประเภท"
              name="type"
              rules={[{ required: true, message: 'กรุณาระบุประเภท' }]}
            >
              <Radio.Group >
                <Radio value='double'>คู่</Radio>
                <Radio value='single'>เดี่ยว</Radio>
              </Radio.Group>
            </Form.Item>

            <Form.Item
              label="คำอธิบาย"
              name="description"
            >
              <Input.TextArea />
            </Form.Item>

            <Form.Item
              label="จำกัดจำนวน"
              name="limit"
            >
              <InputNumber />
            </Form.Item>

            <Form.Item
              label="ค่าสมัคร"
              name="fee"
              rules={[{ required: true, message: 'กรุณาใส่ชื่อรายการ' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="รางวัล"
              name="prize"
            >
              <Input.TextArea />
            </Form.Item>
            <Form.Item
              label="รูปแบบการแข่ง"
              name="format"
              rules={[{ required: true, message: 'กรุณาใส่ชื่อรายการ' }]}
            >
              <Select
              >
                <Select.Option value="roundRobin">แบ่งกลุ่ม/แพ้คัดออก</Select.Option>
                <Select.Option value="roundRobinConsolation">แบ่งกลุ่ม/แพ้คัดออก/สายล่าง</Select.Option>
                {/* <Select.Option value="singleElim">แพ้คัดออก</Select.Option> */}
              </Select>
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </div>
  )

}
export default ManageEvent