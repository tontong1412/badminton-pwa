import Layout from '../../../components/Layout/tournamentManager'
import { Modal, Divider, message } from 'antd'
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
import { EnvironmentOutlined, CopyOutlined } from '@ant-design/icons'
import TournamentModal from '../../../components/Tournament/TournamentModal'
import copy from 'copy-to-clipboard'


const TournamentManagerID = () => {
  const router = useRouter()
  const { id } = router.query
  const { tournament, isLoading, isError, mutate } = useTournament(id)
  const [registerModal, setRegisterModal] = useState(false)
  const dispatch = useDispatch()
  const { user } = useSelector(state => state)
  const [posterVisible, setPosterVisible] = useState(false)
  const [isManager, setIsManager] = useState(false)
  const [isCreator, setIsCreator] = useState(false)
  const [tournamentModal, setTournamentModal] = useState(false);
  useEffect(() => {
    dispatch({ type: 'ACTIVE_MENU', payload: TAB_OPTIONS.TOURNAMENT_MANAGER.DETAIL })
  }, [])

  useEffect(() => {
    if (user && tournament && tournament?.managers?.map(e => e._id).includes(user.playerID)) {
      setIsManager(true)
    } else {
      setIsManager(false)
    }

    if (user && tournament && (user.playerID === tournament.creator)) {
      setIsCreator(true)
    } else {
      setIsCreator(false)
    }

  }, [user, tournament])

  const onClickRegisterButton = () => {
    if (user.id && user.officialName) setRegisterModal(true)
    else if (user.id && !user.playerID) {
      router.push('/claim-player')
    } else {
      Modal.info({
        title: 'กรุณา Log in ก่อนสมัครแข่งขัน',
        onOk: () => router.push('/login')
      })
    }

  }

  if (isLoading) return <Loading />
  if (isError) return <p>error</p>

  return (
    <Layout>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
        <div style={{ widht: '200px', height: '200px', overflow: 'hidden', margin: 'auto', marginTop: '20px' }}>
          <Image unoptimized alt='logo' src={tournament?.logo?.replace('/upload/', '/upload/q_10/') || '/icon/logo.png'} objectFit='contain' width={200} height={200} />
        </div>
        <h2>{tournament.name}</h2>
        <div>{`${moment(tournament.startDate).format('ll')}-${moment(tournament.endDate).format('ll')}`}</div>
        <div><EnvironmentOutlined />{tournament.location}</div>
        <div>รายการที่รับสมัคร</div>
        <div style={{
          display: 'flex',
          width: '100%',
          overflow: 'scroll',
          flexWrap: 'nowrap',
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
                onClick={() => {
                  if (tournament.registerOpen) {
                    onClickRegisterButton()
                  } else {
                    message.warning('ยังไม่เปิดรับสมัครหรือปิดรับสมัครไปแล้ว')
                  }
                }}
              >
                <div style={{ fontWeight: 'bold' }}>{event.name}</div>
                <Divider />
                {<div>{event.limit ? `จำนวน ${event.limit} คู่` : 'ไม่จำกัดจำนวน'}</div>}
                {event?.prize && <div>{`รางวัล ${event.prize}`}</div>}
              </div>
            )
          })}
        </div>
        {tournament?.poster && <div style={{ color: COLOR.MINOR_THEME }} onClick={() => setPosterVisible(true)}>ดูโปสเตอร์</div>}
        {tournament?.contact?.officialName &&
          <>
            <Divider>ผู้จัด</Divider>
            <div>
              <div style={{ textAlign: 'center' }}>{tournament?.contact?.displayName || tournament?.contact?.officialName}</div>
              <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
                <div style={{ width: '110px', textAlign: 'right' }}>เบอร์โทรศัพท์:</div>
                <div><a href={`tel:${tournament?.contact?.tel}`}>{tournament?.contact?.tel}</a></div>
                <div onClick={() => {
                  copy(tournament?.contact?.tel)
                  message.success('copied')
                }} style={{ color: COLOR.MINOR_THEME }}><CopyOutlined /></div>
              </div>
              {
                tournament?.contact?.lineID &&
                <div style={{ display: 'flex', gap: '10px', width: '200px' }}>
                  <div style={{ width: '110px', textAlign: 'right' }}>Line ID:</div>
                  <div>{tournament?.contact?.lineID}</div>
                  <div
                    onClick={() => {
                      copy(tournament?.contact?.lineID)
                      message.success('copied')
                    }}
                    style={{ color: COLOR.MINOR_THEME }}>
                    <CopyOutlined />
                  </div>
                </div>
              }
            </div>
          </>}

        {
          tournament.sponsors?.length > 0 &&
          <>
            <Divider>สนับสนุนโดย</Divider>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {tournament.sponsors?.map((sp, i) =>
                <div key={i + 1}
                  style={{ widht: '60px', height: '60px', overflow: 'hidden', margin: 'auto' }}>
                  <Image unoptimized alt='logo' src={sp?.replace('/upload/', '/upload/q_10/')} objectFit='contain' width={60} height={60} />
                </div>)}
            </div>
          </>
        }
        {tournament.registerOpen && <Button style={{ width: '80%', marginBottom: '5px' }} type='primary' onClick={onClickRegisterButton}>
          สมัครแข่งขัน
        </Button>}

        <Button
          style={{ width: '80%', marginBottom: '5px' }}
          type='primary'
          onClick={() => router.push(`/login`)}>
          ดูสถานะการสมัครของฉัน
        </Button>

        <Button
          style={{ width: '80%', marginBottom: '5px' }}
          type='primary'
          onClick={() => router.push(`/tournament/${tournament._id}/draws`)}>
          ดูรายชื่อ
        </Button>

        {
          isCreator && <Button style={{ width: '80%', marginBottom: '10px' }} type='primary' onClick={() => {
            setTournamentModal(true)
          }}>
            แก้ไขข้อมูล
          </Button>
        }

      </div>

      <RegisterModal
        visible={registerModal}
        setVisible={setRegisterModal}
        tournamentID={id}
      />
      <TournamentModal
        visible={tournamentModal}
        setVisible={setTournamentModal}
        tournament={tournament}
        mutate={mutate}
      />

      {
        tournament?.poster && <Modal
          visible={posterVisible}
          onCancel={() => setPosterVisible(false)}
          footer={null}
          centered
          modalRender={() => <div style={{ width: '100%', margin: 'auto' }}>
            <Image unoptimized alt='logo'
              src={tournament?.poster?.replace('/upload/', '/upload/q_10/') || '/icon/logo.png'}
              width={434}
              height={614}
              objectFit='cover'
              layout='responsive'
            />
          </div>}
        >
        </Modal>
      }
    </Layout >
  )
}
export default TournamentManagerID