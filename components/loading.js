import { Spin } from 'antd'
const Loading = () => {
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Spin size='large' />
    </div>
  )
}
export default Loading