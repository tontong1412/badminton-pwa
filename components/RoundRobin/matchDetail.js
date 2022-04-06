import React from 'react'
import moment from 'moment'
import { Modal, Form, InputNumber, DatePicker } from 'antd'
import { useState } from 'react'
import request from '../../utils/request'
import { mutate } from 'swr'

const MatchDetail = (props) => {
  const { match, isManager } = props
  const [modalVisible, setModalVisible] = useState(false)
  const [form] = Form.useForm()

  const onFinish = (values) => {
    console.log(values)
    request.put(`/match/${match._id}`, values)
      .then(async () => {
        await mutate()
        setModalVisible(false)
      })
      .catch((e) => console.log(e))
  }
  return (
    <>
      <div onClick={() => {
        if (isManager) {
          setModalVisible(true)
        }
      }}>
        <div>{`#${match.matchNumber}`}</div>
        <div>{moment(match.date).format('l')}</div>
        <div>{moment(match.date).format('LT')}</div>
      </div>
      <Modal
        visible={modalVisible}
        onOk={() => form.submit()}
        onCancel={() => setModalVisible(false)}
      >
        <Form
          name='createPlayer'
          form={form}
          onFinish={onFinish}
          style={{ maxWidth: '350px', margin: 'auto', overflow: 'scroll' }}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          scrollToFirstError
          initialValues={{ matchNumber: match.matchNumber, date: moment(match.date) }}
        >
          <Form.Item
            label='แมตช์ที่'
            name='matchNumber'
          >
            <InputNumber />
          </Form.Item>
          <Form.Item
            label='เวลา'
            name='date'
          >
            <DatePicker showTime format="DD-MMM-YYYY HH:mm" minuteStep={5} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}
export default MatchDetail
