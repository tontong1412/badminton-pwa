import Image from 'next/image'
const Stat = ({ stat }) => {
  return (
    <div className='match-stat'>
      <div className='team-container'>
        <div className='team'>
          {stat?.teamA.players.map(player => {
            return (
              <div key={`teamA-${player._id}`} className='player-container'>
                <div className='avatar'>
                  <Image unoptimized className='avatar' src={`/avatar.png` || player.photo?.replace('/upload/', '/upload/q_10/') || `/avatar.png`} alt='' width={35} height={35} objectFit='cover' />
                </div>
                <div className='info'>{player.displayName || player.officialName}</div>
              </div>
            )
          })}
        </div>
        <div className='team'>
          {stat?.teamB.players.map(player => {
            return (
              <div key={`teamB-${player._id}`}
                className='player-container'
                style={{ flexDirection: 'row-reverse' }}
              >
                <div className='avatar'>
                  <Image unoptimized className='avatar' src={`/avatar.png` || player.photo?.replace('/upload/', '/upload/q_10/') || `/avatar.png`} alt='' width={35} height={35} objectFit='cover' />
                </div>
                <div className='info' style={{ marginRight: '5px', marginLeft: 0, textAlign: 'right' }}>{player.displayName || player.officialName}</div>
              </div>
            )
          })}
        </div>
      </div>
      <div style={{
        textAlign: 'center',
        marginTop: '20px',
        borderBottom: '1px solid #eee',
        fontWeight: 'bold',
        padding: '5px',
      }}>Total Meeting: {stat?.totalMeet}</div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 0', borderBottom: '1px solid #eee' }}>
        <div style={{ width: '20%', textAlign: 'center' }}>{stat?.teamA.win}</div>
        <div style={{ fontWeight: 'bold' }}>Won</div>
        <div style={{ width: '20%', textAlign: 'center' }}>{stat?.teamB.win}</div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 0', borderBottom: '1px solid #eee' }}>
        <div style={{ width: '20%', textAlign: 'center' }}>{stat?.teamB.win}</div>
        <div style={{ fontWeight: 'bold' }}>Lose</div>
        <div style={{ width: '20%', textAlign: 'center' }}>{stat?.teamA.win}</div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 0', }}>
        <div style={{ width: '20%', textAlign: 'center' }}>{stat?.tie}</div>
        <div style={{ fontWeight: 'bold' }}>Draw</div>
        <div style={{ width: '20%', textAlign: 'center' }}>{stat?.tie}</div>
      </div>
    </div >
  )
}

export default Stat