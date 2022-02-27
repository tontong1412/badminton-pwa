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
      numberOfCourtKnockOut: values.numberOfCourtKnockOut,
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
        labelCol={{ span: 12 }}
        wrapperCol={{ span: 12 }}
        // initialValues={}
        onFinish={onFinish}
        // onFinishFailed={onFinishFailed}
        autoComplete="off"
        style={{ margin: '10px' }}
      >
        <Divider plain>รอบแบ่งกลุ่ม</Divider>
        <Form.Item
          label="วัน/เวลาที่เริ่มแข่ง"
          name="groupStartTime"
          rules={[{ required: true, message: 'กรุณาระบุ' }]}
        >
          <DatePicker showTime format="DD-MMM-YYYY HH:mm" minuteStep={5} />
        </Form.Item>
        <Form.Item
          label="เวลาที่ใช้ต่อคู่"
          name="groupDuration"
          rules={[{ required: true, message: 'กรุณาระบุ' }]}
        >
          <InputNumber />
        </Form.Item>
        <Form.Item
          label="จำนวนคอร์ด"
          name="numberOfCourt"
          rules={[{ required: true, message: 'กรุณาระบุ' }]}
        >
          <InputNumber />
        </Form.Item>

        <Divider plain>รอบแพ้คัดออก</Divider>
        <Form.Item
          label="วัน/เวลาที่เริ่มแข่ง"
          name="knockOutStartTime"
        // rules={[{ required: true, message: 'กรุณาระบุ' }]}
        >
          <DatePicker showTime format="DD-MMM-YYYY HH:mm" minuteStep={5} />
        </Form.Item>
        <Form.Item
          label="เวลาที่ใช้ต่อคู่"
          name="knockOutDuration"
          rules={[{ required: true, message: 'กรุณาระบุ' }]}
        >
          <InputNumber />
        </Form.Item>
        <Form.Item
          label="จำนวนคอร์ด"
          name="numberOfCourtKnockOut"
          rules={[{ required: true, message: 'กรุณาระบุ' }]}
        >
          <InputNumber />
        </Form.Item>



        <Form.Item wrapperCol={{ span: 24 }}>
          <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            <Button type="primary" htmlType="submit" loading={loading} style={{ minWidth: "350px" }}>
              ตกลง
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>

  )
}
export default ArrangeMatch