import { useSelector } from "react-redux"
import { COLOR } from "../../constant"
import { useMatches, useNextMatch, useTournament } from "../../utils"
import Loading from '../../components/loading'
import { Divider } from "antd"
import moment from 'moment'
import Image from "next/image"
const NextMatch = ({ event, tournamentID }) => {
  const { user } = useSelector(state => state)
  const { matches, isLoading } = useNextMatch(user.token, event._id, tournamentID)
  const { matches: allMatches } = useMatches(tournamentID)
  const { tournament } = useTournament(tournamentID)

  const remainShuttlecock = () => {

    const team = event?.teams?.find(elm => elm?.team?.players?.some(e => e?._id === user?.playerID))
    const shuttlecockUsed = allMatches?.filter(m => m.teamA?.team?._id === team?.team._id || m.teamB?.team?._id === team?.team._id)
      .reduce((prev, curr) => prev += curr.shuttlecockUsed, 0) || 0
    const remain = team?.shuttlecockCredit || 0 - shuttlecockUsed
    return <span style={{ color: remain < 0 ? 'red' : null }}>{remain}</span>
  }

  const getRemainQueue = (matchNumber) => {
    const waitingList = allMatches?.filter(m => m.status === 'waiting').sort((a, b) => a.matchNumber - b.matchNumber)
    const matchIndex = waitingList?.findIndex(m => m.matchNumber === matchNumber)
    return matchIndex
  }

  if (isLoading) return <Loading />

  if (matches?.nextMatch.length > 0) {
    const remainQ = getRemainQueue(matches?.nextMatch[0].matchNumber)
    return (
      <div>
        <Divider>{event.name}</Divider>
        <div style={{ padding: '0 20px 10px 20px' }}>
          <div>
            {matches?.latestMatch ?
              remainQ <= 0
                ? <div style={{ fontSize: '40px', color: COLOR.MINOR_THEME }}>คู่ต่อไป</div>
                : <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div>อีก</div>
                  <div style={{ fontSize: '40px', color: COLOR.MINOR_THEME }}>{remainQ}</div>
                  <div>คู่จะถึงคุณ</div>
                </div>
              : null
            }
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>{moment(matches?.nextMatch[0].date).format('lll')}</div>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <Image unoptimized alt='icon' src='/icon/shuttlecock.png' width={20} height={20} />
              <div>{remainShuttlecock()}</div>
            </div>
          </div>


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
                  <div>{matches.nextMatch[0]?.teamB?.team?.players[1]?.club}</div>
                </div>
              </div>
              : <div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <div style={{ width: '150px' }}>{matches.nextMatch[0]?.teamA?.team.players[0]?.officialName}</div>
                  <div>{matches.nextMatch[0]?.teamA?.team.players[0]?.club}</div>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <div style={{ width: '150px' }}>{matches.nextMatch[0]?.teamA?.team.players[1]?.officialName}</div>
                  <div>{matches.nextMatch[0]?.teamA?.team?.players[1]?.club}</div>
                </div>
              </div>
          }
        </div>
      </div>

    )
  }
  else if (tournament?.status === 'ongoing' && matches.myMatch?.length > 0) {
    return (
      <div>
        <Divider>{event.name}</Divider>
        <div style={{ padding: '0 20px 10px 20px' }}>
          <div style={{ fontSize: '20px', color: COLOR.MINOR_THEME }}>รอสรุปผลรอบแบ่งกลุ่ม</div>
        </div >
      </div>
    )
  } else if (tournament?.status === 'knockOut' && matches.myMatch?.length > 0) {
    return (
      <div>
        <Divider>{event.name}</Divider>
        <div style={{ padding: '0 20px 10px 20px' }}>
          <div style={{ fontSize: '20px', color: COLOR.MINOR_THEME }}>คุณไม่มีแมตช์แข่งแล้ว</div>
          <div>คูปองคงเหลือ: {remainShuttlecock()} ลูก</div>
          <div>กรุณาเคลียร์คูปองที่โต๊ะกรรมการ</div>
        </div >
      </div>
    )
  }
  return null
}
export default NextMatch