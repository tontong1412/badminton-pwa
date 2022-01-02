import { useState, useEffect } from 'react'
import { Table } from 'antd'
import { MATCH } from '../../constant'
import MatchDetail from './matchDetail'
import { useMatchDraws, useEvent } from '../../utils'

const GroupTable = (props) => {
  const [groupMatches, setGroupMatches] = useState([])
  const { matches } = useMatchDraws(props.event?._id)
  const { event } = useEvent(props.event?._id)

  useEffect(() => {
    if (matches) {
      const filteredMatches = matches.filter(e => e.step === 'group')
      setGroupMatches(filteredMatches)
    }
  }, [matches])


  const processColumn = (data) => data?.map((group, index) => {
    const result = [
      {
        title: `Group ${index + 1}`,
        dataIndex: 'name',
        key: `${index + 1}-name`,
        align: 'center',
        width: '150px',
        fixed: 'left',
      }
    ]

    group.reduce((result, team, index) => {
      result.push({
        title: team.players.map((player, i) => <div key={`player-${i + 1}`}>{player.officialName}</div>),
        dataIndex: team._id,
        key: `${index + 1}-${index + 1}`,
        align: 'center',
      })
      return result
    }, result)

    result.push({
      title: 'คะแนน',
      dataIndex: 'score',
      key: `${index + 1}-score`,
      align: 'center',
      width: '80'
    }, {
      title: 'แต้มได้เสีย',
      dataIndex: 'diff',
      key: `${index + 1}-diff`,
      align: 'center',
      width: '80'
    })
    return result
  })

  const processDataSource = (data) => {
    return data?.map(group => {
      return group.map((team, index) => {
        const tempMatches = groupMatches.filter(elm => elm.teamA.team._id === team._id || elm.teamB.team._id === team._id)
        const result = {
          key: `${index + 1}`,
          name: team.players.map(player => <div key={player._id}>{player.officialName}</div>),
          diff: 0,
          score: 0,
          [team._id]: 'X'
        }
        tempMatches.forEach(match => {
          if (match.teamB.team._id === team._id) {
            const temp = { ...match.teamB }
            match.teamB = { ...match.teamA }
            match.teamA = { ...temp }
            match.scoreLabel = match.scoreLabel.map(set => {
              const score = set.split('-')
              const tempScore = score[0]
              score[0] = score[1]
              score[1] = tempScore
              return score.join('-')
            })
          }
          result[match.teamB.team?._id] = match.status === MATCH.STATUS.finished.LABEL
            ? match.scoreLabel.map(set => {
              const score = set.split('-')
              result.diff += score[0] - score[1]
              return <div>{set}</div>
            })
            : <MatchDetail key={match._id} match={match} />
          result.score += match.teamA.scoreSet
        })
        return result
      })
    })
  }

  const columns = processColumn(event?.order.group)
  const datasources = processDataSource(event?.order.group)
  return (
    <div >
      {
        columns?.map((column, index) => {
          return <Table
            key={index + 1}
            style={{ marginBottom: '20px', width: '1001px', zIndex: '-999' }}
            dataSource={datasources[index]}
            columns={column}
            bordered
            pagination={false}
            scroll={{ x: 1000 }}
          />
        })
      }
    </div >
  )
}

export default GroupTable
