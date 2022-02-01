import { useEffect, useState, forwardRef, useImperativeHandle } from "react"
import { useSelector } from 'react-redux'
import MyGangCard from "../myGangCard"
import request from "../../utils/request"
import { Divider } from "antd"
const MyGang = (props, ref) => {
  const user = useSelector(state => state.user)
  const [myGang, setMyGang] = useState()

  useEffect(() => {
    if (user.token) {
      fetchData()
    }
  }, [user])

  useImperativeHandle(ref, () => ({
    fetchMyGang() {
      fetchData()
    }
  }), [])

  const fetchData = () => {
    if (user.token) {
      request.get(`/gang/my-gang`,
        { token: user.token }
      ).then(res => {
        setMyGang(res.data)
      })
        .catch(() => { })
    }
  }
  if (!myGang || myGang.length === 0) return <div />

  return (
    <>
      <div style={{ margin: '20px 20px 0 20px' }}>ก๊วนของฉัน</div>
      <div style={{
        overflowX: 'scroll',
        overflowY: 'hidden',
        display: 'flex',
        marginLeft: '5px'
      }}>
        {myGang?.length > 0 && myGang?.map(gang => {
          return <MyGangCard key={`mygang-card-${gang._id}`} gang={gang} style={{ float: 'right' }} />
        })
        }
      </div>
      {props.bottomLine && <Divider />}
    </>
  )

}
export default forwardRef(MyGang)