import { Tabs, Button, Table, InputNumber, message } from 'antd'
import { useTournament, useMatches } from '../../utils'
import { useState, useEffect } from 'react'
import drawBracket from '../../utils/drawBracket'
import request from '../../utils/request'

const RoundUpEvent = ({ event, matches }) => {
  const [order, setOrder] = useState(event.order.knockOut)
  const [groupMatches, setGroupMatches] = useState([])
  const [showOrder, setShowOrder] = useState(event.order.knockOut)

  useEffect(() => {
    if (matches) {
      const filteredMatches = matches.filter(e => e.step === 'group')
      setGroupMatches(filteredMatches)
    }
  }, [matches])

  useEffect(() => {
    setOrder(event.order.knockOut)
    setShowOrder(event.order.knockOut)
  }, [event.order.knockOut])

  const prepareData = (event) => {
    const score = event.order.group.map((group, index) => {
      return group.map(team => {
        let score = 0
        let diff = 0
        groupMatches?.filter(e => e.teamA.team._id === team._id).forEach((elm) => {
          score += elm.teamA.scoreSet
          diff += elm.teamA.scoreDiff
        })

        groupMatches.filter(e => e.teamB.team._id === team._id).forEach((elm) => {
          score += elm.teamB.scoreSet
          diff += elm.teamB.scoreDiff
        })

        return {
          score,
          diff,
          team,
          group: index + 1
        }
      })
    })

    const winner = score.map(group => {
      group.sort((a, b) => {
        if (a.score === b.score) return a.diff - b.diff
        else return b.score - a.score
      })
      console.log(group);
      // group.length = numberOfWinner
      return group
    })

    const onChangeOrder = async (orderValue, team) => {
      if (orderValue) {
        const tempOrderShow = [...showOrder]
        tempOrderShow[orderValue - 1] = <div>
          {team.team.players.map(player =>
            <div
              key={player._id}
              style={{ display: 'flex', gap: '10px' }}>
              <div style={{ width: '120px' }}>{player.officialName}</div>
              <div>{`${player.club}`}</div>
            </div>)}
        </div>
        const tempOrder = [...order]
        tempOrder[orderValue - 1] = team.team
        setShowOrder(tempOrderShow)
        setOrder(tempOrder)
      } else {
        const index = order.findIndex(elm => elm._id === team.team._id)
        const tempOrder = [...order]
        tempOrder[index] = event.order.knockOut[index]

        const tempOrderShow = [...showOrder]
        tempOrderShow[index] = event.order.knockOut[index]

        setOrder(tempOrder)
        setShowOrder(tempOrderShow)
      }
    }

    const data = winner.reduce((prev, group) => {
      group.forEach((team, index) => {
        prev.push({
          key: team.team._id,
          team: <div>
            {team.team.players.map((player, i) =>
              <div key={`${i + 1}`} style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                <div>{player.officialName}</div>
                <div>{`(${player.club})`}</div>
              </div>)}
          </div>,
          score: team.score,
          diff: team.diff,
          group: team.group,
          draw: <InputNumber
            onBlur={(e) => onChangeOrder(e.target.value, team)}
            max={event.order.knockOut.length}
            min={1} />
        })
      })
      return prev
    }, [])

    return data
  }

  const onRoundUp = () => {
    request.post('/event/round-up', {
      eventID: event._id,
      order: order.map(elm => elm._id)
    }).then(() => message.success('สำเร็จ'))
  }

  const columns = [
    {
      key: 'group',
      dataIndex: 'group',
      title: 'กลุ่ม',
      align: 'center',
      width: '10%'
    },
    {
      key: 'team',
      dataIndex: 'team',
      title: 'ผู้แข่งขัน',
      align: 'center',
      width: '40%'
    },
    {
      key: 'score',
      dataIndex: 'score',
      title: 'คะแนน',
      align: 'center',
      width: '10%'
    },
    {
      key: 'diff',
      dataIndex: 'diff',
      title: 'แต้มได้เสีย',
      align: 'center',
      width: '15%'
    },
    {
      key: 'draw',
      dataIndex: 'draw',
      title: 'ลำดับสาย',
      align: 'center',
      width: '15%'
    },
  ]

  return (
    <div style={{ display: 'flex' }}>
      <Table
        columns={columns}
        dataSource={prepareData(event)}
        pagination={false}
        style={{ width: '50%' }}
        scroll={{ y: (typeof window !== "undefined") ? window.innerHeight - 350 : 400 }}
        size='small'
      />
      <div style={{ marginLeft: '40px' }}>
        {drawBracket(showOrder, 300)}
        <Button onClick={onRoundUp} type='primary'>บันทึก</Button>
      </div>
    </div>
  )
}

const RoundUp = (props) => {
  const { matches } = useMatches(props.tournamentID)
  const { tournament } = useTournament(props.tournamentID)

  return (
    <Tabs defaultActiveKey="1" >
      {tournament?.events.map(event => {
        return (
          <Tabs.TabPane tab={event.name} key={`tab-${event._id}`} >
            {event.step === 'group'
              ? <RoundUpEvent event={event} matches={matches} />
              : <div style={{ width: '100%', textAlign: 'center' }}>สรุปทีมเข้ารอบแล้ว</div>
            }

          </Tabs.TabPane>
        )
      })}
    </Tabs>)
}
export default RoundUp