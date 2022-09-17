import moment from 'moment'
import { COLOR, EVENT, TAB_OPTIONS, TRANSACTION } from '../../constant'
import { useEffect, useState } from 'react'
import { useTournament, useWindowSize } from '../../utils'
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

const Participants = (props) => {
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
          onOk: () => onLeaveEvent(event._id, team._id)
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
    }
    const tempParticipant = filteredEvent?.reduce((prev, event) => {
      event.teams.forEach(team => {
        const searchTextLower = searchText.toLowerCase()
        if (team?.team?.players[0].officialName?.toLowerCase().includes(searchTextLower)
          || team?.team?.players[1]?.officialName?.toLowerCase().includes(searchTextLower)
          || team?.team?.players[0]?.club?.toLowerCase().includes(searchTextLower)
          || team?.team?.players[1]?.club?.toLowerCase().includes(searchTextLower)) {
          prev.push({
            key: team._id,
            date: team.createdAt,
            player: team?.team.players.map(player => <div key={player._id} ><PlayerDisplay player={player} /></div>),
            event: event.name,
            allow: { event, team },
            payment: team.paymentStatus,
            note: { note: team.note, isInQueue: team.isInQueue },
            shuttlecockCredit: team.shuttlecockCredit,
            action: <Dropdown overlay={menu(event, team)} trigger={['click', 'hover']} placement="bottomRight">
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
        width: '10%',
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
        render: text => moment(text).format('DD MMM yyyy')
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
        render: text => <div>
          <Tag color={TRANSACTION[text].COLOR}>
            {TRANSACTION[text].LABEL}
          </Tag>
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
        title: 'คูปองลูก',
        dataIndex: 'shuttlecockCredit',
        key: 'shuttlecockCredit',
        align: 'center',
        width: '10%',
        defaultSortOrder: 'descend',
        sortDirections: ['descend', 'ascend', 'descend'],
        sorter: (a, b) => a.shuttlecockCredit > b.shuttlecockCredit,
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
      <div style={{ textAlign: 'right', margin: '0 10px' }}>{`ทั้งหมด ${totalTeam} คู่`}</div>
      <Table
        dataSource={formatParticipantTable}
        columns={columns()}
        sticky
        size='small'
        scroll={{ y: height - 350, x: 1000 }}
        pagination={false}
        onChange={(pagination, filters, sorter, extra) => setTotalTeam(extra.currentDataSource.length)} />
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
        setVisible={setSlipModalVisible}
        team={selectedTeam}
        event={selectedEvent}
        mutate={mutate}
        isManager
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