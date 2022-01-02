import React from 'react'
import moment from 'moment'

const MatchDetail = (props) => {
  const { match } = props
  console.log(match)
  return (
    <div>
      <div>{`#${match.matchNumber}`}</div>
      <div>{moment(match.date).format('l')}</div>
      <div>{moment(match.date).format('LT')}</div>
    </div>
  )
}
export default MatchDetail
