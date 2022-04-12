import { useSelector } from 'react-redux'
import MyGangCard from "../myGangCard"
import { useMyGang } from "../../utils"
import { Divider } from "antd"
const MyGang = (props) => {
  const user = useSelector(state => state.user)
  const { myGangs } = useMyGang(user.token)
  if (!myGangs || myGangs.length === 0) return <div />
  return (
    <>
      <div style={{ margin: '20px 20px 0 20px' }}>ก๊วนของฉัน</div>
      <div style={{
        overflowX: 'scroll',
        overflowY: 'hidden',
        display: 'flex',
        marginLeft: '5px'
      }}>
        {myGangs?.length > 0 && myGangs?.map(gang => {
          return <MyGangCard key={`mygang-card-${gang._id}`} gang={gang} style={{ float: 'right' }} />
        })}
      </div>
      {props.bottomLine && <Divider />}
    </>
  )
}
export default MyGang