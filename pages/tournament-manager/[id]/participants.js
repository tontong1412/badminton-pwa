import Layout from '../../../components/Layout/tournamentManager'
import moment from 'moment'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import { COLOR, EVENT, TAB_OPTIONS } from '../../../constant'
import { useEffect, useState } from 'react'
import { useTournament } from '../../../utils'
import { Table, Button, Tag, Menu, Dropdown, Input, Modal } from 'antd'
import { SearchOutlined } from '@ant-design/icons';
import { TRANSACTION } from '../../../constant'
import request from '../../../utils/request'

const Participants = () => {
  const dispatch = useDispatch()
  const router = useRouter()
  const { id } = router.query
  const { tournament, isLoading, isError, mutate } = useTournament(id)
  const [formatParticipantTable, setFormatParticipantTable] = useState([])
  const [searchText, setSearchText] = useState('')
  const [totalTeam, setTotalTeam] = useState()
  useEffect(() => {
    dispatch({ type: 'ACTIVE_MENU', payload: TAB_OPTIONS.TOURNAMENT_MANAGER.PARTICIPANTS })
  }, [])

  const menu = (event, team) => (
    <Menu>
      {team.paymentStatus !== 'paid' && <Menu.Item>
        <div onClick={() => onUpdatePaymentStatus(event._id, team._id, 'paid')}>
          จ่ายเงินแล้ว
        </div>
      </Menu.Item>}
      <Menu.Item>
        <div>
          ดู/อัพโหลดสลิป
        </div>
      </Menu.Item>
      {team.status !== 'idle' && <Menu.Item>
        <div onClick={() => onUpdateStatus(event._id, team._id, 'idle')}>
          แก้ไขผลประเมินมือ
        </div>
      </Menu.Item>}
      <Menu.Item>
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
        if (team.team.players[0].officialName?.toLowerCase().includes(searchTextLower)
          || team.team.players[1].officialName?.toLowerCase().includes(searchTextLower)
          || team.team.players[0].club?.toLowerCase().includes(searchTextLower)
          || team.team.players[1].club?.toLowerCase().includes(searchTextLower)) {
          prev.push({
            key: team._id,
            date: team.createdAt,
            player1: <div>
              {team.team.players[0].officialName}
              <span style={{ marginLeft: '5px' }}>
                {team.team.players[0].club ? `(${team.team.players[0].club})` : ''}
              </span>
            </div>,
            player2: <div>
              {team.team.players[1].officialName}
              <span style={{ marginLeft: '5px' }}>
                {team.team.players[1].club ? `(${team.team.players[1].club})` : ''}
              </span>
            </div>,
            event: event.name,
            allow: { event, team },
            payment: team.paymentStatus,
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

  const onUpdateStatus = (eventID, teamID, status) => {
    request.post('/event/team-status', {
      eventID,
      teamID,
      status
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

  const onUpdatePaymentStatus = (eventID, teamID, status) => {
    request.post('/event/payment-status', {
      eventID,
      teamID,
      paymentStatus: status
    }).then(() => mutate())
      .catch((error) => console.log(error))
  }

  const columns = [
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
      title: 'ประเมินมือ',
      dataIndex: 'allow',
      key: 'allow',
      align: 'center',
      width: '15%',
      onFilter: (value, record) => record.allow.team.status === value,
      render: ({ event, team }) => {
        return (
          team.status === 'idle' ?
            <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
              <Button size='small' type='primary' ghost onClick={() => onUpdateStatus(event._id, team._id, 'approved')}>ผ่าน</Button>
              <Button size='small' danger onClick={() => onUpdateStatus(event._id, team._id, 'rejected')}>ไม่ผ่าน</Button>
            </div>
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
      title: '',
      dataIndex: 'action',
      key: 'action',
      align: 'center',
      width: '10%'
    },
  ]
  return (
    <Layout>
      <h1>ประเมินมือ</h1>
      <div style={{ textAlign: 'right', margin: '0 10px' }}>{`ทั้งหมด ${totalTeam} คู่`}</div>
      <Table
        dataSource={formatParticipantTable}
        columns={columns}
        sticky
        scroll={{ y: 400 }}
        pagination={false}
        onChange={(pagination, filters, sorter, extra) => setTotalTeam(extra.currentDataSource.length)} />
    </Layout>
  )
}
export default Participants