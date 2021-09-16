import Layout from '../../../components/Layout/gang'
import Image from 'next/Image'
import { useSelector } from 'react-redux'
import AddButton from '../../../components/addButton'

const MatchList = () => {
  const { gang } = useSelector(state => state)
  return (
    <div>
      {
        gang?.queue.map(match => {
          return (
            <div key={match._id} style={{ margin: '5px', borderRadius: '5px', border: '1px solid #eee', display: 'flex', flexDirection: 'column', boxShadow: '2px 1px 10px -3px rgba(0,0,0,0.75)' }}>
              <div style={{ display: 'flex', padding: '5px' }}>
                <div style={{ width: '50%' }}>
                  {match.teamA.team.players.map(player => {
                    return (
                      <div key={player._id} style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '20px', overflow: 'hidden' }}>
                          <Image src='/avatar.png' alt='' width={40} height={40} />
                        </div>
                        <div style={{ marginLeft: '5px' }}>{player.displayName}</div>
                      </div>
                    )
                  })}
                </div>
                <div style={{ width: '50%' }}>
                  {match.teamB.team.players.map(player => {
                    return (
                      <div key={player._id} style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '20px', overflow: 'hidden' }}>
                          <Image src='/avatar.png' alt='' width={40} height={40} />
                        </div>
                        <div style={{ marginLeft: '5px' }}>{player.displayName}</div>
                      </div>
                    )
                  })}
                </div>
              </div>
              <div>
                <div style={{ width: '50%' }}>จำนวนลูก: {match.shuttlecockUsed}</div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', height: '35px', textAlign: 'center', alignItems: 'center', borderTop: '1px solid #eee' }}>
                <div style={{ width: '50%', borderRight: '1px solid #eee' }}>แก้ไข</div>
                <div style={{ width: '50%', borderRight: '1px solid #eee' }}>เพิ่มลูก</div>
                <div style={{ width: '50%', borderRight: '1px solid #eee' }}>จบเกม</div>
              </div>
            </div>
          )
        })
      }
      <AddButton />
    </div >
  )
}
MatchList.getLayout = (page) => {
  return (
    <Layout>
      {page}
    </Layout>
  )
}
export default MatchList