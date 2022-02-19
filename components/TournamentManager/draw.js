import { useEvent, useTournament, useWindowSize } from "../../utils"
import { Tabs, Menu, Dropdown, Button, Radio, Table, Form, Input, Checkbox, InputNumber, Modal } from 'antd'
import {
  SyncOutlined
} from '@ant-design/icons'

import { COLOR } from "../../constant"
import request from "../../utils/request"
import Loading from "../loading"
import { useState } from "react"
import drawBracket from "../../utils/drawBracket"

const Draw = (props) => {
  const [form] = Form.useForm()
  const { tournament, mutate } = useTournament(props.tournamentID)
  const [loading, setLoading] = useState(false)
  const [width, height] = useWindowSize()
  const [mode, setMode] = useState('group')
  const [method, setMethod] = useState('random')
  const [groupOrder, setGroupOrder] = useState([])
  const [groupOrderShow, setGroupOrderShow] = useState([])
  const [qualifiedModalVisible, setQualifiedModalVisible] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState()
  const [value, setValue] = useState({})
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

  const onSaveOrder = (values) => {
    setLoading(true)
    request.post(`/event/random-order`, {
      eventID: selectedEvent._id,
      groupOrder,
      qualifiedPerGroup: values.qualified
    }).then(async () => {
      await mutate()
      setLoading(false)
      setQualifiedModalVisible(false)
      setGroupOrder([])
      setGroupOrderShow([])
      setValue({})
    })
      .catch((err) => {
        console.log(err)
        setLoading(false)
        setQualifiedModalVisible(false)
        setGroupOrder([])
        setGroupOrderShow([])
        setValue({})
      })
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

  const onChangeOrder = (orderValue, team, i) => {
    if (orderValue) {
      const tempGroupOrderShow = [...groupOrderShow]
      if (!Array.isArray(tempGroupOrderShow[orderValue - 1])) {
        tempGroupOrderShow[orderValue - 1] = []
      }
      if (!tempGroupOrderShow[orderValue - 1].includes(team.team)) {
        tempGroupOrderShow[orderValue - 1].push(team.team)
      }

      const tempGroupOrder = [...groupOrder]
      if (!Array.isArray(tempGroupOrder[orderValue - 1])) {
        tempGroupOrder[orderValue - 1] = []
      }
      if (!tempGroupOrder[orderValue - 1].includes(team.team._id)) {
        tempGroupOrder[orderValue - 1].push(team.team._id)
      }
      setGroupOrderShow(tempGroupOrderShow)
      setGroupOrder(tempGroupOrder)
    } else {
      const tempGroupOrderShow = [...groupOrderShow]
      const newGroupOrderShow = tempGroupOrderShow?.map(group => {
        return group?.filter(elm => elm._id !== team.team._id)
      })
      const tempGroupOrder = [...groupOrder]
      const newGroupOrder = tempGroupOrder?.map(group => {
        return group?.filter(elm => elm !== team.team._id)
      })
      setGroupOrder(newGroupOrder)
      setGroupOrderShow(newGroupOrderShow)
    }
  }

  return <div>
    <Tabs defaultActiveKey="1" >
      {tournament?.events?.map(event => {
        return (
          <Tabs.TabPane tab={event.name} key={event._id}>
            {loading
              ? <Loading />
              : <div style={{ display: 'flex' }}>
                {event.order.group.length === 0 && event.order.knockOut.length === 0 ?
                  <div style={{ margin: 'auto', width: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', margin: '0px 20px 20px 20px', }}>
                      <div />
                      <Radio.Group
                        options={[
                          { label: 'โปรแกรมสุ่ม', value: 'random' },
                          { label: 'จับเอง', value: 'manual' }
                        ]}
                        onChange={(e => setMethod(e.target.value))}
                        value={method}
                        optionType="button"
                      />
                      {method === 'manual'
                        ? <div style={{ display: 'flex', gap: '10px' }}>
                          <Button onClick={() => {
                            setGroupOrder([])
                            setGroupOrderShow([])
                            setValue({})
                          }} >
                            Reset
                          </Button>
                          <Button
                            onClick={() => {
                              setQualifiedModalVisible(true)
                              setSelectedEvent(event)
                            }}
                            type="primary">
                            บันทึก
                          </Button>
                        </div>
                        : <div />}
                    </div>
                    {method === 'random'
                      ? <Form
                        labelCol={{ span: 12 }}
                        wrapperCol={{ span: 24 }}
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
                          label="จำนวนคู่รอบ knock out"
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
                      : <div style={{ display: 'flex', gap: '10px' }}>
                        <div style={{ width: width / 2, height: height - 350, overflow: 'scroll' }}>
                          <Table
                            columns={columns}
                            dataSource={event.teams?.map((team, i) => ({
                              team: <div>
                                {team.team.players?.map((player, i) =>
                                  <div key={player._id} style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                                    <div>{player.officialName}</div>
                                    <div>{`(${player.club})`}</div>
                                  </div>)}
                              </div>,
                              draw: <InputNumber
                                key={team.team._id}
                                onBlur={(e) => onChangeOrder(e.target.value, team, i)}
                                min={1}
                                value={value[team.team._id]}
                                onChange={(order) => {
                                  console.log(value)
                                  const newValue = {
                                    ...value,
                                    [team.team._id]: order
                                  }
                                  console.log(newValue)
                                  setValue(newValue)
                                }}
                              />

                            }))}
                            pagination={false}
                            scroll={{ y: height - 340 }}
                            size='small'
                          />
                        </div>
                        <div style={{ width: width / 2, height: height - 350, overflow: 'scroll', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                          {
                            groupOrderShow?.map((group, index) => (
                              <div key={`group-${index + 1}`}>
                                <Table
                                  dataSource={teamData(group)}
                                  columns={groupColumn(index + 1)}
                                  style={{ width: '300px' }}
                                  size="small"
                                  pagination={false}
                                />
                              </div>
                            ))
                          }
                        </div>
                      </div>
                    }

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
    <Modal
      visible={qualifiedModalVisible}
      onCancel={() => setQualifiedModalVisible(false)}
      onOk={form.submit}
    >
      <Form
        form={form}
        labelCol={{ span: 12 }}
        wrapperCol={{ span: 24 }}
        style={{ marginTop: '30px' }}
        onFinish={onSaveOrder}
      >
        <Form.Item
          label='จำนวนทีมที่เข้ารอบ'
          name='qualified'
        >
          <InputNumber />
        </Form.Item>
      </Form>
    </Modal>
  </div >
}
export default Draw