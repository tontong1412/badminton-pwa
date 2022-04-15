
import { useEffect, useState } from 'react'
import { analytics, logEvent } from '../../utils/firebase'
import { useSelector, useDispatch } from 'react-redux'
import Layout from '../../components/Layout'
import { MAP_TOURNAMENT_STATUS, TAB_OPTIONS } from '../../constant'
import { useTournaments, useMyTournament } from '../../utils'
import Image from 'next/image'
import Link from 'next/link'
import moment from 'moment'
import { EnvironmentOutlined } from '@ant-design/icons'
import { Tag } from 'antd'
import MyTournament from '../../components/Tournament/MyTournament'
import AddButton from '../../components/addButton'
import TournamentModal from '../../components/Tournament/TournamentModal'

const Tournament = () => {
  const dispatch = useDispatch()
  const user = useSelector(state => state.user)
  const { tournaments } = useTournaments()
  const { mutate } = useMyTournament(user.token)
  const [createModalVisible, setCreateModalVisible] = useState(false)
  useEffect(() => {
    logEvent(analytics, 'tournament')
    dispatch({ type: 'ACTIVE_MENU', payload: TAB_OPTIONS.TOURNAMENT })
  }, [])
  return (
    <Layout >
      <MyTournament bottomLine />
      <div style={{ padding: '5px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        {tournaments?.filter(e => e.status !== 'prepare').length > 0 ?
          tournaments?.filter(e => e.status !== 'prepare').map(tournament => {
            return (
              <Link
                href={`/tournament/${tournament._id}`}
                passHref
                key={tournament._id}
              >
                <div style={{
                  width: '100%',
                  maxWidth: '400px',
                  display: 'flex',
                  borderRadius: '10px',
                  border: '1px solid #ddd',
                  boxShadow: '2px 2px 10px -5px rgba(0,0,0,0.75)',
                  overflow: 'hidden',
                  marginBottom: '5px',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '20px',
                  gap: '5px',
                  position: 'relative'

                }}>
                  <div style={{ width: '40%' }}>
                    <Image
                      src={tournament?.logo || '/icon/logo.png'}
                      alt=''
                      width={150}
                      height={150}
                      objectFit='contain'
                      layout='responsive'
                    />
                  </div>
                  <h3>{tournament.name}</h3>
                  <div>{moment(tournament.startDate).format('ll')}</div>
                  <div><EnvironmentOutlined />{tournament.location}</div>
                  <div>
                    {tournament.events.map(event => <Tag color='cyan' key={event._id}>{event.name}</Tag>)}
                  </div>
                  <div style={{ position: 'absolute', top: '5px', right: '5px' }}>
                    <Tag color={MAP_TOURNAMENT_STATUS[tournament.status].COLOR}>{MAP_TOURNAMENT_STATUS[tournament.status].LABEL}</Tag>
                  </div>
                </div>
              </Link>
            )
          })
          : <div style={{ textAlign: 'center' }}>ยังไม่มีรายการแข่งขัน</div>
        }
      </div>
      <AddButton onClick={() => setCreateModalVisible(true)} />
      <TournamentModal
        visible={createModalVisible}
        setVisible={setCreateModalVisible}
        mutate={mutate}
        action='create'
      />
    </Layout >
  )
}
export default Tournament