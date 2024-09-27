import { useSelector, useDispatch } from "react-redux"
import Layout from '../../components/Layout/noFooter'
import { convertTimeToNumber } from "../../utils"
import { COLOR } from "../../constant"
import { Popconfirm, Button, Divider, Upload, message } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'
import request from '../../utils/request'
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import moment from 'moment'
import Image from 'next/image'
import { API_ENDPOINT } from "../../config"
import copy from 'copy-to-clipboard'
import { beforeUpload, getBase64 } from "../../utils/image"

const Booking = () => {
  const { user } = useSelector(state => state)
  const dispatch = useDispatch()
  const router = useRouter()
  const { id } = router.query
  const [booking, setBooking] = useState(null)
  const [loadingImage, setLoadingImage] = useState(false)
  const [slipImage, setSlipImage] = useState()

  useEffect(() => {
    if (id) {
      request.get(`/bookings/${id}`)
        .then(res => {
          console.log(res.data)
          setBooking(res.data)
        })
        .catch(err => console.log(err.response.data))
    }

  }, [id])
  const onChangeImage = (info) => {
    if (info.file.status === 'done') {
      getBase64(info.file.originFileObj, image => {
        setSlipImage(image)
        setLoadingImage(true)
        request.put(`/bookings/${id}`, {
          slip: image,
          paymentStatus: 'pending'
        }, user.token).then(() => {
          booking.slip = image
          setLoadingImage(false)
          mutate()
          setSlipImage()
        }).catch((err) => {
          setLoadingImage(false)
          setSlipImage()
          console.log(err.response.data)
          message.error(err?.response?.data)
        })
      })
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
      message.error(JSON.stringify(info, null, 1));
    }
  }
  if (!booking) return null
  return (
    <Layout previous>
      <div style={{ maxWidth: '600px', }}>
        <div>การจอง: {booking._id}</div>
        <div>สนาม: {booking.venue.name}</div>
        <div>วันที่: {moment(booking.date).format('LL')}</div>
        <div>สถานะ: {booking.status}</div>

        <div style={{ fontSize: '20px', color: COLOR.MINOR_THEME }}>{booking?.venue?.name}</div>
        <div style={{ display: 'flex', padding: '10px', justifyContent: 'space-between', borderBottom: '1px #eee solid' }}>
          <div style={{ display: 'flex', fontWeight: 'bold', color: COLOR.MINOR_THEME }}>
            <div style={{ width: '80px' }}>เวลา</div>
            <div style={{ width: '100px' }}>สนาม</div>
            <div style={{ width: '80px' }}>ราคา</div>
          </div>
        </div>

        {
          booking?.slots.sort((a, b) => {
            if (convertTimeToNumber(a.time) - convertTimeToNumber(b.time) === 0) {
              if (a.court.name > b.court.name) return 1
              if (a.court.name < b.court.name) return -1
            }
            return convertTimeToNumber(a.time) - convertTimeToNumber(b.time)
          }).map((slot, index) =>
            <div key={index} style={{ maxWidth: '600px', display: 'flex', padding: '10px', justifyContent: 'space-between', borderBottom: '1px #eee solid' }}>
              <div style={{ display: 'flex' }}>
                <div style={{ width: '80px' }}>{slot.time}</div>
                <div style={{ width: '100px' }}>{slot.court.name}</div>
                <div style={{ width: '80px' }}>{slot.price}</div>
              </div>
              <Popconfirm
                title="ลบสนามนี้ออกจากการจองของคุณ?"
                onConfirm={() => onRemovePlayer(player._id)}
                onCancel={() => { }}
                okText="Yes"
                cancelText="No"
                placement="topRight"
              ><div
                style={{ marginLeft: '5px', color: 'red' }}>
                  <DeleteOutlined />
                </div>
              </Popconfirm>
            </div>)
        }
      </div>

      <Divider>ช่องทางโอนเงิน</Divider>
      <div style={{ display: 'flex', gap: '10px' }}>
        <div style={{ fontWeight: 'bold', width: '90px' }}>ช่องทาง:</div>
        <div>{booking.venue?.payment?.bank}</div>
      </div>
      <div style={{ display: 'flex', gap: '10px' }}>
        <div style={{ fontWeight: 'bold', width: '90px' }}>เลขบัญชี:</div>
        <div>{booking.venue?.payment?.code}</div>
        <div
          onClick={() => {
            copy(booking.venue?.payment?.code)
            message.success('copied')
          }}
          style={{ color: COLOR.MINOR_THEME }}>
          {/* <CopyOutlined /> */}
          <a>copy</a>
        </div>
      </div>
      <div style={{ display: 'flex', gap: '10px' }}>
        <div style={{ fontWeight: 'bold', width: '90px' }}>ชื่อบัญชี:</div>
        <div>{booking.venue?.payment?.name}</div>
      </div>

      {
        (slipImage || booking?.slip) ?
          <Image objectFit='contain' src={slipImage || booking.slip} alt='' width={50} height={50} layout='responsive' unoptimized />
          : <div style={{ width: '100%', textAlign: 'center', padding: '10px', backgroundColor: '#eee', borderRadius: '5px' }}>ยังไม่ได้อัพโหลดสลิป</div>
      }

      <Upload
        key='upload-slip'
        action={`${API_ENDPOINT}/mock`}
        name='file'
        onChange={onChangeImage}
        maxCount={1}
        beforeUpload={beforeUpload}
        showUploadList={false}
      >
        <Button style={{ marginRight: '8px' }} type='primary' loading={loadingImage}>อัพโหลด slip</Button>
      </Upload>

      {/* <div style={{
        position: 'absolute',
        bottom: '10px',
        width: 'calc(100% - 20px)',
        border: '1px solid #ddd',
        borderRadius: '5px',
        padding: '10px',
        margin: '10px',
        boxShadow: '2px 2px 5px -5px rgba(0,0,0,0.75)',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
      }}>
        <div>
          <div style={{ color: COLOR.MINOR_THEME }} >Total price</div>
          <div style={{ color: COLOR.MINOR_THEME }} ><span style={{ fontSize: '24px', fontWeight: 'bold' }}>{booking.totalPrice}</span> Baht</div>
        </div>
        <div style={{ display: 'flex', gap: '5px' }}>
          <Button size='large' onClick={() => router.push(`/venue/${booking.venue._id}`)}>Back</Button>
          <Button size='large' type='primary' onClick={onConfirmBooking}>Continue</Button>
        </div>
      </div> */}
    </Layout>
  )
}
export default Booking