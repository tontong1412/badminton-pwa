import React from 'react'
import { MATCH } from '../../constant'
import moment from 'moment'

const MatchUp = (props) => {
  const { match } = props
  const matchType = match?.teamA?.team?.players?.length > 1 ? MATCH.TYPE.DOUBLE : MATCH.TYPE.SINGLE
  return (
    <div className="matchup">
      <div className="participants">
        <div className='group'>
          <div className={`participant ${match.teamA.score > match.teamB.score ? 'winner' : null}`}>
            {
              matchType === MATCH.TYPE.SINGLE
                ? <span>{match.teamA?.team?.players[0]?.officialName || 'waiting'}</span>
                // <span>{match.teamA.team.players[0] ? match.teamA.team.players[0]/*.officialName*/ : 'bye'}</span> :
                : <React.Fragment>
                  <div>{match.teamA.team?.players[0]?.officialName || 'waiting'}</div>
                  <div>{match.teamA.team?.players[1]?.officialName || 'waiting'}</div>
                </React.Fragment>
            }
          </div>
          {
            match.scoreLabel && match.scoreLabel.length > 0 ? (
              <React.Fragment>
                {[0, 1, 2].map(index => <div className='detail-score'><p>{match.scoreLabel[index]?.split('-')[0]}</p></div>)}
              </React.Fragment>
            )
              : <div className='detail-date'>
                <p>{`#${match.matchNumber}\r\n${moment(match.date).format('l')}`}</p>
              </div>
          }
        </div>
        <div className='group'>
          <div className={`participant ${match.teamB.score > match.teamA.score ? 'winner' : null}`}>
            {
              matchType === MATCH.TYPE.SINGLE
                // <span>{match.teamB[0] ? match.teamB.team.players[0]/*.officialName*/ : 'bye'}</span> :
                ? <span>{match.teamB?.team?.players[0]?.officialName || 'waiting'}</span>
                : <React.Fragment>
                  <div>{match.teamB?.team?.players[0]?.officialName || 'waiting'} </div>
                  < div > {match.teamB?.team?.players[1]?.officialName || 'waiting'} </div>
                </React.Fragment>
            }
          </div>
          {
            match.scoreLabel && match.scoreLabel.length > 0 ? (
              <React.Fragment>
                {[0, 1, 2].map(index => <div className='detail-score'><p>{match.scoreLabel[index]?.split('-')[1]}</p></div>)}
              </React.Fragment>
            )
              : <div className='detail-time'><p>{moment(match.date).format('LT')}</p></div>
          }
        </div>
      </div>
    </div>
  )
}
export default MatchUp
