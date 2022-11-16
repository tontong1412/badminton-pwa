import { COLOR, ROUND_NAME } from '../../../constant'
import { useMatch, useSocket, useWindowSize } from '../../../utils'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'

const FONT_SIZE = 40
const LINE_HEIGHT = '65px'
const SCORE_WIDTH = 65
const PLAYER_WIDTH = 350

const ScoreSet = ({ score }) => (
  <div style={{
    color: 'white',
    fontSize: `${FONT_SIZE}px`,
    textAlign: 'center',
    lineHeight: LINE_HEIGHT,
    width: `${SCORE_WIDTH}px`,
    backgroundColor: COLOR.MINOR_THEME
  }}>{score}</div>
)

const Players = ({ players }) => (
  <div style={{
    fontSize: `${FONT_SIZE}px`,
    width: `${PLAYER_WIDTH}px`,
    borderRight: '2px solid #ccc',
    lineHeight: LINE_HEIGHT,
    overflow: 'hidden',
    textOverflow: 'clip',
    whiteSpace: 'nowrap',
  }}>
    {players.map(player => player.officialName?.split(' ')[0] || player.displayName).join('/')}
  </div >
)

const Score = ({ score, borderRight, isWinner }) => (
  <div style={{
    fontSize: `${FONT_SIZE}px`,
    textAlign: 'center',
    lineHeight: LINE_HEIGHT,
    width: `${SCORE_WIDTH}px`,
    borderRight: borderRight ? '2px solid #ccc' : null,
    color: isWinner ? '#FF5A59' : null
  }}>{score}</div>
)

const StreamingScoreboard = () => {
  const router = useRouter()
  const { id } = router.query
  const { match, isError, isLoading, mutate } = useMatch(id)
  const [width, setWidth] = useState(PLAYER_WIDTH)
  const socket = useSocket()

  useEffect(() => {
    if (match) {
      let tempWidth = (PLAYER_WIDTH + SCORE_WIDTH) + match?.scoreLabel.length * SCORE_WIDTH
      if (match.status !== 'playing') {
        tempWidth -= SCORE_WIDTH
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
    <>
      <div style={{
        width: `${width}px`,
        borderRadius: '5px',
        overflow: 'hidden',
        boxShadow: '2px 2px 20px -5px rgba(0,0,0,0.75)',
        backgroundColor: 'white'
      }}>
        {match.eventID && <div style={{
          fontSize: `${FONT_SIZE - 5}px`,
          padding: '0px 10px',
          borderBottom: '2px solid #ccc',
          backgroundColor: COLOR.MAIN_THEME

        }}>
          {`${match.eventName} - รอบ ${match.step === 'group' ? 'แบ่งกลุ่ม' : ROUND_NAME[match.round]}`}
        </div>}

        <div style={{
          borderBottom: '2px solid #ccc',
          display: 'flex',
          alignItems: 'center'
        }}>
          <ScoreSet score={match.teamA.scoreSet} />
          <Players players={match.teamA.team.players} />
          {match.scoreLabel.map((set, i) => {
            return <Score
              key={i + 1}
              score={set.split('-')[0]}
              isWinner={Number(set.split('-')[0]) > Number(set.split('-')[1])}
              borderRight={match.status === 'playing' || i < match.scoreLabel.length - 1} />
          })}
          {match.status === 'playing' && <Score score={match.teamA.score} />}
        </div>

        <div style={{
          height: LINE_HEIGHT,
          display: 'flex',
          alignItems: 'center'
        }}>
          <ScoreSet score={match.teamB.scoreSet} />
          <Players players={match.teamB.team.players} />
          {match.scoreLabel.map((set, i) => {
            return <Score
              key={i + 1}
              isWinner={Number(set.split('-')[0]) < Number(set.split('-')[1])}
              score={set.split('-')[1]}
              borderRight={match.status === 'playing' || i < match.scoreLabel.length - 1} />
          })}
          {match.status === 'playing' && <Score score={match.teamB.score} />}
        </div>
      </div >
      <div style={{
        fontFamily: 'Comfortaa',
        fontSize: '50px',
        fontWeight: 'bold',
        width: `${width}px`,
        textAlign: 'center',
        textShadow: '0px 0px 0 #fff, 1px 0px 0 #fff, 0px 1px 0 #fff, 1px 1px 0 #fff',
        color: COLOR.MINOR_THEME
      }} > badminstar.com</div>
    </>
  )
}
export default StreamingScoreboard