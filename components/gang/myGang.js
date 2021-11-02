import { useEffect, useState } from "react"
import { useSelector } from 'react-redux'
import MyGangCard from "../myGangCard"
import axios from 'axios'
import { API_ENDPOINT } from "../../config"
const MyGang = (props) => {
  const user = useSelector(state => state.user)
  const [myGang, setMyGang] = useState()

  useEffect(() => {
    if (user.token) {
      fetchData()
    }
  }, [user])

  const fetchData = () => {
    if (user.token) {
      axios.get(`${API_ENDPOINT}/gang/my-gang`, {
        headers: {
          'Authorization': `Token ${user.token}`
        }
      }).then(res => {
        setMyGang(res.data)
      })
        .catch(() => { })
    }
  }
  if (!myGang || myGang.length === 0) return <div />

  return (
    <><div style={{ margin: '15px 0 0 10px' }}>ก๊วนของฉัน</div>
      <div style={{
        width: '100%',
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
      {props.bottomLine && <div style={{ border: '1px solid #eee', width: '100%', marginTop: '20px' }}></div>}
    </>
  )

}
export default MyGang