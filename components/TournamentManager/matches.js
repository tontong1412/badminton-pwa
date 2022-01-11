import { useDispatch, useSelector } from 'react-redux'
import { TAB_OPTIONS, MATCH } from '../../constant'
import { useEffect, useState } from 'react'
import { Table, Tag, Modal, Input, Select } from 'antd'
import moment from 'moment'
import 'moment/locale/th'
import { useMatches } from '../../utils'
import Loading from '../../components/loading'
import request from '../../utils/request'
const Matches = (props) => {
  const dispatch = useDispatch()
  const [filteredInfo, setFilteredInfo] = useState()
  const [formattedData, setFormattedData] = useState([])
  const [assignMatchModal, setAssignMatchModal] = useState(false)
  const [setScoreModal, setSetScoreModal] = useState(false)
  const [assignLoading, setAssignLoading] = useState(false)
  const [setScoreLoading, setSetScoreLoading] = useState(false)
  const [selectedMatch, setSelectedMatch] = useState()
  const [selectedCourt, setSelectedCourt] = useState()
  const [score, setScore] = useState([])
  const { matches, isError, isLoading, mutate } = useMatches(props.tournamentID)

  const handleChange = (pagination, filters, sorter) => {
    setFilteredInfo(filters)
  }

  const columns = () => {
    const base = [
      {
        title: 'Match',
        dataIndex: 'match',
        align: 'center',
        width: '8%'
      },
      {
        title: 'ประเภท',
        dataIndex: 'event',
        align: 'center',
        width: '8%'
      },
      {
        title: 'วันที่',
        dataIndex: 'date',
        align: 'center',
        width: '8%'
      },
      {
        title: 'เวลา',
        dataIndex: 'schedule',
        align: 'center',
        width: '8%'
      },
      {
        title: 'ผู้เข้าแข่งขัน',
        dataIndex: 'competitor1',
        width: '25%',
        align: 'center'
      },
      {
        title: '',
        dataIndex: 'result',
        align: 'center'
      },
      {
        title: 'ผู้เข้าแข่งขัน',
        dataIndex: 'competitor2',
        width: '25%',
        align: 'center'
      },
      {
        title: 'สถานะ',
        dataIndex: 'status',
        key: 'status',
        align: 'center',
        render: ({ text, court }) => <div>
          <Tag color={text.COLOR}>{text.LABEL}</Tag>
          {court ? <Tag color={text.COLOR}>{`คอร์ด ${court}`}</Tag> : null}
        </div>,
        filters: [
          { text: MATCH.STATUS.waiting.LABEL, value: MATCH.STATUS.waiting.LABEL },
          { text: MATCH.STATUS.playing.LABEL, value: MATCH.STATUS.playing.LABEL },
          { text: MATCH.STATUS.finished.LABEL, value: MATCH.STATUS.finished.LABEL }
        ],
        filteredValue: filteredInfo?.status || null,
        onFilter: (value, record) => record.status.text.LABEL.includes(value)
      },

    ]
    if (props.isManager) {
      base.push({
        title: 'Action',
        dataIndex: 'action',
        align: 'center',
        width: '10%'
      })
    }
    return base
  }

  const onChangeFillScore = (value, index) => {
    const temp = [...score]
    temp[index] = value
    setScore(temp)
  }

  const handleOk = (modal) => {
    if (modal === 'assignLoading') {
      setAssignLoading(true)
      request.put(`/match/${selectedMatch._id}`, {
        status: 'playing',
        court: selectedCourt,
        // umpire: selectedUmpire
      }).then(() => {
        setAssignLoading(false)
        setAssignMatchModal(false)
        setSelectedCourt()
        mutate()
      })
    } else if (modal === 'setScoreLoading') {
      setSetScoreLoading(true)
      request.post('/match/set-score', {
        matchID: selectedMatch._id,
        score: score
      }).then(() => {
        setSetScoreLoading(false)
        setSetScoreModal(false)
        mutate()
      })
    }

  }

  const handleAssignMatchAction = (match) => {
    setAssignMatchModal(true)
    setSelectedMatch(match)
  }

  const handleSetScoreAction = (match) => {
    setSetScoreModal(true)
    setSelectedMatch(match)
  }

  const renderSetScoreModal = () => {
    return (
      <Modal
        title="ผลการแข่งขัน"
        visible={setScoreModal}
        onOk={() => handleOk('setScoreLoading')}
        confirmLoading={setScoreLoading}
        onCancel={() => setSetScoreModal(false)}
        destroyOnClose={true}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ width: '30%', textAlign: 'center' }}>
            {selectedMatch?.teamA.team.players.map(player => <div key={player._id}>{player.officialName}</div>)}
          </div>
          <div>
            <div style={{ paddingBottom: '5px' }}>
              <Input
                placeholder='เซ็ต 1'
                style={{ width: 120 }}
                onChange={(e) => onChangeFillScore(e.target.value, 0)}
              />
            </div>
            <div style={{ paddingBottom: '5px' }}>
              <Input
                placeholder='เซ็ต 2'
                style={{ width: 120 }}
                onChange={(e) => onChangeFillScore(e.target.value, 1)}
              />
            </div>
            <div style={{ paddingBottom: '5px' }}>
              <Input
                disabled={selectedMatch?.competitiveType !== 'knockout'}
                placeholder='เซ็ต 3'
                style={{ width: 120 }}
                onChange={(e) => onChangeFillScore(e.target.value, 2)}
              />
            </div>
          </div>
          <div style={{ width: '30%', textAlign: 'center' }}>
            {selectedMatch?.teamB.team.players.map(player => <div key={player._id}>{player.officialName}</div>)}
          </div>
        </div>

      </Modal>
    )
  }

  const renderAssignMatchModal = () => {
    // const availableCourts = getAvailableCourts()
    return (
      <Modal
        title="ลงทำการแข่งขัน"
        visible={assignMatchModal}
        onOk={() => handleOk('assignLoading')}
        confirmLoading={assignLoading}
        onCancel={() => setAssignMatchModal(false)}
        destroyOnClose={true}
      >
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div >คอร์ด: </div>
            <Input placeholder="เลือกคอร์ด" style={{ width: 120 }} onChange={e => setSelectedCourt(e.target.value)} />
          </div>
          {/* <div >
            <div >กรรมการ: </div>
            <Select placeholder="เลือกกรรมการ" style={{ width: 200 }} onChange={this.handleSelectUmpire}>
              <Option value="1">Jack</Option>
              <Option value="2">John</Option>
              <Option value="3">Jim</Option>
              <Option value="4">Johnson</Option>
            </Select>
          </div> */}
        </>

      </Modal>
    )
  }

  const renderAction = (status, match) => {
    switch (status) {
      case MATCH.STATUS.waiting.LABEL:
        return <a onClick={() => handleAssignMatchAction(match)}>ลงทำการแข่งขัน</a>
      case MATCH.STATUS.playing.LABEL:
        return <a onClick={() => handleSetScoreAction(match)}>สรุปผลการแข่งขัน</a>
      case MATCH.STATUS.finished.LABEL:
        return <a onClick={() => handleSetScoreAction(match)}>แก้ไขผล</a>
      default:
    }
  }

  useEffect(() => {
    if (matches) {
      const data = matches?.map(match => ({
        key: match.matchNumber,
        match: match.matchNumber,
        event: match.eventName,
        competitor1: match.teamA.team?.players.map(player => <div key={player._id}>{player.officialName}<span>{`(${player.club})`}</span></div>),
        competitor2: match.teamB.team?.players.map(player => <div key={player._id}>{player.officialName}<span>{`(${player.club})`}</span></div>),
        date: moment(match.date).format('ll'),
        schedule: moment(match.date).format('LT'),
        status: { text: MATCH.STATUS[match.status], court: match.status === 'playing' ? match.court : null },
        result: match.scoreLabel.map((set, index) => <div key={`set-${index + 1}`}>{set}</div>),
        action: renderAction(match.status, match)
      }))
      setFormattedData(data)
    }
  }, [matches])

  useEffect(() => {
    mutate()
  }, [props.tournamentID])


  useEffect(() => {
    dispatch({ type: 'ACTIVE_MENU', payload: TAB_OPTIONS.TOURNAMENT_MANAGER.MATCHES })
  }, [])

  if (isError) return <div>Error</div>
  if (isLoading) return <Loading />
  return (
    <div>
      <Table
        columns={columns()}
        dataSource={formattedData}
        pagination={false}
        scroll={{ y: 450, x: 1000 }}
        onChange={handleChange}
        rowKey='key'
        size='small'
      // loading={loading}
      />
      {renderAssignMatchModal()}
      {renderSetScoreModal()}
    </div>
  )
}
export default Matches