
import Image from "next/image"
import Link from 'next/link'
import { EnvironmentOutlined } from '@ant-design/icons'
import { Divider, Tag } from "antd"
import { useSelector } from 'react-redux'
import { useTournaments } from "../../utils"
import moment from 'moment'
import { MAP_TOURNAMENT_STATUS, TAB_OPTIONS } from '../../constant'

const RegisteringTournament = (props, ref) => {
  const user = useSelector(state => state.user)
  const { tournaments } = useTournaments()


  if (!tournaments || tournaments.filter(t => t.status === 'register').length === 0) return <div />

  return (
    <div>
      <div style={{ margin: '20px 20px 0 20px' }}>รายการแข่งที่เปิดรับสมัคร</div>
      <div style={{
        overflowX: 'scroll',
        overflowY: 'hidden',
        display: 'flex',
        marginLeft: '5px'
      }}>
        {tournaments?.length > 0 && tournaments
          .filter(e => e.status === 'register')
          .sort((a, b) => b.startDate > a.startDate ? -1 : 1)
          ?.map(tournament => {
            return (

              <Link
                href={`/tournament/${tournament._id}`}
                passHref
                key={tournament._id}
              >
                <div style={{
                  minWidth: '350px',
                  width: '100%',
                  maxWidth: '400px',
                  margin: '10px',
                  borderRadius: '10px',
                  boxShadow: '2px 2px 10px -5px rgba(0,0,0,0.75)',
                  padding: '10px',
                  display: "flex",
                  gap: '10px',
                  alignItems: "center"
                }}>
                  <div style={{ width: '120px', height: '120px', borderRadius: '5px', overflow: 'hidden' }}>
                    <Image
                      unoptimized
                      src={tournament?.logo || '/icon/logo.png'}
                      alt=''
                      width={120}
                      height={120}
                      objectFit='contain'
                      layout='responsive'
                    />
                  </div>
                  <div>
                    <h3>{tournament.name}</h3>
                    <div>{`${moment(tournament.startDate).format('ll')} - ${moment(tournament.endDate).format('ll')}`}</div>
                    <div><EnvironmentOutlined />{tournament.location}</div>
                    <div >
                      {tournament.events.map(event => <Tag color='cyan' key={event._id}>{event.name}</Tag>)}
                    </div>
                    <div style={{ position: 'absolute', top: '5px', right: '5px' }}>
                      <Tag color={MAP_TOURNAMENT_STATUS[tournament.status].COLOR}>{MAP_TOURNAMENT_STATUS[tournament.status].LABEL}</Tag>
                    </div>
                  </div>

                </div>
              </Link>
            )
          })
        }
      </div>
      {props.bottomLine && <Divider />}
    </div >
  )

}
export default RegisteringTournament