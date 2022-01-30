import moment from 'moment'
import { COLOR, EVENT, TAB_OPTIONS, TRANSACTION } from '../../constant'
import { useEffect, useState } from 'react'
import { useTournament } from '../../utils'
import { Table, Button, Tag, Menu, Dropdown, Input, Modal } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import request from '../../utils/request'
import PlayerDisplay from '../PlayerDisplay'
import ContactPersonModal from '../Tournament/ContactPersonModal'
import SlipModal from '../Tournament/SlipModal'

const Participants = (props) => {
  const { tournament, isLoading, isError, mutate } = useTournament(props.tournamentID)
  const [formatParticipantTable, setFormatParticipantTable] = useState([])
  const [searchText, setSearchText] = useState('')
  const [totalTeam, setTotalTeam] = useState()
  const [contactPersonVisible, setContactPersonVisible] = useState(false)
  const [selectedTeam, setSelectedTeam] = useState()
  const [slipModalVisible, setSlipModalVisible] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState();

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
      <Menu.Item key='leave-event'>
        <div onClick={() => Modal.confirm({
          title: 'แน่ใจที่จะถอนคู่นี้หรือไม่',
          onOk: () => onLeaveEvent(event._id, team._id)
        })}>
          ถอนตัว
        </div>
      </Menu.Item>
    </Menu>
  )
  useEffect(() => {
    let i = 0
    const tempParticipant = tournament?.events?.reduce((prev, event) => {
      event.teams.forEach(team => {
        const searchTextLower = searchText.toLowerCase()
        if (team?.team?.players[0].officialName?.toLowerCase().includes(searchTextLower)
          || team?.team?.players[1]?.officialName?.toLowerCase().includes(searchTextLower)
          || team?.team?.players[0]?.club?.toLowerCase().includes(searchTextLower)
          || team?.team?.players[1]?.club?.toLowerCase().includes(searchTextLower)) {
          prev.push({
            key: team._id,
            date: team.createdAt,
            player1: <PlayerDisplay player={team.team.players[0]} />,
            player2: <PlayerDisplay player={team.team.players[1]} />,
            event: event.name,
            allow: { event, team },
            payment: team.paymentStatus,
            note: { note: team.note, isInQueue: team.isInQueue },
            action: <Dropdown overlay={menu(event, team)} placement="bottomRight">
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
    const base = [
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
        title: 'รายการ',
        dataIndex: 'event',
        key: 'event',
        align: 'center',
        width: '10%',
        onFilter: (value, record) => record.event === value,
        filters: tournament?.events.map(event => ({
          text: event.name,
          value: event.name
        }))
      },
      {
        title: 'ผู้เล่น 1',
        dataIndex: 'player1',
        key: 'player1',
        align: 'center',
        width: '22%',
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
        title: 'ผู้เล่น 2',
        dataIndex: 'player2',
        key: 'player2',
        align: 'center',
        width: '22%'
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
        title: 'การจ่ายเงิน',
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
        scroll={{ y: (typeof window !== "undefined") ? window.innerHeight - 350 : 400, x: 1000 }}
        pagination={false}
        onChange={(pagination, filters, sorter, extra) => setTotalTeam(extra.currentDataSource.length)} />
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
      />
    </div>
  )
}
export default Participants