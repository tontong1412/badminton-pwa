import { Tabs } from 'antd'
import { useTournament, useMatches } from '../../utils'
import { useState } from 'react'
const Result = ({ tournamentID }) => {
  const { matches } = useMatches(tournamentID)
  const { tournament } = useTournament(tournamentID)
  const [tab, setTab] = useState(tournament.events[0]._id)


  return (
    <Tabs
      defaultActiveKey={tab}
      activeKey={tab}
      onChange={(key) => {
        setTab(key)
      }}
    >
      {tournament?.events?.map((event, i) => {
        if (event.order.knockOut.length <= 0) return null
        const finalMatch = matches?.filter(elm => elm.eventID === event._id).find(elm => elm.step === 'knockOut' && elm.round === 2 && elm.status === 'finished')
        const semiMatch = matches?.filter(elm => elm.eventID === event._id && elm.step === 'knockOut' && elm.round === 4 && elm.status === 'finished')

        const winner = finalMatch?.teamA.scoreSet > finalMatch?.teamB.scoreSet ? 'teamA' : 'teamB'
        const finalist = finalMatch?.teamA.scoreSet > finalMatch?.teamB.scoreSet ? 'teamB' : 'teamA'

        const semifinalist = semiMatch?.map(match => (match.teamA.scoreSet > match.teamB.scoreSet) ? 'teamB' : 'teamA')


        const consolationFinalMatch = matches?.filter(elm => elm.eventID === event._id).find(elm => elm.step === 'consolation' && elm.round === 2 && elm.status === 'finished')
        const consolationSemiMatch = matches?.filter(elm => elm.eventID === event._id && elm.step === 'consolation' && elm.round === 4 && elm.status === 'finished')

        const consolationWinner = finalMatch?.teamA.scoreSet > finalMatch?.teamB.scoreSet ? 'teamA' : 'teamB'
        const consolationFinalist = finalMatch?.teamA.scoreSet > finalMatch?.teamB.scoreSet ? 'teamB' : 'teamA'

        const consolationSemifinalist = semiMatch?.map(match => (match.teamA.scoreSet > match.teamB.scoreSet) ? 'teamB' : 'teamA')



        return (
          <Tabs.TabPane tab={event.name} key={event._id} >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '10px' }}>
              <div style={{ fontSize: '20px' }}>ชนะเลิศ</div>
              {finalMatch ?
                <div>{finalMatch[winner].team?.players.map(player => (
                  <div key={player._id} style={{ display: 'flex', gap: '10px' }}>
                    <div style={{ width: '150px' }}>{player.officialName}</div>
                    <div>{player.club}</div>
                  </div>
                ))}</div>
                : 'การแข่งขันยังไม่เสร็จสิ้น'
              }
              <div style={{ fontSize: '20px' }}>รองชนะเลิศ อันดับ 1</div>
              {finalMatch ?
                <div>{finalMatch[finalist].team?.players.map(player => (
                  <div key={player._id} style={{ display: 'flex', gap: '10px' }}>
                    <div style={{ width: '150px' }}>{player.officialName}</div>
                    <div>{player.club}</div>
                  </div>
                ))}</div>
                : 'การแข่งขันยังไม่เสร็จสิ้น'
              }
              <div style={{ fontSize: '20px' }}>รองชนะเลิศ อันดับ 2</div>
              {semiMatch?.length > 0 ?
                <div>
                  {semiMatch.map((match, i) => match[semifinalist[i]].team?.players.map(player => (
                    <div key={player._id} style={{ display: 'flex', gap: '10px' }}>
                      <div style={{ width: '150px' }}>{player.officialName}</div>
                      <div>{player.club}</div>
                    </div>
                  )))}
                </div>
                : 'การแข่งขันยังไม่เสร็จสิ้น'
              }
            </div>

            {event.format === 'roundRobinConsolation' && <div style={{ paddingTop: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '10px' }}>
              <div style={{ fontSize: '20px' }}>สายล่าง</div>
              <div style={{ fontSize: '20px' }}>อันดับ 1</div>
              {consolationFinalMatch ?
                <div>{consolationFinalMatch[consolationWinner].team?.players.map(player => (
                  <div key={player._id} style={{ display: 'flex', gap: '10px' }}>
                    <div style={{ width: '150px' }}>{player.officialName}</div>
                    <div>{player.club}</div>
                  </div>
                ))}</div>
                : 'การแข่งขันยังไม่เสร็จสิ้น'
              }
              <div style={{ fontSize: '20px' }}>อันดับ 2</div>
              {consolationFinalMatch ?
                <div>{consolationFinalMatch[consolationFinalist].team?.players.map(player => (
                  <div key={player._id} style={{ display: 'flex', gap: '10px' }}>
                    <div style={{ width: '150px' }}>{player.officialName}</div>
                    <div>{player.club}</div>
                  </div>
                ))}</div>
                : 'การแข่งขันยังไม่เสร็จสิ้น'
              }
              <div style={{ fontSize: '20px' }}>อันดับ 3</div>
              {consolationSemiMatch?.length > 0 ?
                <div>
                  {consolationSemiMatch.map((match, i) => match[consolationSemifinalist[i]].team?.players.map(player => (
                    <div key={player._id} style={{ display: 'flex', gap: '10px' }}>
                      <div style={{ width: '150px' }}>{player.officialName}</div>
                      <div>{player.club}</div>
                    </div>
                  )))}
                </div>
                : 'การแข่งขันยังไม่เสร็จสิ้น'
              }
            </div>}

          </Tabs.TabPane>
        )
      })}
    </Tabs>)
}
export default Result