import { Modal, Form, DatePicker, Input, AutoComplete, Divider, Upload, Button } from "antd"
import { useState, useEffect } from "react"
import { UploadOutlined } from "@ant-design/icons"
import { usePlayers } from '../../utils'
import request from "../../utils/request"
import moment from 'moment'
import { beforeUpload, getBase64 } from "../../utils/image"
import { API_ENDPOINT } from "../../config"
const TournamentModal = ({ visible, setVisible, tournament, mutate }) => {
  const [form] = Form.useForm()
  const [contactPerson, setContactPerson] = useState(tournament?.contact?._id);
  const [options, setOptions] = useState([])
  const { players, mutate: mutatePlayer } = usePlayers()
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setContactPerson(tournament?.contact?._id)
  }, [tournament])

  const onFinish = (values) => {
    request.put(`/tournament/${tournament?._id}`, {
      ...values,
      startDate: values.date[0],
      endDate: values.date[1],
      contact: {
        _id: contactPerson,
        name: values.contactName,
        tel: values.tel,
        lineID: values.lineID
      }
    }).then(() => {
      mutatePlayer()
      mutate()
    })

    setVisible(false)
    setLoading(false)
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
      message.error(`${info.file.name} file upload failed.`);
      message.error(JSON.stringify(info, null, 1));
    }
  }

  return (
    <Modal
      visible={visible}
      onOk={() => form.submit()}
      onCancel={() => setVisible(false)}
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
          tel: tournament?.contact?.tel,
          lineID: tournament?.contact?.lineID
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
        <Form.Item
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
        </Form.Item>
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
      </Form>
    </Modal>
  )
}

export default TournamentModal