import { useEffect } from 'react'
import Image from 'next/image'
import { useSelector, useDispatch } from 'react-redux'
import { useRouter } from 'next/router'
import { Button } from 'antd'
import Layout from '../components/Layout'
import { TAB_OPTIONS } from '../constant'
import { EditOutlined } from '@ant-design/icons'

const Account = () => {
  const { user } = useSelector(state => state)
  const dispatch = useDispatch()
  const router = useRouter()
  const logout = () => {
    dispatch({ type: 'LOGOUT' })
    localStorage.clear()
  }
  useEffect(() => {
    dispatch({ type: 'ACTIVE_MENU', payload: TAB_OPTIONS.ACCOUNT })
  }, [])

  if (!user.id) {
    return <div onClick={() => router.push('/login')}>Please login <span style={{ color: '#4F708A' }}>Click here</span></div>
  }
  if (!user.playerID) {
    return <div onClick={() => router.push('/claim-player')}>Please create profile <span style={{ color: '#4F708A' }}>Click here</span></div>
  }

  return (
    <div style={{ textAlign: 'center', paddingTop: '10px' }}>
      <div style={{ width: '100px', height: '100px', borderRadius: '50px', overflow: 'hidden', border: '1px solid #eee', margin: 'auto' }}>
        <Image objectFit='cover' src={user?.photo || `/avatar.png`} alt='' width={100} height={100} />
      </div>
      <div style={{ fontWeight: 'bold', marginTop: '10px' }}>
        {user.displayName || user.officialName}
        <span onClick={() => console.log('edit profile')} style={{ margin: '5px' }}>
          <EditOutlined />
        </span>
      </div>
      {user.displayName && <div>{user.officialName}</div>}
      <div style={{ marginTop: '10px' }}><Button type='danger' onClick={logout}>Log Out</Button></div>
    </div>
  )
}
Account.getLayout = (page) => {
  return (
    <Layout>
      {page}
    </Layout>
  )
}
export default Account