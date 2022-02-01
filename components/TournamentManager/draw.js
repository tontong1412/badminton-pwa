import { useEvent, useTournament } from "../../utils"
import { Tabs, Menu, Dropdown, Button, Radio, Table, Form, Input, Checkbox, InputNumber } from 'antd'
import {
  SyncOutlined
} from '@ant-design/icons'

import { COLOR } from "../../constant"
import request from "../../utils/request"
import Loading from "../loading"
import { useState } from "react"
import drawBracket from "../../utils/drawBracket"

const Draw = (props) => {
  const { tournament, mutate } = useTournament(props.tournamentID)
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState('group')
  // Todo: default mode ตาม event.step

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
        key: `team-${index}`,
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
                      style={{ width: 350 }}
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
                      <Form.Item wrapperCol={{ span: 24 }}>
                        <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                          < Button
                            htmlType="submit"
                            style={{
                              padding: '20px 20px',
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
                        </div>
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
                        : event.order?.knockOut.length > 0 && drawBracket(event.order?.knockOut)
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