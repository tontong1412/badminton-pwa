import { MATCH } from '../../constant'
import { useEffect, useState } from 'react'
import { Table, Tag, Modal, Input, Select, Form } from 'antd'
import moment from 'moment'
import 'moment/locale/th'
import { useMatches, useTournament, useWindowSize } from '../../utils'
import Loading from '../../components/loading'
import request from '../../utils/request'
import ServiceErrorModal from '../ServiceErrorModal'
import { useSocket } from '../../utils'
import { useRouter } from 'next/router'
const Matches = (props) => {
  const router = useRouter()
  const [form] = Form.useForm()
  const [filteredInfo, setFilteredInfo] = useState()
  const [formattedData, setFormattedData] = useState([])
  const [assignMatchModal, setAssignMatchModal] = useState(false)
  const [setScoreModal, setSetScoreModal] = useState(false)
  const [assignLoading, setAssignLoading] = useState(false)
  const [setScoreLoading, setSetScoreLoading] = useState(false)
  const [selectedMatch, setSelectedMatch] = useState()
  const [selectedCourt, setSelectedCourt] = useState()
  const [score, setScore] = useState([])
  const socket = useSocket()
  const { matches, isError, isLoading, mutate } = useMatches(props.tournamentID)
  const { tournament } = useTournament(props.tournamentID)
  const [width, height] = useWindowSize()

  const handleChange = (pagination, filters, sorter) => {
    setFilteredInfo(filters)
  }

  useEffect(() => {
    const handleEvent = (payload) => {
      mutate()
    }
    if (socket) {
      socket.on('update-score', handleEvent)
      socket.on('update-match', handleEvent)
    }
  }, [socket])

  const columns = () => {
    const base = [
      {
        title: 'Match',
        dataIndex: 'match',
        align: 'center',
        width: '6%',
        fixed: 'left'
      },
      {
        title: 'สถานะ',
        dataIndex: 'status',
        key: 'status',
        align: 'center',
        width: '8%',
        fixed: 'left',
        render: ({ text, court }) => <div>
          <Tag color={text.COLOR}>{text.LABEL}</Tag>
          {court ? <Tag color={text.COLOR}>{`คอร์ด ${court}`}</Tag> : null}
        </div>,
        filters: [
          { text: MATCH.STATUS.waiting.LABEL, value: MATCH.STATUS.waiting.LABEL },
          { text: MATCH.STATUS.playing.LABEL, value: MATCH.STATUS.playing.LABEL },
          { text: MATCH.STATUS.finished.LABEL, value: MATCH.STATUS.finished.LABEL }
        ],
        // filteredValue: filteredInfo?.status || null,
        defaultFilteredValue: [MATCH.STATUS.waiting.LABEL, MATCH.STATUS.playing.LABEL],
        onFilter: (value, record) => record.status.text.LABEL.includes(value)
      },
      {
        title: 'ประเภท',
        dataIndex: 'event',
        align: 'center',
        width: '8%'
      },
      {
        title: 'เวลา',
        dataIndex: 'schedule',
        align: 'center',
        width: '10%'
      },
      {
        title: 'ผู้เข้าแข่งขัน',
        dataIndex: 'competitor1',
        width: '25%',
        align: 'center'
      },
      {
        title: 'ผลการแข่งขัน',
        dataIndex: 'result',
        align: 'center'
      },
      {
        title: 'ผู้เข้าแข่งขัน',
        dataIndex: 'competitor2',
        width: '25%',
        align: 'center'
      },


    ]
    if (props.isManager) {
      base.push({
        title: 'Action',
        dataIndex: 'action',
        align: 'center',
        width: '8%'
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
    if (modal === 'setScoreLoading') {
      setSetScoreLoading(true)
      request.post('/match/set-score', {
        matchID: selectedMatch._id,
        score: score
      }).then(() => {
        setSetScoreLoading(false)
        setSetScoreModal(false)
        setScore([])
        mutate()
      }).catch(() => {
        Modal.error({ title: 'ผิดพลาด', content: 'กรุณากรอกรูปแบบคะแนนให้ถูกต้อง' })
        setSetScoreLoading(false)
        setScore([])
      })
    }

  }

  const onAssignMatch = (values) => {
    setAssignLoading(true)
    request.put(`/match/${selectedMatch._id}`, {
      status: 'playing',
      court: values.court,
      umpire: values.umpire
    }).then(() => {
      setAssignLoading(false)
      setAssignMatchModal(false)
      setSelectedCourt()
      mutate()
    }).catch(() => {
      ServiceErrorModal()
      setSetScoreLoading(false)
    })
  }

  const handleAssignMatchAction = (match) => {
    setAssignMatchModal(true)
    setSelectedMatch(match)
  }

  const handleSetScoreAction = (match) => {
    setSetScoreModal(true)
    setSelectedMatch(match)
    setScore([])
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
            {selectedMatch?.teamA?.team?.players.map(player => <div key={player._id}>{player.officialName}</div>)}
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
                disabled={selectedMatch?.step === 'group'}
                placeholder='เซ็ต 3'
                style={{ width: 120 }}
                onChange={(e) => onChangeFillScore(e.target.value, 2)}
              />
            </div>
          </div>
          <div style={{ width: '30%', textAlign: 'center' }}>
            {selectedMatch?.teamB?.team?.players.map(player => <div key={player._id}>{player.officialName}</div>)}
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
        onOk={form.submit}
        confirmLoading={assignLoading}
        onCancel={() => setAssignMatchModal(false)}
        destroyOnClose
      >
        <Form
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          onFinish={onAssignMatch}
          form={form}
        >
          <Form.Item
            label="คอร์ด"
            name="court"
            rules={[{ required: true, message: 'Please input court number' }]}
          >
            <Input placeholder="เลือกคอร์ด" style={{ width: 120 }} onChange={e => setSelectedCourt(e.target.value)} />
          </Form.Item>
          <Form.Item
            label="กรรมการ"
            name="umpire"
          // rules={[{ required: true, message: 'Please input umpire' }]}
          >
            <Select placeholder="เลือกกรรมการ" style={{ width: 200 }} >
              {tournament?.umpires.map((elm) => <Select.Option key={elm._id} value={elm._id}>{elm.officialName}</Select.Option>)}
            </Select>
          </Form.Item>
        </Form>

      </Modal>
    )
  }

  const renderAction = (status, match) => {
    switch (status) {
      case MATCH.STATUS.waiting.LABEL:
        return <a onClick={() => handleAssignMatchAction(match)}>ลงทำการแข่งขัน</a>
      case MATCH.STATUS.playing.LABEL:
        // return <a onClick={() => handleSetScoreAction(match)}>สรุปผลการแข่งขัน</a>
        return <div>
          {/* <div><a onClick={() => router.push(`/match/${match._id}`)}>ดูการแข่งขัน</a></div> */}
          <div><a onClick={() => handleAssignMatchAction(match)}>แก้ไขข้อมูล</a></div>
          <div><a onClick={() => handleSetScoreAction(match)}>ลงผลการแข่งขัน</a></div>
        </div>
      case MATCH.STATUS.finished.LABEL:
        return <a onClick={() => handleSetScoreAction(match)}>แก้ไขผล</a>
      default:
    }
  }

  useEffect(() => {
    if (matches) {
      let processedMatches = [...matches]
      if (props.step) {
        if (props.step === 'knockOut') {
          processedMatches = matches.filter(match => match.step !== 'group')
        } else {
          processedMatches = matches.filter(match => match.step === props.step)
        }
      }
      const data = processedMatches?.filter(elm => elm.matchNumber).sort((a, b) => a.matchNumber - b.matchNumber).map(match => ({
        key: match._id,
        match: match.matchNumber,
        event: <div><div>{match.eventName}</div>{match.step === 'consolation' && <div>สายล่าง</div>}</div>,
        competitor1: match.teamA?.team?.players.map(player => <div key={player._id}>{player.officialName}<span>{`(${player.club})`}</span></div>),
        competitor2: match.teamB?.team?.players.map(player => <div key={player._id}>{player.officialName}<span>{`(${player.club})`}</span></div>),
        date: moment(match.date).format('ll'),
        schedule: <div>
          <div>{moment(match.date).format('l')}</div>
          <div>{moment(match.date).format('LT')}</div>
        </div>,
        status: { text: MATCH.STATUS[match.status], court: match.status === 'playing' ? match.court : null },
        result: <div>
          {match.scoreLabel.map((set, index) => <div key={`set-${index + 1}`}>{set}</div>)}
          {match.status === 'playing' && <div>{`${match.teamA.score}-${match.teamB.score}`}</div>}
        </div>,
        action: renderAction(match.status, match)
      }))
      setFormattedData(data)
    }
  }, [matches, props.step])

  useEffect(() => {
    mutate()
  }, [props.tournamentID])

  if (isError) return <div>Error</div>
  if (isLoading) return <Loading />
  return (
    <div>
      <Table
        columns={columns()}
        dataSource={formattedData}
        pagination={false}
        scroll={{ y: height - 280, x: 1000 }}
        onChange={handleChange}
        rowKey='key'
        size='small'
        onRow={props.isManager ? null : (record, rowIndex) => {
          return {
            onClick: event => { router.push(`/match/${record.key}`) },
          };
        }}
      />
      {renderAssignMatchModal()}
      {renderSetScoreModal()}
    </div>
  )
}
export default Matches