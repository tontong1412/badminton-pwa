import Layout from '../components/Layout'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { TAB_OPTIONS } from '../constant'
const Noti = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch({ type: 'ACTIVE_MENU', payload: TAB_OPTIONS.NOTI })
  }, [])
  const notifications = [
    {
      _id: '1',
      content: 'คุณได้สมัครแข่งขันรายการ Test Tournament 01 ประเภท P/P- คู่กับ Levi Ackerman หากไม่ใช่คุณ กรุณาติดต่อผู้จัดการแข่งขัน',
      isRead: false,
    },
    {
      _id: '2',
      content: 'ผลการประเมินมือของคุณในการแข่งขันรายการ Test Tournament 01 ประเภท P/P- คู่กับ Levi Ackerman : "ผ่าน" กรุณาชำระเงินภายใน วัน/เวลาที่กำหนด',
      isRead: false,
    },
  ]
  return (
    <div >
      {notifications.map(msg => {
        return (
          <div key={msg._id} style={{ margin: '10px', padding: '20px', boxShadow: '2px 2px 10px -5px rgba(0,0,0,0.75)', borderRadius: '5px' }}>
            <div>{msg.content}</div>
          </div>
        )
      })}
    </div >
  )
}
Noti.getLayout = (page) => {
  return (
    <Layout>
      {page}
    </Layout>
  )
}
export default Noti