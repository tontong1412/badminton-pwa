import { Table, Modal, Form, Input, Checkbox, Button, DatePicker, InputNumber, Divider, Select } from "antd"
import { useState } from "react"
import request from "../../utils/request"
import ServiceErrorModal from '../../components/ServiceErrorModal'
const ArrangeMatch = ({ tournamentID, setStep }) => {
  const [loading, setLoading] = useState(false)
  const onFinish = (values) => {
    setLoading(true)
    request.post('/match/arrange', {
      tournamentID,
      numberOfCourt: values.numberOfCourt,
      startTime: {
        group: values.groupStartTime,
        knockOut: values.knockOutStartTime
      },
      matchDuration: {
        group: values.groupDuration,
        knockOut: values.knockOutDuration
      }
    }).then(async () => {
      setLoading(false)
      await request.put(`/tournament/${tournamentID}`, {
        status: 'ongoing'
      })
      setStep(4)
    })
      .catch(err => {
        console.log(err)
        ServiceErrorModal(() => setLoading(false))

      })
  }
  return (
    <div style={{ marginTop: '30px' }}>

      <Form
        name="arrange-match"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        // initialValues={}
        onFinish={onFinish}
        // onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item label="รอบแบ่งกลุ่ม" colon={false} />
        <Form.Item
          label="วัน/เวลาที่เริ่มแข่ง"
          name="groupStartTime"
          rules={[{ required: true, message: 'กรุณาระบุ' }]}
        >
          <DatePicker showTime format="DD-MMM-YYYY HH:mm" />
        </Form.Item>
        <Form.Item
          label="เวลาที่ใช้ต่อคู่"
          name="groupDuration"
          rules={[{ required: true, message: 'กรุณาระบุ' }]}
        >
          <InputNumber />
        </Form.Item>

        <Divider />

        <Form.Item label="รอบแพ้คัดออก" colon={false} />
        <Form.Item
          label="วัน/เวลาที่เริ่มแข่ง"
          name="knockOutStartTime"
        // rules={[{ required: true, message: 'กรุณาระบุ' }]}
        >
          <DatePicker showTime format="DD-MMM-YYYY HH:mm" />
        </Form.Item>
        <Form.Item
          label="เวลาที่ใช้ต่อคู่"
          name="knockOutDuration"
          rules={[{ required: true, message: 'กรุณาระบุ' }]}
        >
          <InputNumber />
        </Form.Item>

        <Divider />

        <Form.Item
          label="จำนวนคอร์ด"
          name="numberOfCourt"
          rules={[{ required: true, message: 'กรุณาระบุ' }]}
        >
          <InputNumber />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit" loading={loading}>
            ตกลง
          </Button>
        </Form.Item>
      </Form>
    </div>

  )
}
export default ArrangeMatch