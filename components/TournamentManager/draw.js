import { useEvent, useTournament } from "../../utils"
import { Tabs, Menu, Dropdown, Button, Radio, Table, Form, Input, Checkbox, InputNumber } from 'antd'
import {
  SyncOutlined
} from '@ant-design/icons'

import { COLOR } from "../../constant"
import request from "../../utils/request"
import Loading from "../loading"
import { useState } from "react"

const Draw = (props) => {
  const { tournament, mutate } = useTournament(props.tournamentID)
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState('group')

  const groupColumn = (group) => [
    {
      title: `กลุ่ม ${group}`,
      dataIndex: 'group',
      align: 'center'
    }
  ]

  const teamData = (teams) => {
    const returnData = teams.map((team, index) => {
      return ({
        group: <div key={`team-${index}`}>
          {team.players.map((player) =>
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

  const drawBracket = (order) => {
    const height = 50
    const lineWidth = 50
    const blockWidth = 200
    const teamCount = order.length

    return (
      <div style={{ display: 'flex' }}>

        <div>
          {order.map((team, i) => {
            return <>
              <div style={{
                width: `${blockWidth}px`,
                height: `${height}px`,
                borderBottom: '1px solid #333',
                borderRight: i % 2 === 1 ? '1px solid #333' : null,
                display: 'flex',
                alignItems: 'flex-end'
              }}>{team}</div>
            </>
          })}
        </div>

        {
          Array.apply(null, Array(Math.log2(teamCount))).map((round, i) => (
            <div key={`round-${i}`} style={{ paddingTop: `${(height / 2) + (i < 3 ? i : Math.pow(2, i - 1)) * height}px` }}>
              {Array.apply(null, Array(teamCount - (i < 3 ? i : Math.pow(2, i - 1)))).map((team, j) => {
                return <div
                  key={`key-${j + 1}`}
                  style={{
                    width: `${lineWidth}px`,
                    height: `${height}px`,
                    borderLeft: i !== 0 && (j % Math.pow(2, i + 1) < Math.pow(2, i) ? '1px solid #333' : null),
                    borderBottom: j % Math.pow(2, i + 1) === (i < 2 ? 0 : Math.pow(2, i - 1) - 1) ? '1px solid #333' : null
                  }} />
              })}
            </div>
          ))
        }

        {/* <div style={{ paddingTop: `${height / 2}px` }}>
          {Array.apply(null, Array(teamCount)).map((team, i) => {
            return <div
              key={`key-${i + 1}`}
              style={{
                width: `${lineWidth}px`,
                height: `${height}px`,
                borderBottom: i % 2 === 0 ? '1px solid #333' : null
              }} />
          })}
        </div>

        <div style={{ paddingTop: `${(height / 2) + height}px` }}>
          {Array.apply(null, Array(teamCount - 1)).map((team, i) => {
            return <div
              key={`key-${i + 1}`}
              style={{
                width: `${lineWidth}px`,
                height: `${height}px`,
                borderLeft: i % 4 < 2 ? '1px solid #333' : null,
                borderBottom: i % 4 === 0 ? '1px solid #333' : null,
              }} />
          })}
        </div> */}

        {/* <div style={{ paddingTop: `${(height / 2) + 2 * height}px` }}>
          {Array.apply(null, Array(teamCount - 2)).map((team, i) => {
            return <div
              key={`key-${i + 1}`}
              style={{
                width: `${lineWidth}px`,
                height: `${height}px`,
                borderLeft: i % 8 < 4 ? '1px solid #333' : null,
                borderBottom: i % 8 === 1 ? '1px solid #333' : null,
              }} />
          })}
        </div> */}

        {/* <div style={{ paddingTop: `${(height / 2) + 4 * height}px` }}>
          {Array.apply(null, Array(teamCount - 4)).map((team, i) => {
            return <div
              key={`key-${i + 1}`}
              style={{
                width: `${lineWidth}px`,
                height: `${height}px`,
                borderLeft: i % 16 < 8 ? '1px solid #333' : null,
                borderBottom: i % 16 === 3 ? '1px solid #333' : null,
              }} />
          })}
        </div> */}

        {/* <div style={{ paddingTop: `${(height / 2) + 8 * height}px` }}>
          {Array.apply(null, Array(teamCount - 8)).map((team, i) => {
            return <div
              key={`key-${i + 1}`}
              style={{
                width: `${lineWidth}px`,
                height: `${height}px`,
                borderLeft: i % 32 < 16 ? '1px solid #333' : null,
                borderBottom: i % 32 === 7 ? '1px solid #333' : null,
              }} />
          })}
        </div> */}
        {/* <div style={{ paddingTop: `${(height / 2) + 16 * height}px` }}>
          {Array.apply(null, Array(teamCount - 16)).map((team, i) => {
            return <div
              key={`key-${i + 1}`}
              style={{
                width: `${lineWidth}px`,
                height: `${height}px`,
                borderLeft: i % 64 < 32 ? '1px solid #333' : null,
                borderBottom: i % 64 === 15 ? '1px solid #333' : null,
              }} />
          })}
        </div> */}
      </div>
    )
  }
  const onRandomOrder = (values, event) => {
    setLoading(true)
    request.post('/event/random-order', {
      eventID: event._id,
      groupCount: values.groupCount,
      qualifiedPerGroup: values.qualifiedPerGroup
    }).then(async () => {
      await mutate()
      setLoading(false)
    })
      .catch((err) => {
        console.log(err)
        setLoading(false)
      })
  }

  return <div>
    <Tabs defaultActiveKey="1" >
      {tournament?.events.map(event => {
        return (
          <Tabs.TabPane tab={event.name} key={event._id}>
            {loading
              ? <Loading />
              :
              <div style={{ display: 'flex' }}>
                {event.order.group.length === 0 && event.order.knockOut.length === 0 ?
                  <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                    <Form
                      labelCol={{ span: 12 }}
                      wrapperCol={{ span: 12 }}
                      style={{ width: 350, }}
                      onFinish={(values) => onRandomOrder(values, event)}
                    >
                      <Form.Item
                        label="จำนวนกลุ่ม"
                        name="groupCount"
                        rules={[{ required: true, message: 'กรุณาระบุจำนวนกลุ่ม' }]}
                      >
                        <InputNumber />
                      </Form.Item>
                      <Form.Item
                        label="จำนวนคู่ที่เข้ารอบ"
                        name="qualifiedPerGroup"
                        rules={[{ required: true, message: 'กรุณาระบุจำนวนคู่ที่เข้ารอบ' }]}
                      >
                        <InputNumber />
                      </Form.Item>
                      <Form.Item wrapperCol={{ offset: 7, span: 10 }}>
                        < Button
                          htmlType="submit"
                          style={{
                            padding: '10px 20px',
                            backgroundColor: COLOR.MAIN_THEME,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px',
                            borderRadius: '50px',
                            justifyContent: 'center'
                          }}>
                          <div>Random</div>
                          <SyncOutlined />
                        </Button>
                      </Form.Item>
                    </Form>
                  </div>
                  :
                  <div>
                    <Radio.Group onChange={e => setMode(e.target.value)} value={mode} style={{ marginBottom: 8 }}>
                      <Radio.Button value="group">รอบแบ่งกลุ่ม</Radio.Button>
                      <Radio.Button value="knockOut">รอบ Knock Out</Radio.Button>
                    </Radio.Group>
                    {
                      mode === 'group'
                        ? <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                          {
                            event.order?.group.map((group, index) => {
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
                        : event.order?.knockOut && drawBracket(event.order?.knockOut)
                    }


                  </div>
                }

              </div>
            }

          </Tabs.TabPane>
        )
      })}
    </Tabs>
  </div >
}
export default Draw