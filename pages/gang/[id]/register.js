import { Button, Modal } from 'antd'
import axios from 'axios'
import { API_ENDPOINT } from '../../../config'
import { useRouter } from 'next/router'
import { useSelector } from 'react-redux'
import Layout from '../../../components/Layout/noFooter'
const Register = () => {
  const router = useRouter()
  const { id } = router.query
  const { user } = useSelector(state => state)
  const joinGang = () => {
    if (user.playerID) {
      axios.post(`${API_ENDPOINT}/gang/register`, {
        gangID: id,
        player: {
          _id: user.playerID
        }
      }).then(() => router.push(`/gang/${id}`))
    } else {
      Modal.info({
        title: 'กรุณาเข้าสู่ระบบ',
        content: (
          <div>
            <p>คุณจำเป็นต้องเข้าสู่ระบบเพื่อเข้าร่วมก๊วน</p>
          </div>
        ),
        onOk() { router.push('/login') },
      })
    }

  }
  return <div style={{ width: '100%', marginTop: '100px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><Button type='primary' onClick={joinGang}>เข้าร่วมก๊วนนี้</Button></div >
}

Register.getLayout = (page) => {
  return (
    <Layout>
      {page}
    </Layout>
  )
}

export default Register