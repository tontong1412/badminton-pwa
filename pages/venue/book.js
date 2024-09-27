import { useSelector, useDispatch } from "react-redux"
import Layout from '../../components/Layout/noFooter'
import { convertTimeToNumber } from "../../utils"
import { COLOR } from "../../constant"
import { Popconfirm, Button, Modal } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'
import request from '../../utils/request'
import { useRouter } from "next/router"


const Booking = () => {
  const { booking, user } = useSelector(state => state)
  const dispatch = useDispatch()
  const router = useRouter()
  const onConfirmBooking = async () => {
    request.post('/venue/book', {
      venue: booking.venue._id,
      slots: booking.slots,
      price: booking.totalPrice,
      date: booking.date,
      name: user.displayName || user.officialName
    },
      user.token)
      .then(res => {
        console.log(res.data)
        router.push(`/booking/${res.data._id}`)
        dispatch({
          type: 'BOOK_COURT',
          payload: {},
        })

      })
      .catch(err => {
        console.log(err.response.data)
        Modal.error({
          title: 'Error',
          content: err.response?.data?.message || 'มีบางอย่างผิดพลาด กรุณาลองใหม่อีกครั้ง',
        })
      })

  }
  return (
    <Layout previous>
      <div style={{ maxWidth: '600px', }}>


        <div style={{ fontSize: '20px', color: COLOR.MINOR_THEME }}>{booking?.venue?.name}</div>
        <div style={{ display: 'flex', padding: '10px', justifyContent: 'space-between', borderBottom: '1px #eee solid' }}>
          <div style={{ display: 'flex', fontWeight: 'bold', color: COLOR.MINOR_THEME }}>
            <div style={{ width: '80px' }}>เวลา</div>
            <div style={{ width: '100px' }}>สนาม</div>
            <div style={{ width: '80px' }}>ราคา</div>
          </div>
        </div>

        {
          booking?.slots?.sort((a, b) => {
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

      <div style={{
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
      </div>
    </Layout>
  )
}
export default Booking