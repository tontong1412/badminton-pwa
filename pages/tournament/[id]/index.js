import Layout from '../../../components/Layout/tournamentManager'
import { Modal, Divider } from 'antd'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useTournament } from '../../../utils'
import Loading from '../../../components/loading'
import { useDispatch, useSelector } from 'react-redux'
import { COLOR, TAB_OPTIONS } from '../../../constant'
import { Button } from 'antd'
import { useState } from 'react'
import RegisterModal from '../../../components/Tournament/RegisterModal'
import Image from 'next/image'
import moment from 'moment'

const TournamentManagerID = () => {
  const router = useRouter()
  const { id } = router.query
  const { tournament, isLoading, isError } = useTournament(id)
  const [registerModal, setRegisterModal] = useState(false)
  const dispatch = useDispatch()
  const { user } = useSelector(state => state)
  const [posterVisible, setPosterVisible] = useState(true)
  useEffect(() => {
    dispatch({ type: 'ACTIVE_MENU', payload: TAB_OPTIONS.TOURNAMENT_MANAGER.DETAIL })
  }, [])

  if (isLoading) return <Loading />
  if (isError) return <p>error</p>

  return (
    <Layout>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
        <div style={{ widht: '200px', height: '200px', overflow: 'hidden', margin: 'auto', marginTop: '20px' }}>
          <Image alt='logo' src={tournament?.logo || '/icon/logo.png'} objectFit='contain' width={200} height={200} />
        </div>
        <h2>{tournament.name}</h2>
        <div>{`${moment(tournament.startDate).format('ll')}-${moment(tournament.endDate).format('ll')}`}</div>
        <div>รายการที่รับสมัคร</div>
        <div style={{
          display: 'flex',
          width: '100%',
          overflow: 'scroll',
          flexWrap: 'nowrap'
        }}>
          {tournament.events.map((event, index) => {
            return (
              <div
                key={`event-${index + 1}`}
                style={{
                  minWidth: '300px',
                  padding: '20px',
                  margin: '10px',
                  boxShadow: '2px 2px 10px -5px rgba(0,0,0,0.75)',
                  borderRadius: '10px'
                }}
              >
                <div style={{ fontWeight: 'bold' }}>{event.name}</div>
                <Divider />
                <div>{`จำนวน ${event.limit} คู่`}</div>
                {event?.prize && <div>{`รางวัล ${event.prize}`}</div>}
              </div>
            )
          })}
        </div>
        {tournament?.poster && <div style={{ color: COLOR.MINOR_THEME }} onClick={() => setPosterVisible(true)}>ดูรายละเอียดเพิ่มเติม</div>}
        <Button style={{ width: '80%' }} type='primary' onClick={() => {
          if (user.id) setRegisterModal(true)
          else {
            Modal.info({
              title: 'กรุณา Log in ก่อนสมัครแข่งขัน',
              onOk: () => router.push('/login')
            })
          }

        }}>
          สมัครแข่งขัน
        </Button>
      </div>
      <RegisterModal
        visible={registerModal}
        setVisible={setRegisterModal}
        tournamentID={id}
      />
      {tournament?.poster && <Modal
        visible={posterVisible}
        onCancel={() => setPosterVisible(false)}
        footer={null}
        centered
        modalRender={() => <div style={{ width: '100%' }}>
          <Image alt='logo'
            src={tournament?.poster || '/icon/logo.png'}
            width={434}
            height={614}
            objectFit='cover'
            fill='responsive'
          />
        </div>}
      >
      </Modal>}
    </Layout >
  )
}
export default TournamentManagerID