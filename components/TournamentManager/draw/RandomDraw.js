import request from "../../../utils/request"
import { Tabs, Menu, Dropdown, Button, Radio, Table, Form, Input, Checkbox, InputNumber, Modal, Popconfirm } from 'antd'
import {
  SyncOutlined
} from '@ant-design/icons'
import { COLOR } from "../../../constant"
import { useState } from "react"



const RandomButton = (props) => (
  <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
    < Button
      {...props}
      htmlType="submit"
      style={{
        padding: '20px 20px',
        backgroundColor: COLOR.MAIN_THEME,
        display: 'flex',
        alignItems: 'center',
        gap: '5px',
        borderRadius: '50px',
        justifyContent: 'center'
      }}>
      <div>Random</div>
      <SyncOutlined />
    </Button>
  </div>
)


const RandomDraw = ({ event, mutate }) => {
  const [loading, setLoading] = useState(false)

  const onRandomOrder = (values, event) => {
    setLoading(true)
    request.post('/event/random-order', {
      eventID: event._id,
      groupCount: values.groupCount,
      qualified: values.qualified,
      qualifiedConsolation: values.qualifiedConsolation
    }).then(async () => {
      await mutate()
      setLoading(false)
    })
      .catch((err) => {
        console.log(err)
        setLoading(false)
      })
  }

  switch (event.format) {
    case 'singleElim':
      return <RandomButton onClick={() => onRandomOrder({}, event)} loading={loading} />
    default:
      return (
        <Form
          labelCol={{ span: 12 }}
          wrapperCol={{ span: 24 }}
          onFinish={(values) => onRandomOrder(values, event)}
        >
          <Form.Item
            label="จำนวนกลุ่ม"
            name="groupCount"
            rules={[{ required: true, message: 'กรุณาระบุจำนวนกลุ่ม' }]}
          >
            <InputNumber />
          </Form.Item>
          <Form.Item
            label="จำนวนคู่รอบ knock out"
            name="qualified"
            rules={[{ required: true, message: 'กรุณาระบุจำนวนคู่ที่เข้ารอบ' }]}
          >
            <InputNumber />
          </Form.Item>

          {event?.format === 'roundRobinConsolation' &&
            <Form.Item
              label="จำนวนคู่ในสายล่าง"
              name="qualifiedConsolation"
              rules={[{ required: true, message: 'กรุณาระบุจำนวนคู่ที่เข้ารอบสายล่าง' }]}
            >
              <InputNumber />
            </Form.Item>
          }
          <Form.Item wrapperCol={{ span: 24 }}>
            <RandomButton loading={loading} />
          </Form.Item>
        </Form>
      )
  }
}
export default RandomDraw