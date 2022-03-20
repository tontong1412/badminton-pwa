import { useEvent, useTournament, useWindowSize } from "../../utils"
import { Tabs, Menu, Dropdown, Button, Radio, Table, Form, Input, Checkbox, InputNumber, Modal, Popconfirm } from 'antd'
import {
  SyncOutlined
} from '@ant-design/icons'

import { COLOR } from "../../constant"
import request from "../../utils/request"
import Loading from "../loading"
import { useState } from "react"
import drawBracket from "../../utils/drawBracket"
import ManualDrawKnockOut from "../Tournament/ManualDrawKnockOut"

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

  const onRandomOrder = (values, event) => {
    setLoading(true)
    request.post('/event/random-order', {
      eventID: event._id,
      groupCount: values.groupCount,
      qualifiedPerGroup: values.qualifiedPerGroup,
      consolationQualified: values.qualifiedConsolation
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
      qualifiedPerGroup: values.qualified,
      consolationQualified: values.qualifiedConsolation
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
        return <div style={{ display: 'flex', gap: '10px' }}>
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
                    const newValue = {
                      ...value,
                      [team?.team?._id]: order
                    }
                    setValue(newValue)
                  }}
                />
              }))}
              pagination={false}
              scroll={{ y: height - 340 }}
              size='small'
            />
          </div>
          <div style={{
            width: width / 2,
            height: height - 350,
            overflow: 'scroll',
            display: 'flex',
            gap: '10px',
            flexWrap: 'wrap'
          }}>
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

  }

  const renderManualDraw = (event) => {
    switch (event.format) {
      case 'singleElim':
        return <ManualDrawKnockOut playerList={event.teams} />
      default:
        return (
          <div style={{ display: 'flex', gap: '10px' }}>
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
                      const newValue = {
                        ...value,
                        [team?.team?._id]: order
                      }
                      setValue(newValue)
                    }}
                  />
                }))}
                pagination={false}
                scroll={{ y: height - 340 }}
                size='small'
              />
            </div>
            <div style={{
              width: width / 2,
              height: height - 350,
              overflow: 'scroll',
              display: 'flex',
              gap: '10px',
              flexWrap: 'wrap'
            }}>
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
        )
    }
  }

  const renderRandomForm = (event) => {
    switch (method) {
      case 'manual':
        return renderManualDraw(event)

      case 'random':
        if (event.format === 'singleElim') {
          return <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            < Button
              onClick={() => onRandomOrder({}, event)}
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
        }
        return (
          <Form
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

            {event?.format === 'roundRobinConsolation' &&
              <Form.Item
                label="จำนวนคู่ในสายล่าง"
                name="qualifiedConsolation"
                rules={[{ required: true, message: 'กรุณาระบุจำนวนคู่ที่เข้ารอบสายล่าง' }]}
              >
                <InputNumber />
              </Form.Item>
            }
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
        )

      default:
        return
    }
  }

  const renderControlPanel = (event) => {
    return (
      <div style={{ display: 'flex', justifyContent: 'space-between', margin: '0px 20px 20px 20px', }}>
        {width > 400 && <div style={{ width: '150px' }} />}
        <Radio.Group
          options={[
            { label: 'โปรแกรมสุ่ม', value: 'random' },
            { label: 'จับเอง', value: 'manual' }
          ]}
          onChange={(e => setMethod(e.target.value))}
          value={method}
          optionType="button"
        />
        {method === 'manual' ?
          <div style={{ display: 'flex', gap: '10px', width: '150px' }}>
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
          : <div style={{ width: '150px' }} />
        }
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
            {loading
              ? <Loading />
              : <div style={{ display: 'flex' }}>
                {!event?.order?.group?.length && !event.order?.knockOut?.length && !event.order?.singleElim?.length
                  ?
                  <div style={{ margin: 'auto', width: '100%' }}>
                    {renderControlPanel(event)}
                    {renderRandomForm(event)}
                  </div>
                  :
                  <div style={{ paddingBottom: '5px' }}>
                    {event.format !== 'singleElim' &&
                      <Radio.Group onChange={e => setMode(e.target.value)} value={mode} style={{ marginBottom: 8 }}>
                        {(event.format === 'roundRobin' || event.format === 'roundRobinConsolation') && <Radio.Button value="group">รอบแบ่งกลุ่ม</Radio.Button>}
                        <Radio.Button value="knockOut">รอบ Knock Out</Radio.Button>
                        {event.format === 'roundRobinConsolation' && <Radio.Button value="roundRobinConsolation">สายล่าง</Radio.Button>}
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

        {selectedEvent?.format === 'roundRobinConsolation' && <Form.Item
          label='จำนวนทีมสายล่าง'
          name='qualifiedConsolation'
        >
          <InputNumber />
        </Form.Item>}
      </Form>
    </Modal>
  </div >
}
export default Draw