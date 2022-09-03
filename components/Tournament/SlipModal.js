import { Modal, Upload, Button, Divider, message } from 'antd'
import Image from 'next/image'
import { API_ENDPOINT } from '../../config'
import { getBase64, beforeUpload } from '../../utils/image'
import { useState, useEffect } from 'react'
import copy from 'copy-to-clipboard'
import request from '../../utils/request'
import { CopyOutlined } from '@ant-design/icons'
import { COLOR } from '../../constant'
const SlipModal = ({ event, team = {}, visible, setVisible, mutate, isManager, tournament }) => {
  const [loadingImage, setLoadingImage] = useState(false)
  const [slipImage, setSlipImage] = useState()


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

  const getFooter = () => {
    let footer = []
    if (isManager) {
      footer.push(
        < Button
          key='paid'
          onClick={onMarkAsPaid}
          style={{ marginRight: '5px' }}
        >
          จ่ายแล้ว
        </Button>)
    }
    footer.push(<Upload
      key='upload-slip'
      action={`${API_ENDPOINT}/mock`}
      name='file'
      onChange={onChangeImage}
      maxCount={1}
      beforeUpload={beforeUpload}
      showUploadList={false}
    >
      <Button style={{ marginRight: '8px' }} type='primary' loading={loadingImage}>อัพโหลด slip</Button>
    </Upload>)

    return footer
  }
  return (
    <Modal
      visible={visible}
      onOk={() => setVisible(false)}
      onCancel={() => setVisible(false)}
      centered
      footer={getFooter()}
      title='ดู/อัพโหลดสลิป'
      destroyOnClose
    >
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <div style={{ fontWeight: 'bold', width: '90px' }}>รายการ:</div>
          <div>{event?.name}</div>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <div style={{ fontWeight: 'bold', width: '90px' }}>ผู้เล่น 1:</div>
          <div>{team?.team?.players[0]?.officialName}</div>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <div style={{ fontWeight: 'bold', width: '90px' }}>ผู้เล่น 2:</div>
          <div>{team?.team?.players[1]?.officialName}</div>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <div style={{ fontWeight: 'bold', width: '90px' }}>ผู้จัดการทีม:</div>
          <div>{team?.contact?.officialName}</div>
          {team?.contact?.displayName && <div>({team?.contact?.displayName})</div>}
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <div style={{ fontWeight: 'bold', width: '90px' }}>ค่าสมัคร:</div>
          <div>{event?.fee}</div>
          <div>บาท</div>
        </div>

        <Divider>ช่องทางโอนเงิน</Divider>
        <div style={{ display: 'flex', gap: '10px' }}>
          <div style={{ fontWeight: 'bold', width: '90px' }}>ช่องทาง:</div>
          <div>{tournament?.payment?.bank}</div>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <div style={{ fontWeight: 'bold', width: '90px' }}>เลขบัญชี:</div>
          <div>{tournament?.payment?.code}</div>
          <div
            onClick={() => {
              copy(tournament?.payment?.code)
              message.success('copied')
            }}
            style={{ color: COLOR.MINOR_THEME }}>
            <CopyOutlined />
          </div>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <div style={{ fontWeight: 'bold', width: '90px' }}>ชื่อบัญชี:</div>
          <div>{tournament?.payment?.name}</div>
        </div>

      </div>
      {
        (slipImage || team?.slip) ?
          <Image objectFit='contain' src={slipImage || team.slip} alt='' width={50} height={50} layout='responsive' />
          : <div style={{ width: '100%', textAlign: 'center', padding: '10px', backgroundColor: '#eee', borderRadius: '5px' }}>ยังไม่ได้อัพโหลดสลิป</div>
      }
    </Modal>
  )
}
export default SlipModal