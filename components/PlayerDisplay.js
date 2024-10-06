import { useState, useEffect } from 'react'
import request from '../utils/request'
import { Popover, Tag } from 'antd'
import moment from 'moment'
import Image from 'next/image'
import { MAP_GENDER, PLAYER } from '../constant'
import { useDispatch, useSelector } from 'react-redux'
const PlayerDisplay = ({ children, player, showContact, draw = false, handicap }) => {
  const [activity, setActivity] = useState()
  const { user } = useSelector(state => state)
  const [isAdmin, setIsAdmin] = useState(false)
  useEffect(() => {
    const getRecentActivity = async () => {
      const recentActivity = await request.get(`/player/${player._id}/recent-activity`)
      setActivity(recentActivity.data)
    }
    getRecentActivity()

    return () => {
      setActivity({}); //unmount
    };
  }, [])

  useEffect(() => {
    if (user && user.admin) {
      setIsAdmin(true)
    } else {
      setIsAdmin(false)
    }
  }, [user])



  const playerDetail = (
    <div style={{
      width: '250px',
      // height: '350px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}>
      <div style={{
        width: '80px',
        height: '80px',
        borderRadius: '40px',
        overflow: 'hidden',
        objectFit: 'contain',
        marginTop: '10px'
      }}>
        <a href={player?.photo}>
          <Image objectFit='cover' src={player.photo?.replace('/upload/', '/upload/q_30/') || `/avatar.png`} alt='' width={50} height={50} layout='responsive' unoptimized />
        </a>
      </div>
      <div style={{ display: 'flex', marginTop: '20px', gap: '5px' }}>
        <div >{player.officialName}</div>
        {player.level && <Tag>{PLAYER.LEVEL[player.level]}</Tag>}
      </div>
      <div>{player.displayName && <div>{`(${player.displayName})`}</div>}</div>
      <div>{`${player.club}`}</div>

      {moment().diff(player.birthDate, 'year') ?
        <div style={{ display: 'flex', gap: '10px', width: '200px' }}>
          <div style={{ width: '100px', textAlign: 'right' }}>อายุ:</div>
          <div>{moment().diff(player.birthDate, 'year')}</div>
        </div> : null}

      {player.gender && <div style={{ display: 'flex', gap: '10px', width: '200px' }}>
        <div style={{ width: '100px', textAlign: 'right' }}>เพศ:</div>
        <div>{MAP_GENDER[player.gender]}</div>
      </div>}
      {activity?.length > 1 &&
        <div style={{ width: '100%' }}>
          <div style={{ borderBottom: '1px solid #eee', padding: '5px', width: '100%', textAlign: 'center' }}>รายการแข่งล่าสุด</div>
          {
            activity.slice(1).map(t =>
              <div key={t?._id} >
                <div
                  style={{ borderBottom: '1px solid #eee', padding: '5px', width: '100%', textAlign: 'center' }}>
                  <a href={`/tournament/${t._id}`}>{t?.name}</a>
                  {t?.events.map(e => <Tag key={e?._id} color='blue' style={{ marginLeft: '3px' }}>{e?.name}</Tag>)}
                </div>
              </div>)
          }
        </div>
      }
      {
        showContact && <>
          <div style={{ display: 'flex', gap: '10px', width: '200px' }}>
            <div style={{ width: '100px', textAlign: 'right' }}>เบอร์โทรศัพท์:</div>
            <div>{player.tel}</div>
          </div>
          <div style={{ display: 'flex', gap: '10px', width: '200px' }}>
            <div style={{ width: '100px', textAlign: 'right' }}>Line ID:</div>
            <div>{player.lineID}</div>
          </div>
        </>
      }
      {
        isAdmin &&
        <div style={{ marginTop: '20px' }}><a href={`/player/${player?._id}`}>เพิ่มเติม</a></div>
      }
    </div >
  )
  return (
    <Popover content={playerDetail} trigger='click'>
      {
        draw ?
          <div>{children}</div>
          : <div>
            {player.officialName}
            < span style={{ marginLeft: '5px' }}>
              {player.club ? `(${player.club})` : ''}
            </span>
            <span style={{ marginLeft: '5px' }}>
              {handicap && player.level && <Tag>{PLAYER.LEVEL[player.level]}</Tag>}
            </span>
          </div>
      }

    </Popover >
  )
}
export default PlayerDisplay