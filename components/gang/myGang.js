import { useEffect, forwardRef, useImperativeHandle } from "react"
import { useSelector } from 'react-redux'
import MyGangCard from "../myGangCard"
import axios from 'axios'
import { API_ENDPOINT } from "../../config"
import useSWR from "swr"

const fetcher = (url, token, params) => {
  return axios.get(url, {
    headers: {
      'Authorization': `Token ${token}`
    },
    params
  }).then((res) => {
    console.log(res.data)
    return res.data
  })
}
const MyGang = (props, ref) => {
  const user = useSelector(state => state.user)
  const { data: myGangs, mutate } = useSWR(
    `${API_ENDPOINT}/gang/my-gang`,
    (url) => fetcher(url, user.token)
  )

  useEffect(() => {
    console.log('================ user')
    console.log(user)
    if (user.token) {
      mutate()
    }
  }, [user])

  useEffect(() => {
    console.log('------------------didmount')
    console.log(user)
    if (user.token) {
      mutate()
    }
  }, [])

  useImperativeHandle(ref, () => ({
    mutateMyGang() {
      mutate()
    }
  }), [])

  if (!myGangs || myGangs.length === 0 || !user.token) return <div />

  return (
    <><div style={{ margin: '15px 0 0 10px' }}>ก๊วนของฉัน</div>
      <div style={{
        overflowX: 'scroll',
        overflowY: 'hidden',
        display: 'flex',
        marginLeft: '5px'
      }}>
        {myGangs?.length > 0 && myGangs?.map(gang => {
          return <MyGangCard key={`mygang-card-${gang._id}`} gang={gang} style={{ float: 'right' }} />
        })
        }
      </div>
      {props.bottomLine && <div style={{ border: '1px solid #eee', width: '100%', marginTop: '5px' }}></div>}
    </>
  )

}
export default forwardRef(MyGang)