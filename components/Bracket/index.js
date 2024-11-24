import { useState, useEffect } from 'react'
import MatchUp from './MatchUp'
import processBracketData from '../../utils/processBracketData'
import Loading from '../loading'
import { useMatchDraws, useEvent } from '../../utils'

const Connector = () => (
  <div className="connector">
    <div className="merger"></div>
    <div className="line"></div>
  </div>
)
const Winner = ({ matches }) => {
  return (
    <div className="winners">
      <div className="matchups">
        <MatchUp match={matches[0]} />
        <MatchUp match={matches[1]} />
      </div>
      <Connector />
    </div>
  )
}
const Bracket = ({ event: eventProps, isManager, step = 'knockOut' }) => {
  const [bracket, setBracket] = useState()
  const { matches, isLoading, isError } = useMatchDraws(eventProps?._id)
  const { event } = useEvent(eventProps?._id)

  useEffect(() => {
    if (matches) {
      const bracketData = matches.filter(e => e.step === step)
      setBracket(processBracketData(bracketData))
    }
  }, [matches, step])

  const renderBracket = (roundArray, bracket) => {
    return (
      <div className="bracket">
        {
          roundArray.map((round, roundIndex) => {
            return (
              <section key={`round-${roundIndex}`} className={`round ${round}`}>
                {
                  bracket[round].map((matches, index) => {
                    if (round !== 'finals' && index % 2 === 1) {
                      const matchArray = [bracket[round][index - 1], matches]
                      return <Winner key={index + 1} matches={matchArray} />
                    } else if (round === 'finals') {
                      return (
                        <div key={index + 1} className="winners">
                          <div className="matchups">
                            <MatchUp match={matches} isManager={isManager} />
                          </div>
                        </div>
                      )
                    }
                  })
                }
              </section>
            )
          })
        }
      </div>
    )
  }

  if (isLoading || !bracket) return <Loading />
  if (isError) return <div>Error</div>
  if (!event?.drawPublished && !isManager) return <div>Draw is not yet published</div>
  const roundArray = Object.keys(bracket)
  return renderBracket(roundArray, bracket)

}
export default Bracket
