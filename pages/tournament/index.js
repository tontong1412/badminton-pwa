
import { useEffect } from 'react'
import { analytics, logEvent } from '../../utils/firebase'
import { useSelector, useDispatch } from 'react-redux'
import Layout from '../../components/Layout'
import { MAP_TOURNAMENT_STATUS, TAB_OPTIONS } from '../../constant'
import { useTournaments } from '../../utils'
import Image from 'next/image'
import Link from 'next/link'
import moment from 'moment'
import { EnvironmentOutlined } from '@ant-design/icons'
import { Tag } from 'antd'

const Tournament = () => {
  const dispatch = useDispatch()
  const { tournaments } = useTournaments()
  useEffect(() => {
    logEvent(analytics, 'tournament')
    dispatch({ type: 'ACTIVE_MENU', payload: TAB_OPTIONS.TOURNAMENT })
  }, [])
  return (
    <Layout >
      <div style={{ padding: '5px' }}>
        {tournaments?.map(tournament => {
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
        })}
      </div>
    </Layout >
  )
}
export default Tournament