import { COLOR } from "../constant"

const Greeting = (props) => {
  return (
    <div style={{ margin: '20px 20px' }}>
      <div style={{ color: COLOR.MINOR_THEME, fontSize: '30px' }}>
        สวัสดี, {props.user.displayName}
      </div>
    </div>
  )
}
export default Greeting