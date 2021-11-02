import { useEffect, useState } from "react"
import { useSelector } from 'react-redux'
import MyGangCard from "../myGangCard"
import axios from 'axios'
import { API_ENDPOINT } from "../../config"
const MyGang = () => {
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

  return (
    <><div style={{ margin: '15px 0 0 5px' }}>ก๊วนของฉัน</div>
      <div style={{
        width: '100%',
        overflowX: 'scroll',
        overflowY: 'hidden',
        display: 'flex',
      }}>
        {myGang?.length > 0 && myGang?.map(gang => {
          return <MyGangCard key={`mygang-card-${gang._id}`} gang={gang} style={{ float: 'right' }} />
        })
        }
      </div>
    </>
  )

}
export default MyGang