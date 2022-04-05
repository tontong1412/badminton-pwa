import { useEvent, useTournament, useWindowSize } from "../../../utils"
import { Tabs, Menu, Dropdown, Button, Radio, Table, Form, Input, Checkbox, InputNumber, Modal, Popconfirm } from 'antd'
import request from "../../../utils/request"
import Loading from "../../loading"
import { useState } from "react"
import drawBracket from "../../../utils/drawBracket"
import ManualDrawKnockOut from "./ManualDrawKnockOut"
import ManualDrawGroup from "./ManualDrawGroup"
import RandomDraw from "./RandomDraw"

const Draw = (props) => {
  const { tournament, mutate } = useTournament(props.tournamentID)
  const [mode, setMode] = useState('group')
  const [method, setMethod] = useState('random')
  const [tab, setTab] = useState(tournament?.events[0]._id)
  // Todo: default mode ตาม event.step
  const groupColumn = (group) => [
    {
      title: `กลุ่ม ${group}`,
      dataIndex: 'group',
      align: 'center'
    }
  ]

  const teamData = (teams) => {
    const returnData = teams?.map((team, index) => {
      return ({
        key: `team-${index}`,
        group: <div key={`team-${index}`}>
          {team.players?.map((player) =>
            <div key={`${player._id}`} style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <div>{player.officialName}</div>
              <div>{`(${player.club})`}</div>
            </div>)
          }
        </div >
      })
    })
    return returnData
  }

  const columns = [
    {
      key: 'team',
      dataIndex: 'team',
      title: 'ผู้แข่งขัน',
      align: 'center',
      width: '80%'
    },
    {
      key: 'draw',
      dataIndex: 'draw',
      title: 'กลุ่ม',
      align: 'center',
      width: '20%'
    },
  ]

  const renderDraw = (event) => {
    if (event.format === 'singleElim') {
      return event.order?.singleElim.length > 0 && drawBracket(
        event.order?.singleElim.map((team, i) => <div key={i + 1}>
          {team ? team.players.map(player => <div key={player._id} style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <div style={{ width: '140px' }}>{player.officialName}</div>
            <div>{`(${player.club})`}</div>
          </div>) : 'bye'}
        </div>)
      )
    }
    switch (mode) {
      case 'group':
        return <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
          {
            event.order?.group?.map((group, index) => {
              return (
                <div key={`group-${index + 1}`}>
                  <Table
                    dataSource={teamData(group)}
                    columns={groupColumn(index + 1)}
                    style={{ width: '300px' }}
                    size="small"
                    pagination={false}
                  />
                </div>
              )
            })
          }
        </div>
      case 'knockOut':
        return event.order?.knockOut.length > 0 && drawBracket(event.order?.knockOut)

      case 'consolation':
        return event.order?.consolation.length > 0 && drawBracket(event.order?.consolation)
      default:
        return
    }
  }

  const renderManualDraw = (event) => {
    switch (event.format) {
      case 'singleElim':
        return <ManualDrawKnockOut mutate={mutate} eventID={event._id} playerList={event.teams} />
      case 'roundRobin':
        return <ManualDrawGroup mutate={mutate} event={event} playerList={event.teams} />
      case 'roundRobinConsolation':
        return <ManualDrawGroup mutate={mutate} event={event} playerList={event.teams} />
      default:
        return <ManualDrawGroup mutate={mutate} event={event} playerList={event.teams} />
    }
  }

  const DrawForm = ({ event }) => {
    switch (method) {
      case 'manual':
        return renderManualDraw(event)
      case 'random':
        return <RandomDraw event={event} mutate={mutate} />
      default:
        return
    }
  }

  const ControlPanel = () => {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', margin: '0px 20px 20px 20px', }}>
        <Radio.Group
          options={[
            { label: 'โปรแกรมสุ่ม', value: 'random' },
            { label: 'จับเอง', value: 'manual' }
          ]}
          onChange={(e => setMethod(e.target.value))}
          value={method}
          optionType="button"
        />
      </div>
    )
  }

  return <div>
    <Tabs
      defaultActiveKey={tab}
      activeKey={tab}
      onChange={(key) => {
        setTab(key)
        setMode('knockOut')
      }}
    >
      {tournament?.events?.map(event => {
        return (
          <Tabs.TabPane tab={event.name} key={event._id} style={{ position: 'relative' }}>
            {<div style={{ display: 'flex' }}>
              {!event?.order?.group?.length && !event.order?.knockOut?.length && !event.order?.singleElim?.length
                ?
                <div style={{ margin: 'auto', width: '100%' }}>
                  <ControlPanel />
                  <DrawForm event={event} />
                </div>
                :
                <div style={{ paddingBottom: '5px' }}>
                  {event.format !== 'singleElim' &&
                    <Radio.Group onChange={e => setMode(e.target.value)} value={mode} style={{ marginBottom: 8 }}>
                      {(event.format === 'roundRobin' || event.format === 'roundRobinConsolation') && <Radio.Button value="group">รอบแบ่งกลุ่ม</Radio.Button>}
                      <Radio.Button value="knockOut">รอบ Knock Out</Radio.Button>
                      {event.format === 'roundRobinConsolation' && <Radio.Button value="consolation">สายล่าง</Radio.Button>}
                    </Radio.Group>}
                  <Popconfirm
                    title='แน่ใจที่จะ Reset หรือไม่'
                    placement="left"
                    onConfirm={() => {
                      request.put(`/event/${event._id}`, {
                        order: {}
                      }).then(() => mutate())
                    }}
                    okText="Yes"
                    cancelText="No"
                  >
                    <div style={{
                      position: 'absolute',
                      top: '20px',
                      right: '20px'
                    }}><Button
                      type='dashed'
                      onClick={() => { }}
                    >Reset</Button>
                    </div>
                  </Popconfirm>
                  {renderDraw(event)}
                </div>
              }
            </div>
            }
          </Tabs.TabPane >
        )
      })}
    </Tabs >
  </div >
}
export default Draw