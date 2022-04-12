import { useState, useEffect } from 'react'
import { Table, BackTop } from 'antd'
import { COLOR, MATCH, GROUP_NAME } from '../../constant'
import MatchDetail from './matchDetail'
import { useMatchDraws, useEvent } from '../../utils'

const GroupTable = (props) => {
  const [groupMatches, setGroupMatches] = useState([])
  const { matches, mutate } = useMatchDraws(props.event?._id)
  const { event } = useEvent(props.event?._id)
  const [columns, setColumns] = useState([])
  const [dataSource, setDataSource] = useState([])

  useEffect(() => {
    if (matches) {
      const filteredMatches = matches.filter(e => e.step === 'group')
      setGroupMatches(filteredMatches)
    }
  }, [matches])

  const processColumn = (data) => data?.map((group, index) => {
    const result = [
      {
        title: `Group ${GROUP_NAME[index].NAME}`,
        dataIndex: 'name',
        key: `${index + 1}-name`,
        align: 'center',
        width: '150px',
        fixed: 'left',
      }
    ]

    group.reduce((result, team, i) => {
      result.push({
        title: team.players.map((player, j) => <div key={`player-${j + 1}`}>{player.officialName}</div>),
        dataIndex: team._id,
        key: `${index + 1}-${i + 1}`,
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
            ? match.scoreLabel.map((set, i) => {
              const score = set.split('-')
              result.diff += score[0] - score[1]
              return <div key={i + 1}>{set}</div>
            })
            : <MatchDetail key={match._id} match={match} mutate={mutate} isManager={props.isManager} />
          result.score += match.teamA.scoreSet
        })
        return result
      })
    })
  }

  useEffect(() => {
    setColumns(processColumn(event?.order.group))
    setDataSource(processDataSource(event?.order.group))
  }, [event, groupMatches])

  return (
    <div >
      {
        columns?.map((column, index) => {
          return <div key={index + 1}>
            <div className='fix-printing'>{`กลุ่ม ${index + 1} - ${event.name} `}</div>
            <Table
              style={{
                marginBottom: '20px',
                width: '1001px',
                zIndex: '-999',
                pageBreakAfter: (index % 3 === 1) ? 'always' : 'auto'
              }}
              dataSource={dataSource[index]}
              columns={column}
              bordered
              pagination={false}
              scroll={{ x: 1000 }}
              size='small'
            />
          </div>
        })
      }
      <BackTop style={{
        bottom: '100px',
        backgroundColor: COLOR.MINOR_THEME,
        height: 40,
        width: 40,
        lineHeight: '40px',
        borderRadius: 20,
        textAlign: 'center',
        fontSize: 14,
      }} />
    </div >
  )
}

export default GroupTable
