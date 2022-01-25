import Layout from '../../../components/Layout/tournamentManager'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useTournament } from '../../../utils'
import Loading from '../../../components/loading'
import { useDispatch, useSelector } from 'react-redux'
import { TAB_OPTIONS } from '../../../constant'
import { Switch, Button } from 'antd'
import request from '../../../utils/request'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { Modal } from 'antd'
import axios from 'axios'

const Setting = () => {
  const router = useRouter()
  const { id } = router.query
  const user = useSelector(state => state.user)
  const { tournament, isLoading, isError } = useTournament(id)
  const [isCreator, setIsCreator] = useState(false)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch({ type: 'ACTIVE_MENU', payload: TAB_OPTIONS.TOURNAMENT_MANAGER.SETTING })
  }, [])

  useEffect(() => {
    if (user && tournament && user.playerID === tournament.creator) {
      setIsCreator(true)
    } else {
      setIsCreator(false)
    }
  }, [tournament, user])

  if (isLoading) return <Loading />
  if (isError) return <p>error</p>

  const onToggleActive = (checked) => {
    request.put(`/tournament/${id}`, {
      registerOpen: checked
    }).then(() => mutate())
      .catch(() => { })
  }

  const removeTournament = () => {
    Modal.confirm({
      title: 'คุณแน่ใจที่จะลบรายการแข่งนี้หรือไม่',
      icon: <ExclamationCircleOutlined />,
      content: 'หากลบแล้วจะไม่สามารถกู้คืนข้อมูลได้',
      onOk() {
        axios.delete(`${API_ENDPOINT}/tournament/${id}`,)
          .then(() => { router.push('/tournament') })
          .catch(() => { })
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }

  return (
    <Layout>
      <div style={{ textAlign: 'center', maxWidth: '350px', margin: 'auto', marginTop: '10px' }}>
        <div style={{ fontWeight: 'bold', fontSize: '20px', marginRight: '5px' }}>{tournament.name}</div>
        <div style={{
          width: '200px',
          margin: '5px auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '10px'
        }}>
          <div>เปิดรับสมัคร</div>
          <Switch defaultChecked={tournament.registerOpen} onChange={onToggleActive} />
        </div>
        {/* <div><Button style={{ width: '200px', marginBottom: '10px' }}>สถิติ</Button></div>
        <div><Button type='primary' style={{ width: '200px', marginBottom: '10px' }}>Reset</Button></div> */}
        {isCreator && <div><Button onClick={() => router.push(`/tournament/${id}/manager`)} type='primary' style={{ width: '200px', marginBottom: '50px' }}>ผู้จัดการ</Button></div>}
        {isCreator && <div><Button onClick={removeTournament} type='danger' style={{ width: '200px', marginBottom: '10px' }}>ลบรายการนี้</Button></div>}
      </div>
    </Layout>
  )
}
export default Setting