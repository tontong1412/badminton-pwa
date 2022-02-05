import { Popover } from 'antd'
import moment from 'moment'
import Image from 'next/image'
import { MAP_GENDER } from '../constant'
const PlayerDisplay = ({ player, showContact }) => {
  const playerDetail = (
    <div style={{
      width: '200px',
      height: '250px',
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
      <div style={{ marginTop: '20px' }}>{player.officialName}</div>
      <div>{`(${player.club})`}</div>

      <div style={{ display: 'flex', gap: '10px', width: '200px' }}>
        <div style={{ width: '100px', textAlign: 'right' }}>อายุ:</div>
        <div>{moment().diff(player.birthDate, 'year')}</div>
      </div>
      <div style={{ display: 'flex', gap: '10px', width: '200px' }}>
        <div style={{ width: '100px', textAlign: 'right' }}>เพศ:</div>
        <div>{MAP_GENDER[player.gender]}</div>
      </div>
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
    <Popover content={playerDetail}>
      {player.officialName}
      <span style={{ marginLeft: '5px' }}>
        {player.club ? `(${player.club})` : ''}
      </span>
    </Popover>
  )
}
export default PlayerDisplay