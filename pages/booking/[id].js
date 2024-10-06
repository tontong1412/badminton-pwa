import { useSelector, useDispatch } from "react-redux"
import Layout from '../../components/Layout/noFooter'
import { convertTimeToNumber } from "../../utils"
import { COLOR, TRANSACTION } from "../../constant"
import { Popconfirm, Button, Divider, Upload, message, Tag, Modal } from 'antd'
import request from '../../utils/request'
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import moment from 'moment'
import Image from 'next/image'
import { API_ENDPOINT } from "../../config"
import copy from 'copy-to-clipboard'
import { beforeUpload, getBase64 } from "../../utils/image"
import qrcode from 'qrcode'

// Helper function to calculate time remaining with Moment.js
const calculateTimeRemaining = (expiresAt) => {
  const now = moment(); // Get the current time
  const expiration = moment(expiresAt); // Parse expiresAt as a Moment object
  return expiration.diff(now); // Get the difference in milliseconds
};

// Helper function to format the time remaining in minutes and seconds
const formatTime = (milliseconds) => {
  const duration = moment.duration(milliseconds);
  const minutes = Math.floor(duration.asMinutes());
  const seconds = duration.seconds();
  return `${minutes}:${seconds.toString().padStart(2, '0')}`; // Format as MM:SS
};

const Booking = () => {
  const { user } = useSelector(state => state)
  const dispatch = useDispatch()
  const router = useRouter()
  const { id } = router.query
  const [booking, setBooking] = useState(null)
  const [loadingImage, setLoadingImage] = useState(false)
  const [slipImage, setSlipImage] = useState()
  const [qrSVG, setQrSVG] = useState(null)
  const [timeRemaining, setTimeRemaining] = useState(600);

  useEffect(() => {
    if (id) {
      request.get(`/bookings/${id}`)
        .then(res => {
          setBooking(res.data)
        })
        .catch(err => console.log(err.response.data))
    }

  }, [id])

  useEffect(() => {
    const interval = setInterval(() => {
      const remainingTime = calculateTimeRemaining(booking?.expiresAt);
      if (remainingTime <= 0) {
        clearInterval(interval); // Stop countdown when expired
        Modal.info({
          title: 'หมดเวลา',
          content: 'กรุณาทำการจองใหม่อีกครั้ง',
          onOk: () => router.push('/venue')
        })
      }
      setTimeRemaining(remainingTime);
    }, 1000); // Update every second


    return () => clearInterval(interval); // Clean up on component unmount
  }, [booking?.expiresAt]);

  useEffect(() => {
    if (booking?.venue?.payment?.qrcode) {
      qrcode.toString(booking?.venue?.payment?.qrcode, (err, svg) => {
        if (err) return console.log(err)
        setQrSVG(svg)
      })
    }
  }, [booking])

  const onChangeImage = (info) => {
    if (info.file.status === 'done') {
      getBase64(info.file.originFileObj, image => {
        setSlipImage(image)
        setLoadingImage(true)
        request.put(`/bookings/${id}`, {
          slip: image,
          paymentStatus: 'pending'
        }, user.token).then((res) => {
          booking.slip = image
          setLoadingImage(false)
          setSlipImage()
          setBooking(res.data)
        }).catch((err) => {
          setLoadingImage(false)
          setSlipImage()
          Modal.error({
            title: 'ไม่สำเร็จ',
            content: err?.response?.data
          })
        })
      })
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
      message.error(JSON.stringify(info, null, 1));
    }
  }
  if (!booking) return null
  return (
    <Layout back={{ href: '/venue' }}>
      <div style={{ maxWidth: '600px', fontSize: '18px', marginTop: '30px', }}>
        <div >
          <div style={{ fontSize: '25px', color: COLOR.MINOR_THEME, textAlign: 'center' }}>การจอง: {booking.bookingRef}</div>
          <Divider />
          <div style={{ margin: '10px' }}>
            <div style={{ display: 'flex', gap: '5px' }}><div style={{ fontWeight: 'bold', color: COLOR.MINOR_THEME, width: '80px' }}>สนาม</div> <div>{booking.venue.name}</div></div>
            <div style={{ display: 'flex', gap: '5px' }}><div style={{ fontWeight: 'bold', color: COLOR.MINOR_THEME, width: '80px' }}>วันที่</div> <div>{moment(booking.date).format('LL')}</div></div>
            <div style={{ display: 'flex', gap: '5px' }}><div style={{ fontWeight: 'bold', color: COLOR.MINOR_THEME, width: '80px' }}>สถานะ</div> <Tag color={TRANSACTION[booking?.status].COLOR}>{TRANSACTION[booking?.status].LABEL}</Tag> {booking?.status === 'idle' && `เหลือเวลา ${formatTime(timeRemaining)}`}</div>
            {booking?.status === 'idle' && <div style={{ marginTop: '5px', padding: '10px', fontSize: '16px', border: '1px solid orange', backgroundColor: 'rgb(250,200,70,0.4)', borderRadius: '5px' }}>กรุณาอัพโหลดสลิปภายใน 10 นาที มิเช่นนั้นจะถือว่าการจองไม่สำเร็จ และระบบจะยกเลิกการจองนี้</div>}
          </div>
        </div>
        <div>
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
                {/* <Popconfirm
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
                </Popconfirm> */}
              </div>)
          }
        </div>

        <div style={{ fontSize: '20px', color: COLOR.MINOR_THEME, textAlign: 'center', marginTop: '20px' }}>รวม {booking.price} บาท</div>

        <Divider>ช่องทางโอนเงิน</Divider>
        {qrSVG &&
          <div style={{ textAlign: 'center' }}>
            <div style={{ maxWidth: '250px', margin: '0 auto' }} dangerouslySetInnerHTML={{ __html: qrSVG }} />
            <div style={{ marginTop: '-20px', marginBottom: '10px' }}>{booking.venue?.payment?.name}</div>
          </div>
        }

        <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', gap: '10px', width: '100%' }}>
          {
            (booking.venue?.payment?.code && booking.venue?.payment?.bank) &&
            <div>
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
            </div>
          }
          {
            (slipImage || booking?.slip) ?
              <div><Image objectFit='contain' src={slipImage || booking.slip.replace('/uplaod/', '/upload/q_10/')} alt='' width={50} height={50} layout='responsive' unoptimized /></div>
              : <div style={{ width: '350px', textAlign: 'center', padding: '10px', backgroundColor: '#eee', borderRadius: '5px' }}>ยังไม่ได้อัพโหลดสลิป</div>
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
            <Button style={{ width: '350px' }} type='primary' loading={loadingImage}>อัพโหลด slip</Button>
          </Upload>
          <div style={{ height: '20px' }}></div>
        </div>
      </div>
    </Layout >
  )
}
export default Booking