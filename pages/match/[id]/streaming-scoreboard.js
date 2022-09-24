import { COLOR } from '../../../constant'
import { useMatch, useSocket, useWindowSize } from '../../../utils'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'

const ScoreSet = ({ score }) => (
  <div style={{
    color: 'white',
    fontSize: '50px',
    textAlign: 'center',
    lineHeight: '100px',
    width: '80px',
    backgroundColor: COLOR.MINOR_THEME, height: '100%',
  }}>{score}</div>
)

const Players = ({ players }) => (
  <div style={{ fontSize: '50px', width: '400px', padding: '10px', borderRight: '2px solid #ccc' }}>
    {players.map(player => player.officialName.split(' ')[0]).join('/')}
  </div>
)

const Score = ({ score, borderRight, isWinner }) => (
  <div style={{
    fontSize: '50px',
    textAlign: 'center',
    lineHeight: '100px',
    width: '80px',
    height: '100%',
    borderRight: borderRight ? '2px solid #ccc' : null,
    color: isWinner ? '#FF5A59' : null
  }}>{score}</div>
)

const StreamingScoreboard = () => {
  const router = useRouter()
  const { id } = router.query
  const { match, isError, isLoading, mutate } = useMatch(id)
  const [width, setWidth] = useState(540)
  const socket = useSocket()

  useEffect(() => {
    if (match) {
      let tempWidth = 540 + match?.scoreLabel.length * 80
      if (match.status !== 'playing') {
        tempWidth -= 80
      }
      setWidth(tempWidth)
    }
  }, [match])

  useEffect(() => {
    const handleEvent = (payload) => {
      mutate()
    }
    if (socket) {
      socket.on('update-match', handleEvent)
    }
  }, [socket])

  if (!match || isError || isLoading) return null
  return (
    <div style={{
      width: `${width}px`,
      borderRadius: '20px',
      overflow: 'hidden',
      boxShadow: '2px 2px 20px -5px rgba(0,0,0,0.75)',
      backgroundColor: 'white'
    }}>
      <div style={{
        fontSize: '40px',
        padding: '0px 10px',
        borderBottom: '2px solid #ccc',
        backgroundColor: COLOR.MAIN_THEME
      }}>
        {`${match.eventName} - รอบ ${match.step === 'group' ? 'แบ่งกลุ่ม' : ROUND_NAME[match.round]}`}
      </div>

      <div style={{
        height: '100px',
        borderBottom: '2px solid #ccc',
        display: 'flex',
        alignItems: 'center'
      }}>
        <ScoreSet score={match.teamA.scoreSet} />
        <Players players={match.teamA.team.players} />
        {match.scoreLabel.map((set, i) => <Score
          key={i + 1}
          score={set.split('-')[0]}
          isWinner={set.split('-')[0] > set.split('-')[1]}
          borderRight={match.status === 'playing' || i < match.scoreLabel.length - 1} />)}
        {match.status === 'playing' && <Score score={match.teamA.score} />}
      </div>

      <div style={{
        height: '100px',
        display: 'flex',
        alignItems: 'center'
      }}>
        <ScoreSet score={match.teamB.scoreSet} />
        <Players players={match.teamB.team.players} />
        {match.scoreLabel.map((set, i) => <Score
          key={i + 1}
          isWinner={set.split('-')[0] < set.split('-')[1]}
          score={set.split('-')[1]}
          borderRight={match.status === 'playing' || i < match.scoreLabel.length - 1} />)}
        {match.status === 'playing' && <Score score={match.teamB.score} />}
      </div>
    </div >
  )
}
export default StreamingScoreboard