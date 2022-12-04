import { useState, useEffect } from 'react'
import request from '../utils/request'
import { Popover, Tag } from 'antd'
import moment from 'moment'
import Image from 'next/image'
import { MAP_GENDER } from '../constant'
const PlayerDisplay = ({ player, showContact }) => {
  const [activity, setActivity] = useState()
  useEffect(() => {
    const getRecentActivity = async () => {
      const recentActivity = await request.get(`/player/${player._id}/recent-activity`)
      setActivity(recentActivity.data)
    }
    getRecentActivity()
  }, [])

  const playerDetail = (
    <div style={{
      width: '250px',
      height: '350px',
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
        <Image objectFit='cover' src={player.photo || `/avatar.png`} alt='' width={50} height={50} layout='responsive' />
      </div>
      <div style={{ display: 'flex', marginTop: '20px', gap: '5px' }}>
        <div >{player.officialName}</div>
        {player.displayName && <div>{`(${player.displayName})`}</div>}
      </div>
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
      {activity?.length > 0 &&
        <div style={{ width: '100%' }}>
          <div style={{ borderBottom: '1px solid #eee', padding: '5px', width: '100%', textAlign: 'center' }}>รายการแข่งล่าสุด</div>
          {
            activity.map(t =>
              <div key={t?._id} >
                <div
                  style={{ borderBottom: '1px solid #eee', padding: '5px', width: '100%', textAlign: 'center' }}>
                  {t?.name}
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
    </div >
  )
  return (
    <Popover content={playerDetail} trigger='click'>
      {player.officialName}
      <span style={{ marginLeft: '5px' }}>
        {player.club ? `(${player.club})` : ''}
      </span>
    </Popover>
  )
}
export default PlayerDisplay