import { Modal, Upload, Button, Form, Radio, InputNumber, Divider } from 'antd'
import Image from 'next/image'
import { API_ENDPOINT } from '../../config'
import { getBase64, beforeUpload } from '../../utils/image'
import { useState, useEffect } from 'react'
import request from '../../utils/request'
const ShuttlecockModal = ({ event, team = {}, visible, setVisible, mutate, isManager, tournament }) => {
  const [loadingImage, setLoadingImage] = useState(false)
  const [slipImage, setSlipImage] = useState()
  const [form] = Form.useForm()
  const [totalToPay, setTotalToPay] = useState(0)

  const onChangeImage = (info) => {
    if (info.file.status === 'done') {
      getBase64(info.file.originFileObj, image => {
        setSlipImage(image)
        setLoadingImage(true)
        request.post(`/event/team`, {
          slip: image,
          eventID: event._id,
          teamID: team._id,
          paymentStatus: isManager ? 'paid' : 'pending'
        }).then(() => {
          team.slip = image
          setLoadingImage(false)
          mutate()
          setSlipImage()
        }).catch(() => {
          setLoadingImage(false)
          setSlipImage()
        })
      })
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
      message.error(JSON.stringify(info, null, 1));
    }
  }

  const onMarkAsPaid = () => {
    request.post('/event/team', {
      eventID: event._id,
      teamID: team._id,
      value: 'paid',
      field: 'paymentStatus',
    }).then(() => {
      mutate()
      setVisible(false)
      console.log(team)
    })
      .catch((error) => console.log(error))
  }

  const onManageShuttlecock = (values) => {
    request.post('/event/shuttlecock-credit', {
      eventID: event._id,
      teamID: team.team._id,
      action: values.action,
      amount: values.amount
    }).then(() => {
      setVisible(false)
      mutate()
      form.resetFields()
      setTotalToPay()
    })
  }

  return (
    <Modal
      visible={visible}
      onOk={() => form.submit()}
      okText='ตกลง'
      onCancel={() => setVisible(false)}
      centered
      // footer={getFooter()}
      title='เครดิตลูกแบด'
      destroyOnClose
    >
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <div style={{ fontWeight: 'bold', width: '150px' }}>รายการ:</div>
          <div>{event?.name}</div>
        </div>
        {
          team?.team?.players.map((player, index) => (
            <div key={index + 1} style={{ display: 'flex', gap: '10px' }}>
              <div style={{ fontWeight: 'bold', width: '150px' }}>ผู้เล่น {index + 1}:</div>
              <div>{player?.officialName}</div>
            </div>
          ))
        }
        <div style={{ display: 'flex', gap: '10px' }}>
          <div style={{ fontWeight: 'bold', width: '150px' }}>จำนวนลูกแบดคงเหลือ:</div>
          <div>{team?.shuttlecockCredit}</div>
        </div>
      </div>
      <Divider />
      {
        isManager &&
        <Form
          onFinish={onManageShuttlecock}
          initialValues={{ action: 'increment', amount: 10 }}
          labelCol={{ span: 12 }}
          wrapperCol={{ span: 12 }}
          form={form}
          onFieldsChange={(field) => { if (field[0]?.name[0] === 'amount') setTotalToPay(tournament?.shuttlecockFee * field[0].value) }}
        >
          <Form.Item
            name="action"
            label='รายการ'
          >
            <Radio.Group >
              <Radio value={'increment'}>เติม</Radio>
              <Radio value={'decrement'}>คืน</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            name="amount"
            label='จำนวน'
          >
            <InputNumber />
          </Form.Item>
          <Form.Item
            label='รวมเป็นเงิน'
          >
            <div>{totalToPay || tournament?.shuttlecockFee * 10}</div>
          </Form.Item>
        </Form>
      }
    </Modal>
  )
}
export default ShuttlecockModal