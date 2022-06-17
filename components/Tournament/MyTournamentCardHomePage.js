import Link from 'next/link'
import Image from 'next/image'
import { Divider, Tag, Menu, Dropdown, Modal } from 'antd'
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { EVENT, TRANSACTION } from '../../constant'
import { MenuOutlined } from '@ant-design/icons'
import SlipModal from './SlipModal'
import request from '../../utils/request'
import NextMatch from './NextMatch'




const MyTournamentCardHomePage = ({ tournament, mutate }) => {
  const { user } = useSelector(state => state)
  const [slipModalVisible, setSlipModalVisible] = useState(false)
  const [selectedTeam, setSelectedTeam] = useState()
  const [selectedEvent, setSelectedEvent] = useState()



  const onLeaveEvent = (eventID, teamID) => {
    request.post('/event/leave', {
      eventID,
      teamID
    }).then(() => mutate())
      .catch(error => console.log(error))
  }

  const menu = (event, team) => (
    <Menu>
      <Menu.Item key='payment-slip'>
        <div onClick={() => {
          setSlipModalVisible(true)
          setSelectedTeam(team)
          setSelectedEvent(event)
        }}>
          ดู/อัพโหลดสลิป
        </div>
      </Menu.Item>
      <Menu.Item key='leave-event'>
        <div onClick={() => Modal.confirm({
          title: 'แน่ใจที่จะถอนตัวหรือไม่',
          onOk: () => onLeaveEvent(event._id, team._id)
        })}>
          ถอนตัว
        </div>
      </Menu.Item>
    </Menu>
  )

  const prepareStateData = ({ event, team }) => {
    return (
      <div key={team._id} style={{ padding: '0 20px 10px 20px', }}>
        <div style={{ display: 'flex', marginBottom: '5px', alignItems: 'center' }}>
          <Tag color={EVENT.TEAM_STATUS[team?.status]?.COLOR}>{EVENT.TEAM_STATUS[team?.status]?.LABEL}</Tag>
          <Tag color={TRANSACTION[team?.paymentStatus].COLOR}>{TRANSACTION[team?.paymentStatus].LABEL}</Tag>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <div style={{ width: '150px' }}>{team.team.players[0]?.officialName}</div>
              <div>{team.team.players[0].club}</div>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <div style={{ width: '150px' }}>{team.team.players[1]?.officialName}</div>
              <div>{team.team.players[1]?.club}</div>
            </div>
          </div>
          <Dropdown overlay={menu(event, team)} trigger={['click']} placement="bottomRight">
            <div><MenuOutlined /></div>
          </Dropdown>
        </div>
      </div>
    )
  }

  return (

    <div
      style={{
        minWidth: '350px',
        width: '100%',
        maxWidth: '400px',
        margin: '10px',
        borderRadius: '10px',
        boxShadow: '2px 2px 10px -5px rgba(0,0,0,0.75)'
      }}>
      <Link
        href={`/tournament/${tournament._id}`}
        passHref
      >
        <h3 style={{ padding: '20px 20px 0 20px' }}>{tournament.name}</h3>
      </Link >
      {
        tournament.events.map(event => {
          if (tournament.status === 'ongoing' || tournament.status === 'knockOut') {
            return <NextMatch key={event._id} event={event} tournamentID={tournament._id} />
          } else {
            const teams = event.teams.filter(elm => elm.team.players[0]._id === user.playerID || elm.team.players[1]?._id === user.playerID)
            if (teams && teams.length > 0) {
              return (
                <div key={event._id}>
                  <Divider >{event.name}</Divider>
                  {teams.map(team => prepareStateData({ event, team }))}
                </div>
              )
            }
          }
        })
      }
      <SlipModal
        visible={slipModalVisible}
        setVisible={setSlipModalVisible}
        team={selectedTeam}
        event={selectedEvent}
        mutate={mutate}
      />
    </div>

  )
}
export default MyTournamentCardHomePage