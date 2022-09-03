import { Modal, Form, DatePicker, Input, AutoComplete, Divider, Upload, Button, InputNumber, Select } from "antd"
import { useState, useEffect } from "react"
import { UploadOutlined } from "@ant-design/icons"
import { usePlayers } from '../../utils'
import request from "../../utils/request"
import moment from 'moment'
import { beforeUpload, getBase64 } from "../../utils/image"
import { API_ENDPOINT } from "../../config"
import { useSelector } from "react-redux"
const THAI_BANK = [
  'พร้อมเพย์',
  'ธนาคารไทยพาณิชย์',
  'ธนาคารกสิกรไทย',
  'ธนาคารกรุงไทย',
  'ธนาคารกรุงเทพ',
  'ธนาคารกรุงศรีอยุธยา',
  'ธนาคารทหารไทยธนชาต',
  'ธนาคารเกียรตินาคินภัทร',
]
const TournamentModal = ({ visible, setVisible, tournament = {}, mutate, action = 'update' }) => {
  const [form] = Form.useForm()
  const [contactPerson, setContactPerson] = useState(tournament?.contact?._id);
  const [options, setOptions] = useState([])
  const { players, mutate: mutatePlayer } = usePlayers()
  const [loading, setLoading] = useState(false)
  const user = useSelector(state => state.user)

  useEffect(() => {
    if (tournament?.contact?._id) {
      setContactPerson(tournament?.contact?._id)
    }

  }, [tournament])

  const onFinish = (values) => {
    if (action === 'update') {
      request.put(`/tournament/${tournament?._id}`, {
        ...values,
        startDate: values.date[0],
        endDate: values.date[1],
        contact: {
          _id: contactPerson,
          name: values.contactName,
          tel: values.tel,
          lineID: values.lineID
        },
        payment: {
          bank: values.paymentBank,
          code: values.paymentCode,
          name: values.paymentName
        }
      },
        user.token
      ).then(() => {
        mutatePlayer()
        mutate()
      })
    } else {
      request.post(`/tournament`, {
        ...values,
        startDate: values.date[0],
        endDate: values.date[1],
        contact: {
          _id: user.playerID,
          tel: values.tel,
          lineID: values.lineID
        }
      },
        user.token
      ).then(() => {
        mutatePlayer()
        mutate()
      })
    }


    setVisible(false)
    setLoading(false)
    form.resetFields()
  }

  const onSearch = (searchText) => {
    const searchTextLower = searchText.toLowerCase()
    const searchOptions = players.filter(player =>
      player.displayName?.toLowerCase().includes(searchTextLower)
      || player.officialName?.toLowerCase().includes(searchTextLower)
    ).map(player => {
      return {
        key: player._id,
        value: player.officialName,
        label: (
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>{player.officialName}</div>
          </div>
        )
      }
    })
    setOptions(
      !searchText ? [] : searchOptions,
    )
  }

  const onSelect = (data, options, player) => {
    const selectedPlayer = players.find(player => player._id === options.key)

    setContactPerson(options.key)
    form.setFieldsValue({
      lineID: selectedPlayer.lineID,
      tel: selectedPlayer.tel
    })

  }

  const onChangeImage = (info, field) => {
    if (info.file.status === 'done') {
      getBase64(info.file.originFileObj, image => {
        form.setFieldsValue({
          [field]: image,
        })
      })
    } else if (info.file.status === 'error') {
      // message.error(`${info.file.name} file upload failed.`);
      // message.error(JSON.stringify(info, null, 1));
    } else if (info.file.status === 'removed') {
      form.setFieldsValue({
        [field]: undefined
      })
    }
  }

  return (
    <Modal
      visible={visible}
      onOk={() => form.submit()}
      onCancel={() => {
        setVisible(false)
        form.resetFields()
      }}
      centered
      title='สร้าง/แก้ไขรายการแข่ง'
      confirmLoading={loading}
      destroyOnClose>
      <Form
        name='edit-tournament'
        form={form}
        onFinish={onFinish}
        style={{ maxWidth: '350px', margin: 'auto', height: '500px', overflow: 'scroll' }}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        scrollToFirstError
        initialValues={{
          ...tournament,
          date: [
            tournament.startDate ? moment(tournament.startDate) : null,
            tournament.endDate ? moment(tournament.endDate) : null,
          ],
          deadlineDate: tournament.deadlineDate ? moment(tournament.deadlineDate) : null,
          contactName: tournament?.contact?.displayName || tournament?.contact?.officialName,
          tel: user.tel,
          lineID: user.lineID,
          paymentBank: tournament.payment?.bank,
          paymentCode: tournament.payment?.code,
          paymentName: tournament.payment?.name
        }}
      >
        <Form.Item
          label='ชื่อรายการ'
          name='name'
          rules={[
            { required: true, message: 'กรุณาระบุชื่อรายการ' },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="logo"
          label="Logo"
        >
          <Upload
            name="logo"
            listType="picture"
            key='logo'
            action={`${API_ENDPOINT}/mock`}
            onChange={(info) => onChangeImage(info, 'logo')}
            maxCount={1}
            beforeUpload={beforeUpload}
            showUploadList={true}
          >
            <Button icon={<UploadOutlined />}>Click to upload</Button>
          </Upload>
        </Form.Item>

        <Form.Item
          label='สถานที่'
          name='location'
          rules={[
            { required: true, message: 'กรุณาระบุสถานที่' },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label='วันแข่ง'
          name='date'
          rules={[
            { required: true, message: 'กรุณาระบุวันแข่ง' },
          ]}
        >
          <DatePicker.RangePicker />
        </Form.Item>

        <Form.Item
          label='วันปิดรับสมัคร'
          name='deadlineDate'
          rules={[
            { required: true, message: 'กรุณาระบุวันปิดรับสมัคร' },
          ]}
        >
          <DatePicker />
        </Form.Item>

        <Form.Item
          label='ค่าลูกแบด'
          name='shuttlecockFee'
          rules={[
            { required: true, message: 'กรุณาระบุค่าลูกแบด/ผู้เข้าแข่งขัน/ลูก' },
          ]}
        >
          <InputNumber />
        </Form.Item>

        <Form.Item
          name="poster"
          label="Poster"
        >
          <Upload
            name="poster"
            listType="picture"
            key='poster'
            action={`${API_ENDPOINT}/mock`}
            onChange={(info) => onChangeImage(info, 'poster')}
            maxCount={1}
            beforeUpload={beforeUpload}
            showUploadList={true}
          >
            <Button icon={<UploadOutlined />}>Click to upload</Button>
          </Upload>
        </Form.Item>

        <Divider plain>ผู้จัด</Divider>
        {/* <Form.Item
          label='ชื่อ'
          name='contactName'
          rules={[
            { required: true, message: 'กรุณาระบุชื่อ' },
          ]}
        >
          <AutoComplete
            options={options}
            onSelect={(data, options) => onSelect(data, options, 'contact')}
            onSearch={onSearch}
            onChange={() => setContactPerson()}
          />
        </Form.Item> */}
        <div style={{ textAlign: 'center' }}>{user.officialName}</div>
        <div style={{ textAlign: 'center', marginBottom: '10px' }}>{user.displayName}</div>
        <Form.Item
          label='เบอร์โทรศัพท์'
          name='tel'
          rules={[
            { required: true, message: 'กรุณาระบุเพื่อใช้ในการติดต่อ' },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label='Line ID'
          name='lineID'
        >
          <Input />
        </Form.Item>
        <Divider plain>ช่องทางโอนเงิน</Divider>
        <Form.Item
          label='ธนาคาร'
          name='paymentBank'
          rules={[
            // { required: true, message: 'กรุณาระบุ' },
          ]}
        >
          <Select
            placeholder='กรุณาเลือก'
            allowClear
          >
            {THAI_BANK.map((b, i) => <Select.Option key={i + 1} value={b}>{b}</Select.Option>)}
          </Select>

        </Form.Item>
        <Form.Item
          label='เลขบัญชี'
          name='paymentCode'
        >
          <Input />
        </Form.Item>
        <Form.Item
          label='ชื่อบัญชี'
          name='paymentName'
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default TournamentModal