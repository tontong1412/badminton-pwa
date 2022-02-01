import { useSelector } from "react-redux"
import { COLOR } from "../../constant"
import { useNextMatch } from "../../utils"
import Loading from '../../components/loading'
import { Divider } from "antd"
const NextMatch = ({ event, tournamentID }) => {
  const { user } = useSelector(state => state)
  const { matches } = useNextMatch(user.token, event._id, tournamentID)
  if (!matches) return <Loading />

  if (matches.nextMatch.length > 0) {
    return (
      <div>
        <Divider>{event.name}</Divider>
        <div style={{ padding: '0 20px 10px 20px' }}>
          {
            matches?.nextMatch[0].matchNumber - matches?.latestMatch[0]?.matchNumber || 0 - 1 <= 0
              ? <div style={{ fontSize: '40px', color: COLOR.MINOR_THEME }}>คู่ต่อไป</div>
              : <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div>อีก</div>
                <div style={{ fontSize: '40px', color: COLOR.MINOR_THEME }}>{matches?.nextMatch[0]?.matchNumber - matches?.latestMatch[0]?.matchNumber - 1}</div>
                <div>คู่จะถึงคุณ</div>
              </div>
          }

          <div style={{ color: '#aaa' }}>แมตช์ที่ {matches.nextMatch[0].matchNumber} พบกับ</div>
          {
            (matches.nextMatch[0]?.teamA?.team.players[0]?._id === user.playerID || matches.nextMatch[0]?.teamA?.team.players[1]?._id === user.playerID) ?
              <div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <div style={{ width: '150px', fontWeight: 'bold' }}>{matches.nextMatch[0]?.teamB?.team.players[0]?.officialName}</div>
                  <div>{matches.nextMatch[0]?.teamB?.team.players[0]?.club}</div>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <div style={{ width: '150px', fontWeight: 'bold' }}>{matches.nextMatch[0]?.teamB?.team.players[1]?.officialName}</div>
                  <div>{matches.nextMatch[0]?.teamB?.team?.players[1].club}</div>
                </div>
              </div>
              : <div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <div style={{ width: '150px' }}>{matches.nextMatch[0]?.teamA?.team.players[0]?.officialName}</div>
                  <div>{matches.nextMatch[0]?.teamA?.team.players[0]?.club}</div>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <div style={{ width: '150px' }}>{matches.nextMatch[0]?.teamA?.team.players[1]?.officialName}</div>
                  <div>{matches.nextMatch[0]?.teamA?.team?.players[1].club}</div>
                </div>
              </div>
          }
        </div>
      </div>

    )
  }
  return null
}
export default NextMatch