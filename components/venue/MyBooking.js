import Link from "next/link"
import { useMyBookings } from "../../utils"
import { useSelector } from "react-redux"
import { COLOR, TRANSACTION } from "../../constant"
import moment from 'moment'
import { Tag, Divider } from 'antd';
import { EnvironmentOutlined, ClockCircleOutlined, CreditCardOutlined } from '@ant-design/icons'



const MyBooking = ({ bottomLine }) => {
  const { user } = useSelector(state => state)
  const { bookings } = useMyBookings(user.token)
  const findStartTime = (booking) => {
    const sortedSlots = booking.slots.sort((a, b) => parseInt(a.time) - parseInt(b.time))
    return sortedSlots[0].time
  }
  const dateText = (date) => {
    if (moment(date).isSame(moment(), 'day')) {
      return 'Today'
    } else if (moment(date).isSame(moment().add(1, 'days'), 'day')) {
      return 'Tomorrow'
    }
    return moment(date).format('dd DD MMM')
  }
  if (!bookings || bookings?.length <= 0) return null
  return (
    <div style={{ margin: '15px 15px 0 15px' }}>
      <div >การจองของฉัน</div>
      <div style={{ display: 'flex', overflow: 'scroll', gap: '5px', }}>
        {bookings?.map(b => <Link
          href={`/booking/${b._id}`}
          passHref
          key={b.bookingRef}>
          <div style={{ margin: '5px 0', padding: '10px', minWidth: '200px', maxWidth: '250px', border: '1px solid #eee', borderRadius: '5px', boxShadow: '2px 2px 10px -5px rgba(0,0,0,0.75)' }}>
            <div style={{ width: '100%', overflow: 'hidden', textOverflow: 'ellipsis', textWrap: 'nowrap' }}><ClockCircleOutlined /> {`${dateText(b.date)} - ${findStartTime(b)}`}</div>
            <div style={{ width: '100%', overflow: 'hidden', textOverflow: 'ellipsis', textWrap: 'nowrap' }}><EnvironmentOutlined /> {b?.venue?.name}</div>
            <div ><CreditCardOutlined /> <Tag color={TRANSACTION[b?.status].COLOR}>{TRANSACTION[b?.status].LABEL}</Tag></div>
          </div>
        </Link>)}
      </div>
      {bottomLine && <Divider />}
    </div>

  )
}
export default MyBooking