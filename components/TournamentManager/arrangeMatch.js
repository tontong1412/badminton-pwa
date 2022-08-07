import { Table, Modal, Form, Input, Checkbox, Radio, Button, DatePicker, InputNumber, Divider, Select } from "antd"
import { useState } from "react"
import request from "../../utils/request"
import ServiceErrorModal from '../../components/ServiceErrorModal'
const ArrangeMatch = ({ tournamentID, setStep }) => {
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm()
  const [method, setMethod] = useState('minWait')
  const onFinish = (values) => {
    setLoading(true)
    request.post('/match/arrange', {
      tournamentID,
      numberOfCourt: values.numberOfCourt,
      numberOfCourtKnockOut: values.numberOfCourtKnockOut || values.numberOfCourt,
      startTime: {
        group: values.groupStartTime,
        knockOut: values.knockOutStartTime
      },
      matchDuration: {
        group: values.groupDuration,
        knockOut: values.knockOutDuration || values.groupDuration,
      },
      timeGap: {
        group: values.timeGapGroup || 2, // fix
        knockOut: values.timeGapKnockOut || values.timeGapGroup || 2 // fix
      },
      method: values.method
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

  const renderOfficialSort = () => (
    <>
      <Divider plain>รอบแบ่งกลุ่ม</Divider>
      <Form.Item
        label="วัน/เวลาที่เริ่มแข่ง"
        name="groupStartTime"
        rules={[{ required: true, message: 'กรุณาระบุ' }]}
      >
        <DatePicker showTime format="DD-MMM-YYYY HH:mm" minuteStep={5} />
      </Form.Item>
      <Form.Item
        label="เวลาที่ใช้ต่อคู่ (นาที)"
        name="groupDuration"
        rules={[{ required: true, message: 'กรุณาระบุ' }]}
      >
        <InputNumber placeholder="30" />
      </Form.Item>
      <Form.Item
        label="จำนวนคอร์ด"
        name="numberOfCourt"
        rules={[{ required: true, message: 'กรุณาระบุ' }]}
      >
        <InputNumber min={1} />
      </Form.Item>

      <Divider plain>รอบแพ้คัดออก</Divider>
      <Form.Item
        label="วัน/เวลาที่เริ่มแข่ง"
        name="knockOutStartTime"
      >
        <DatePicker showTime format="DD-MMM-YYYY HH:mm" minuteStep={5} />
      </Form.Item>
      <Form.Item
        label="เวลาที่ใช้ต่อคู่ (นาที)"
        name="knockOutDuration"
      // rules={[{ required: true, message: 'กรุณาระบุ' }]}
      >
        <InputNumber />
      </Form.Item>
      <Form.Item
        label="จำนวนคอร์ด"
        name="numberOfCourtKnockOut"
      // rules={[{ required: true, message: 'กรุณาระบุ' }]}
      >
        <InputNumber />
      </Form.Item>
    </>
  )

  const renderMinWaitSort = () => {
    return (
      <div>
        <Form.Item
          label="วัน/เวลาที่เริ่มแข่ง"
          name="groupStartTime"
          rules={[{ required: true, message: 'กรุณาระบุ' }]}
        >
          <DatePicker showTime format="DD-MMM-YYYY HH:mm" minuteStep={5} />
        </Form.Item>
        <Form.Item
          label="วัน/เวลาที่เริ่มแข่ง (รอบ Knock Out)"
          name="knockOutStartTime"
        >
          <DatePicker showTime format="DD-MMM-YYYY HH:mm" minuteStep={5} />
        </Form.Item>
        <Form.Item
          label="เวลาที่ใช้ต่อคู่ (นาที)"
          name="groupDuration"
          rules={[{ required: true, message: 'กรุณาระบุ' }]}
        >
          <InputNumber placeholder="30" />
        </Form.Item>
        <Form.Item
          label="จำนวนคอร์ด"
          name="numberOfCourt"
          rules={[{ required: true, message: 'กรุณาระบุ' }]}
        >
          <InputNumber min={1} />
        </Form.Item>

        {/* <Form.Item
          label="จำนวนรอบสนามก่อนแมตช์ถัดไป แบ่งกลุ่ม"
          name="timeGapGroup"
          rules={[{ required: true, message: 'กรุณาระบุ' }]}
        >
          <InputNumber min={1} />
        </Form.Item>
        <Form.Item
          label="จำนวนรอบสนามก่อนแมตช์ถัดไป KnockOut"
          name="timeGapKnockOut"
        >
          <InputNumber min={1} />
        </Form.Item> */}
      </div>
    )
  }
  return (
    <div style={{ marginTop: '30px' }}>

      <Form
        form={form}
        name="arrange-match"
        labelCol={{ span: 12 }}
        wrapperCol={{ span: 12 }}
        onFinish={onFinish}
        // onFinishFailed={onFinishFailed}
        autoComplete="off"
        style={{ margin: '10px' }}
        initialValues={{ method: 'minWait', timeGapGroup: 2, timeGapKnockOut: 2, groupDuration: 30 }}
      >
        <Form.Item
          label='การเรียงแมตช์'
          name='method'
          rules={[{ required: true, message: 'กรุณาระบุ' }]}
        >
          <Radio.Group onChange={(e) => setMethod(e.target.value)} value={method}>
            <Radio value={'minWait'}>รอน้อย</Radio>
            <Radio value={'official'}>ตามรอบ</Radio>
          </Radio.Group>
        </Form.Item>

        {method === 'official' ? renderOfficialSort() : renderOfficialSort() /*same form*/}



        < Form.Item wrapperCol={{ span: 24 }}>
          <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            <Button type="primary" htmlType="submit" loading={loading} style={{ minWidth: "350px" }}>
              ตกลง
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div >

  )
}
export default ArrangeMatch