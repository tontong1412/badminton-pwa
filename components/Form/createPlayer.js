import { Form, Input, Select, DatePicker, Button } from 'antd'
const CreatePlayerForm = ({ onFinish, loading }) => {
  return <Form
    name='createPlayer'
    onFinish={onFinish}
    style={{ maxWidth: '350px', margin: 'auto' }}
    labelCol={{ span: 8 }}
    wrapperCol={{ span: 16 }}
  >
    <div>อีกนิดเดียว!</div>
    <Form.Item
      label='ชื่อ-นามสกุล'
      name='officialName'
      rules={[
        {
          required: true,
          message: 'Please input your username!',
        },
      ]}
      help='ชื่อจริง-นามสกุล เพื่อใช้ในการระบุตัวตน'
    >
      <Input />
    </Form.Item>
    <Form.Item
      label='ชื่อเล่น'
      name='displayName'
      help='ชื่อที่ใช้แสดงบนแอพ จะเป็นชื่อเล่น หรือชื่อที่คนอื่นๆในวงการใช้เรียกคุณก็ได้'
    >
      <Input />
    </Form.Item>

    <Form.Item
      label='เพศ'
      name='gender'
      help='ใช้สำหรับสมัครแข่งขัน'
    >
      <Select placeholder="เลือก">
        <Select.Option value='male'>ชาย</Select.Option>
        <Select.Option value='female'>หญิง</Select.Option>
      </Select>
    </Form.Item>

    <Form.Item
      label='วันเกิด'
      name='birthDate'
      help='ใช้สำหรับสมัครแข่งขัน'
    >
      <DatePicker />
    </Form.Item>
    <Form.Item
      label='เบอร์โทรศัพท์'
      name='tel'
      help='ไม่เปิดเผยต่อสาธารณะ ใช้เมื่อสมัครแข่งขันเท่านั้น'
    >
      <Input />
    </Form.Item>
    <Form.Item
      label='Line ID'
      name='lineID'
      help='ไม่เปิดเผยต่อสาธารณะ ใช้เมื่อสมัครแข่งขันเท่านั้น'
    >
      <Input />
    </Form.Item>
    <Form.Item style={{ textAlign: "center", marginTop: '20px' }}>
      <Button type='primary' htmlType='submit' loading={loading}>
        Submit
      </Button>
    </Form.Item>
  </Form>
}
export default CreatePlayerForm