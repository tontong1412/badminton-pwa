import { Tabs, Button, Table, InputNumber, message, Popconfirm, Radio } from 'antd'
import { useTournament, useMatches, useWindowSize, useEvent } from '../../utils'
import { useState, useEffect } from 'react'
import drawBracket from '../../utils/drawBracket'
import request from '../../utils/request'
import ServiceErrorModal from '../ServiceErrorModal'
import Loading from '../loading'

const GROUP_DRAW = [
  {
    NAME: 'A',
    VALUE: 0
  },
  {
    NAME: 'B',
    VALUE: 1
  },
  {
    NAME: 'C',
    VALUE: 2
  },
  {
    NAME: 'D',
    VALUE: 3
  },
  {
    NAME: 'E',
    VALUE: 4
  },
  {
    NAME: 'F',
    VALUE: 5
  },
  {
    NAME: 'G',
    VALUE: 6
  },
  {
    NAME: 'H',
    VALUE: 7
  },
  {
    NAME: 'I',
    VALUE: 8
  },
  {
    NAME: 'J',
    VALUE: 9
  },
  {
    NAME: 'K',
    VALUE: 10
  },
  {
    NAME: 'L',
    VALUE: 11
  },
  {
    NAME: 'M',
    VALUE: 12
  },
  {
    NAME: 'N',
    VALUE: 13
  },
  {
    NAME: 'O',
    VALUE: 14
  },
  {
    NAME: 'P',
    VALUE: 15
  }
]

const RoundUpEvent = ({ eventID, matches, step = 'knockOut' }) => {
  const [order, setOrder] = useState([])
  const [groupMatches, setGroupMatches] = useState([])
  const [showOrder, setShowOrder] = useState([])
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false)
  const [width, height] = useWindowSize()
  const { event, isLoading, isError } = useEvent(eventID)

  useEffect(() => {
    if (event) {
      setOrder(event.order.knockOut)
      setShowOrder(event.order.knockOut)
    }
  }, [event])

  useEffect(() => {
    if (matches) {
      const filteredMatches = matches.filter(e => e.step === 'group')
      setGroupMatches(filteredMatches)
    }
  }, [matches])

  useEffect(() => {
    if (event) {
      setOrder(event.order[step])
      setShowOrder(event.order[step])
    }

  }, [step, event])

  useEffect(() => {
    if (groupMatches.length > 0) {
      const result = prepareData(event)
      setData(result.data)
      setShowOrder(result.showOrder)
      setOrder(result.order)
    }
  }, [groupMatches])




  const onChangeOrder = async (orderValue, team) => {
    if (orderValue) {
      const tempOrderShow = [...showOrder]
      tempOrderShow[orderValue - 1] = <div>
        {team.team.players?.map(player =>
          <div
            key={player._id}
            style={{ display: 'flex', gap: '10px' }}>
            <div style={{ width: '180px' }}>{player.officialName}</div>
            <div>{`${player.club}`}</div>
          </div>)}
      </div>
      const tempOrder = [...order]
      tempOrder[orderValue - 1] = team.team
      setShowOrder(tempOrderShow)
      setOrder(tempOrder)
    } else {
      const index = order.findIndex(elm => elm?._id === team.team._id)
      const tempOrder = [...order]
      tempOrder[index] = event.order[step][index]

      const tempOrderShow = [...showOrder]
      tempOrderShow[index] = event.order[step][index]

      setOrder(tempOrder)
      setShowOrder(tempOrderShow)
    }
  }

  const prepareData = (event) => {
    const score = event?.order.group?.map((group, index) => {
      return group?.map(team => {
        let score = 0
        let diff = 0
        groupMatches?.filter(e => e.teamA.team._id === team._id && e.eventID === event._id).forEach((elm) => {
          score += elm.teamA.scoreSet
          diff += elm.teamA.scoreDiff
        })

        groupMatches.filter(e => e.teamB.team._id === team._id && e.eventID === event._id).forEach((elm) => {
          score += elm.teamB.scoreSet
          diff += elm.teamB.scoreDiff
        })


        return {
          score,
          diff,
          team,
          group: GROUP_DRAW[index].NAME
        }
      })
    })

    const winner = score?.map(group => {
      group.sort((a, b) => {
        if (a.score === b.score) {
          return b.diff - a.diff
        } else {
          return b.score - a.score
        }
      })
      // group.length = numberOfWinner
      return group
    })

    const showOrderTemp = [...showOrder]
    const orderTemp = [...order]
    const data = winner?.reduce((prev, group) => {
      group.forEach((team, index) => {
        const defaultOrder = event.order[step].findIndex((e) => e === `ที่ ${index + 1} กลุ่ม ${team.group}`)

        if (defaultOrder >= 0) {
          showOrderTemp[defaultOrder] = <div>
            {team.team.players?.map(player =>
              <div
                key={player._id}
                style={{ display: 'flex', gap: '10px' }}>
                <div style={{ width: '180px' }}>{player.officialName}</div>
                <div>{`${player.club}`}</div>
              </div>)}
          </div>
          orderTemp[defaultOrder] = team.team
        }
        prev.push({
          key: team.team._id,
          team: <div>
            {team.team.players?.map((player, i) =>
              <div key={player._id} style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                <div>{player.officialName}</div>
                <div>{`(${player.club})`}</div>
              </div>)}
          </div>,
          score: team.score,
          diff: team.diff,
          group: team.group,
          draw: <InputNumber
            key={team.team._id}
            defaultValue={defaultOrder >= 0 && defaultOrder + 1}
            onBlur={(e) => onChangeOrder(e.target.value, team)}
            max={event.order[step].length}
            min={1} />
        })
      })
      return prev
    }, [])
    return {
      data,
      order: orderTemp,
      showOrder: showOrderTemp
    }
  }

  const onRoundUp = () => {
    setLoading(true)
    request.post('/event/round-up', {
      eventID: eventID,
      order: order.map(elm => elm?._id),
      step,
    }).then(() => {
      message.success('สำเร็จ')
      setLoading(false)
    })
      .catch(() => {
        setLoading(false)
        ServiceErrorModal()
      })
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
      width: '10%'
    },
    {
      key: 'draw',
      dataIndex: 'draw',
      title: 'ลำดับสาย',
      align: 'center',
      width: '15%'
    },
  ]

  if (isLoading) return <Loading />
  if (isError) return <div>error</div>
  return (
    <div style={{ position: 'relative' }}>
      <div style={{ display: 'flex' }}>
        <Table
          columns={columns}
          dataSource={groupMatches.length > 0 ? prepareData(event).data : []}
          pagination={false}
          style={{ width: '50%' }}
          scroll={{ y: height - 340 }}
          size='small'
        />
        <div style={{ overflow: 'scroll', marginLeft: '40px', height: height - 300 }}>
          {drawBracket(showOrder, 450)}
        </div>

      </div>
      <Popconfirm placement="top" title={'แน่ใจที่จะบันทึกหรือไม่'} onConfirm={onRoundUp} okText="Yes" cancelText="No">
        <Button type='primary' style={{ position: 'absolute', top: '20px', right: '20px', width: '150px' }}>บันทึก</Button>
      </Popconfirm>
    </div>
  )
}

const RoundUp = (props) => {
  const { matches } = useMatches(props.tournamentID)
  const { tournament } = useTournament(props.tournamentID)
  const [mode, setMode] = useState('knockOut')
  const [tab, setTab] = useState(tournament.events[0]._id)
  return (
    <Tabs
      defaultActiveKey={tab}
      activeKey={tab}
      onChange={(key) => {
        setTab(key)
        setMode('knockOut')
      }}
    >
      {tournament?.events?.map((event, i) => {
        if (event.order.knockOut.length <= 0) return null
        return (
          <Tabs.TabPane tab={event.name} key={event._id} >
            <Radio.Group onChange={e => setMode(e.target.value)} value={mode} style={{ marginBottom: 8 }}>
              <Radio.Button value="knockOut">รอบ Knock Out</Radio.Button>
              {event.format === 'roundRobinConsolation' && <Radio.Button value="consolation">สายล่าง</Radio.Button>}
            </Radio.Group>
            {
              (mode === 'knockOut')
                ? <RoundUpEvent eventID={event._id} matches={matches} />
                : <RoundUpEvent eventID={event._id} matches={matches} step={mode} />
            }

          </Tabs.TabPane>
        )
      })}
    </Tabs>)
}
export default RoundUp