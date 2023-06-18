import moment from 'moment'
import { COLOR, EVENT, TAB_OPTIONS, TRANSACTION } from '../../constant'
import { useEffect, useState } from 'react'
import { useTournament, useWindowSize, useMatches } from '../../utils'
import { Table, Button, Tag, Menu, Dropdown, Input, Modal, Form } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import request from '../../utils/request'
import PlayerDisplay from '../PlayerDisplay'
import ContactPersonModal from '../Tournament/ContactPersonModal'
import SlipModal from '../Tournament/SlipModal'
import AddButton from '../addButton'
import RegisterModal from '../Tournament/RegisterModal'
import { useSelector } from 'react-redux'
import ShuttlecockModal from '../Tournament/ShuttlecockModal'
import { useRouter } from "next/router"
import dynamic from 'next/dynamic'
import { isMobileOnly } from 'react-device-detect'
import ParticipantMobile from '../Tournament/ParticipantMobile'
const DownloadPDF = dynamic(() => import('../../components/TournamentManager/participantsPDF'), {
  ssr: false
});


const Participants = (props) => {
  const router = useRouter()
  const { tournament, isLoading, isError, mutate } = useTournament(props.tournamentID)
  const [formatParticipantTable, setFormatParticipantTable] = useState([])
  const [searchText, setSearchText] = useState('')
  const [totalTeam, setTotalTeam] = useState()
  const [contactPersonVisible, setContactPersonVisible] = useState(false)
  const [selectedTeam, setSelectedTeam] = useState()
  const [slipModalVisible, setSlipModalVisible] = useState(false)
  const [shuttlecockModalVisible, setShuttlecockModalVisible] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState();
  const [registerModalVisible, setRegisterModalVisible] = useState(false)
  const [noteModalVisible, setNoteModalVisible] = useState(false)
  const { user } = useSelector(state => state)
  const [width, height] = useWindowSize()
  const [form] = Form.useForm()
  const [isManagerSlip, setIsManagerSlip] = useState(false)
  const [event, setEvent] = useState({})
  const { matches } = useMatches(props.tournamentID)
  // const [instance, updateInstance] = usePDF({ document: <MyDocument data={event} /> })

  // useEffect(updateInstance, [event])

  const menu = (event, team) => (
    <Menu>
      <Menu.Item key='contact'>
        <div onClick={() => {
          setContactPersonVisible(true)
          setSelectedTeam(team)
        }}>
          ข้อมูลผู้ติดต่อ
        </div>
      </Menu.Item>
      {/* {team.paymentStatus !== 'paid' && <Menu.Item key='update-payment'>
        <div onClick={() => onUpdateTeam(event._id, team._id, 'paymentStatus', 'paid')}>
          จ่ายเงินแล้ว
        </div>
      </Menu.Item>} */}
      <Menu.Item key='payment-slip'>
        <div onClick={() => {
          setSlipModalVisible(true)
          setSelectedTeam(team)
          setSelectedEvent(event)
          setIsManagerSlip(true)
        }}>
          ดู/อัพโหลดสลิป
        </div>
      </Menu.Item>
      <Menu.Item key='shuttlecock-credit-slip'>
        <div onClick={() => {
          setShuttlecockModalVisible(true)
          setSelectedTeam(team)
          setSelectedEvent(event)
        }}>
          ซื้อ/ขายลูกแบด
        </div>
      </Menu.Item>
      {team.status !== 'idle' && <Menu.Item key='update-status'>
        <div onClick={() => onUpdateTeam(event._id, team._id, 'status', 'idle')}>
          แก้ไขผลประเมินมือ
        </div>
      </Menu.Item>}
      {team.isInQueue && <Menu.Item key='update-queue'>
        <div onClick={() => onUpdateTeam(event._id, team._id, 'isInQueue', false)}>
          เปลี่ยนเป็นตัวจริง
        </div>
      </Menu.Item>}
      <Menu.Item key='note-event'>
        <div onClick={() => {
          setNoteModalVisible(true)
          setSelectedTeam(team)
          setSelectedEvent(event)
        }}>
          เพิ่มหมายเหตุ
        </div>
      </Menu.Item>
      <Menu.Item key='leave-event'>
        <div onClick={() => Modal.confirm({
          title: 'แน่ใจที่จะถอนคู่นี้หรือไม่',
          content: (
            <>
              {team.team?.players?.map(p => <div key={p._id}>{p.officialName}</div>)}
            </>
          ),
          onOk: () => onUpdateTeam(event._id, team._id, 'status', 'withdraw')
        })}>
          ถอนตัว
        </div>
      </Menu.Item>
    </Menu>
  )
  useEffect(() => {
    let i = 0
    let filteredEvent = tournament?.events
    if (props.eventID) {
      filteredEvent = filteredEvent?.filter(elm => elm._id === props.eventID)
      setEvent(filteredEvent[0])
    }
    const tempParticipant = filteredEvent?.reduce((prev, event) => {
      event.teams.forEach(team => {
        const searchTextLower = searchText.toLowerCase()
        if (team?.team?.players[0]?.officialName?.toLowerCase().includes(searchTextLower)
          || team?.team?.players[1]?.officialName?.toLowerCase().includes(searchTextLower)
          || team?.team?.players[0]?.club?.toLowerCase().includes(searchTextLower)
          || team?.team?.players[1]?.club?.toLowerCase().includes(searchTextLower)) {

          const shuttlecockUsed = matches?.filter(m => m.teamA.team?._id === team.team?._id || m.teamB.team?._id === team.team?._id)
            .reduce((prev, curr) => prev += curr.shuttlecockUsed, 0) || 0

          const handicapTeam = team?.team.players.reduce((prev, curr) => curr.level ? prev + curr.level : -100, 0)
          const handicapDiff = event.handicap && handicapTeam >= 0 && handicapTeam - event.handicap

          prev.push({
            key: team._id,
            date: team.createdAt,
            player: team?.team.players.map(player => <div key={player._id} ><PlayerDisplay player={player} handicap={tournament.useHandicap} /></div>),
            event: event.name,
            allow: { event, team },
            payment: { text: team.paymentStatus, event, team },
            handicap: handicapDiff,
            note: { note: team.note, isInQueue: team.isInQueue },
            shuttlecockCredit: team.shuttlecockCredit,
            shuttlecockUsed: shuttlecockUsed,
            shuttlecockRemain: team.shuttlecockCredit - shuttlecockUsed,
            action: <Dropdown overlay={menu(event, team)} trigger={['click']} placement="bottomRight">
              <div>เพิ่มเติม</div>
            </Dropdown>
          })
        }
      })
      return prev
    }, [])
    setFormatParticipantTable(tempParticipant)
    setTotalTeam(tempParticipant?.length || 0)
  }, [tournament, searchText])

  const onUpdateTeam = (eventID, teamID, field, value) => {
    request.post('/event/team', {
      eventID,
      teamID,
      value,
      field,
    }).then(() => mutate())
      .catch((error) => console.log(error))
  }

  const onLeaveEvent = (eventID, teamID) => {
    request.post('/event/leave', {
      eventID,
      teamID
    }).then(() => mutate())
      .catch(error => console.log(error))
  }

  const columns = () => {
    let base = []
    if (!props.eventID) {
      base.push({
        title: 'รายการ',
        dataIndex: 'event',
        key: 'event',
        align: 'center',
        width: '8%',
        fixed: 'left',
        onFilter: (value, record) => record.event === value,
        filters: tournament?.events.map(event => ({
          text: event.name,
          value: event.name
        }))
      })
    }
    base = [
      ...base,
      {
        title: 'วันที่สมัคร',
        dataIndex: 'date',
        key: 'date',
        align: 'center',
        width: '10%',
        defaultSortOrder: 'descend',
        sortDirections: ['descend', 'ascend', 'descend'],
        sorter: (a, b) => a.date > b.date,
        render: text => moment(text).format('DD/MM/yy')
      },
      {
        title: 'ผู้สมัคร',
        dataIndex: 'player',
        key: 'player',
        align: 'center',
        width: '30%',
        filterIcon: filtered => <SearchOutlined style={{ color: searchText ? COLOR.MINOR_THEME : undefined }} />,
        filterDropdown: ({ confirm }) => <div style={{ padding: '8px', display: 'flex', gap: '5px' }}>
          <Input
            placeholder={`ชื่อผู้เล่นหรือทีม`}
            onChange={(e) => setSearchText(e.target.value)}
            value={searchText}
          />
          <Button type='primary' onClick={() => {
            confirm()
            setSearchText('')
          }}>Reset</Button>
        </div>,
      },
      {
        title: 'ประเมินมือ',
        dataIndex: 'allow',
        key: 'allow',
        align: 'center',
        width: '10%',
        onFilter: (value, record) => record.allow.team.status === value,
        render: ({ event, team }) => {
          return (
            team.status === 'idle' ?
              props.isManager ? <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
                <Button size='small' type='primary' ghost onClick={() => onUpdateTeam(event._id, team._id, 'status', 'approved')}>ผ่าน</Button>
                <Button size='small' danger onClick={() => onUpdateTeam(event._id, team._id, 'status', 'rejected')}>ไม่ผ่าน</Button>
              </div> : <Tag color={EVENT.TEAM_STATUS[team.status].COLOR}>
                {EVENT.TEAM_STATUS[team.status].LABEL}
              </Tag>
              : <Tag color={EVENT.TEAM_STATUS[team.status].COLOR}>
                {EVENT.TEAM_STATUS[team.status].LABEL}
              </Tag>)
        },
        filters: [
          {
            text: 'ผ่าน',
            value: 'approved',
          },
          {
            text: 'ไม่ผ่าน',
            value: 'rejected',
          },
          {
            text: 'รอประเมิน',
            value: 'idle',
          },
        ],
      },
      {
        title: 'ค่าสมัคร',
        dataIndex: 'payment',
        key: 'payment',
        align: 'center',
        width: '10%',
        onFilter: (value, record) => record.payment === value,
        render: ({ text, event, team }) => <div>
          <Tag color={TRANSACTION[text].COLOR}>
            {TRANSACTION[text].LABEL}
          </Tag>
          {/* {
            text === 'idle' && <div style={{ paddingTop: '5px' }}><a onClick={() => {
              setSlipModalVisible(true)
              setSelectedTeam(team)
              setSelectedEvent(event)
            }}>คลิกเพื่อจ่าย</a></div>
          } */}
        </div>,
        filters: [
          {
            text: 'จ่ายแล้ว',
            value: 'paid',
          },
          {
            text: 'ยังไม่จ่าย',
            value: 'idle',
          },
          {
            text: 'รอยืนยัน',
            value: 'pending',
          },
        ],
      },
      {
        title: 'คูปองที่ซื้อ',
        dataIndex: 'shuttlecockCredit',
        key: 'shuttlecockCredit',
        align: 'center',
        width: '8%',
      },
      {
        title: 'คูปองที่ใช้',
        dataIndex: 'shuttlecockUsed',
        key: 'shuttlecockUsed',
        align: 'center',
        width: '8%',
        defaultSortOrder: 'descend',
        sorter: (a, b) => a.shuttlecockUsed - b.shuttlecockUsed,
      },
      {
        title: 'คูปองคงเหลือ',
        dataIndex: 'shuttlecockRemain',
        key: 'shuttlecockRemain',
        align: 'center',
        width: '8%',
        defaultSortOrder: 'descend',
        sorter: (a, b) => a.shuttlecockRemain - b.shuttlecockRemain
      },

      {
        title: 'หมายเหตุ',
        dataIndex: 'note',
        key: 'note',
        align: 'center',
        width: '10%',
        render: ({ note, isInQueue }) => <div>{`${isInQueue ? 'สำรอง' : ''}${isInQueue && note ? ',' : ''}${note || ''}`}</div>
      }
    ]
    if (tournament.useHandicap) {
      base.push({
        title: 'Handicap',
        dataIndex: 'handicap',
        key: 'handicap',
        align: 'center',
        sorter: (a, b) => a.handicap - b.handicap,
        width: '8%',
      })
    }
    if (props.isManager) {
      base.push({
        title: '',
        dataIndex: 'action',
        key: 'action',
        align: 'center',
        width: '10%'
      })
    }
    return base
  }

  return (
    <div>
      {isMobileOnly ?
        <ParticipantMobile dataSource={formatParticipantTable} isManager={props.isManager} onUpdateTeam={onUpdateTeam} handicap={tournament.useHandicap} />
        :
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            {props.isManager ? <div /> : <DownloadPDF event={event} />}
            <div style={{ margin: '0 10px' }}>{`ทั้งหมด ${totalTeam} คู่`}</div>
          </div>
          <Table
            dataSource={formatParticipantTable}
            columns={columns()}
            sticky
            size='small'
            scroll={{ y: height - 350, x: 1000 }}
            pagination={false}
            onChange={(pagination, filters, sorter, extra) => setTotalTeam(extra.currentDataSource.length)} />
        </>
      }



      {(tournament?.registerOpen || props.isManager) && <AddButton onClick={() => {
        if (user.id) setRegisterModalVisible(true)
        else {
          Modal.info({
            title: 'กรุณา Log in ก่อนสมัครแข่งขัน',
            onOk: () => router.push('/login')
          })
        }
      }} />}
      <RegisterModal
        visible={registerModalVisible}
        setVisible={setRegisterModalVisible}
        tournamentID={props.tournamentID} />
      <ContactPersonModal
        visible={contactPersonVisible}
        setVisible={setContactPersonVisible}
        player={selectedTeam?.contact}
        showContact />
      <SlipModal
        visible={slipModalVisible}
        setVisible={(visible) => {
          setSlipModalVisible(visible)
          setIsManagerSlip(false)
        }}
        team={selectedTeam}
        event={selectedEvent}
        mutate={mutate}
        isManager={isManagerSlip}
        tournament={tournament}
      />
      <ShuttlecockModal
        visible={shuttlecockModalVisible}
        setVisible={setShuttlecockModalVisible}
        team={selectedTeam}
        event={selectedEvent}
        mutate={mutate}
        isManager
        tournament={tournament}
      />
      <Modal
        visible={noteModalVisible}
        title='เพิ่มหมายเหตุ'
        destroyOnClose
        onOk={form.submit}
        onCancel={() => setNoteModalVisible(false)}
      >
        <Form
          form={form}
          onFinish={(values) => {
            onUpdateTeam(selectedEvent._id, selectedTeam._id, 'note', values.note)
            setNoteModalVisible(false)
            form.resetFields()
          }}
        >
          <Form.Item
            name='note'
          >
            <Input.TextArea />
          </Form.Item>
        </Form>

      </Modal>
    </div>
  )
}
export default Participants