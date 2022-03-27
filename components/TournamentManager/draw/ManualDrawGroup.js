import { Button, Table, Popconfirm, Select, Modal, Form, InputNumber } from 'antd'
import { useWindowSize } from '../../../utils'
import { useState, } from 'react'
import request from '../../../utils/request'
import ServiceErrorModal from '../../ServiceErrorModal'

const DisplayTeam = ({ team }) => {
  return (
    <div>
      {team?.players.map(player => (
        <div key={player._id} style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
          <div>{player.officialName}</div>
          <div>({player.club})</div>
        </div>
      ))}
    </div >
  )
}

const GROUP_DRAW = [
  {
    NAME: 'A',
    VALUE: 0
  },
  {
    NAME: 'B',
    VALUE: 1
  },
  {
    NAME: 'C',
    VALUE: 2
  },
  {
    NAME: 'D',
    VALUE: 3
  },
  {
    NAME: 'E',
    VALUE: 4
  },
  {
    NAME: 'F',
    VALUE: 5
  },
  {
    NAME: 'G',
    VALUE: 6
  },
  {
    NAME: 'H',
    VALUE: 7
  },
  {
    NAME: 'I',
    VALUE: 8
  },
  {
    NAME: 'J',
    VALUE: 9
  },
  {
    NAME: 'K',
    VALUE: 10
  },
  {
    NAME: 'L',
    VALUE: 11
  },
  {
    NAME: 'M',
    VALUE: 12
  },
  {
    NAME: 'N',
    VALUE: 13
  },
  {
    NAME: 'O',
    VALUE: 14
  },
  {
    NAME: 'P',
    VALUE: 15
  }
]

const ManualDrawGroup = ({ event, playerList, mutate }) => {
  const [order, setOrder] = useState([])
  const [showOrder, setShowOrder] = useState([])
  const [width, height] = useWindowSize()
  const [settingModalVisible, setSettingModalVisible] = useState(false)
  const [form] = Form.useForm()

  const onChangeOrder = async (orderValue, team, i) => {
    if (orderValue) {
      let tempOrderShow = [...showOrder]
      tempOrderShow = tempOrderShow?.map(group => {
        return group?.filter(elm => elm._id !== team.team._id)
      })
      if (!Array.isArray(tempOrderShow[orderValue])) {
        tempOrderShow[orderValue] = []
      }
      if (!tempOrderShow[orderValue].includes(team.team)) {
        tempOrderShow[orderValue].push(team.team)
      }
      setShowOrder(tempOrderShow)


      let tempOrder = [...order]
      tempOrder = tempOrder?.map(group => {
        return group?.filter(elm => elm !== team.team._id)
      })

      if (!Array.isArray(tempOrder[orderValue])) {
        tempOrder[orderValue] = []
      }
      if (!tempOrder[orderValue].includes(team.team._id)) {
        tempOrder[orderValue].push(team.team._id)
      }
      setOrder(tempOrder)
    } else {
      const tempOrderShow = [...showOrder]
      const newOrderShow = tempOrderShow?.map(group => {
        return group?.filter(elm => elm._id !== team.team._id)
      })
      const tempOrder = [...order]
      const newOrder = tempOrder?.map(group => {
        return group?.filter(elm => elm !== team.team._id)
      })
      const newOrder2 = newOrder.map(group => group?.length === 0 ? undefined : group)
      const newOrderShow2 = newOrderShow.map(group => group?.length === 0 ? undefined : group)

      setOrder(newOrder2)
      setShowOrder(newOrderShow2)
    }
  }

  const groupColumn = (group) => [
    {
      title: `กลุ่ม ${GROUP_DRAW[group].NAME}`,
      dataIndex: 'group',
      align: 'center'
    }
  ]
  const teamData = (teams) => {
    const returnData = teams?.map((team, index) => {
      return ({
        key: `team-${index}`,
        group: <DisplayTeam key={index + 1} team={team} />
      })
    })
    return returnData
  }


  const onSaveOrder = (values) => {
    request.post('/event/random-order', {
      groupOrder: order,
      eventID: event._id,
      qualified: values.qualified,
      qualifiedConsolation: values.qualifiedConsolation
    })
      .then(() => mutate())
      .catch(() => ServiceErrorModal())
  }

  const columns = [
    {
      key: 'index',
      dataIndex: 'index',
      title: 'ลำดับ',
      align: 'center',
      width: '10%'
    },
    {
      key: 'team',
      dataIndex: 'team',
      title: 'ผู้สมัคร',
      align: 'center',
      width: '60%'
    },
    {
      key: 'draw',
      dataIndex: 'draw',
      title: 'ลำดับสาย',
      align: 'center',
      width: '30%'
    },
  ]
  return (
    <div style={{ position: 'relative' }}>
      <div style={{ display: 'flex' }}>
        <Table
          columns={columns}
          dataSource={playerList.map((team, index) => ({
            index: index + 1,
            team: <DisplayTeam team={team.team} />,
            draw: <Select style={{ width: '80px' }} onChange={(value) => onChangeOrder(value, team, index)} allowClear>
              {GROUP_DRAW.map((elm) => (
                <Select.Option key={elm.VALUE} >
                  {elm.NAME}
                </Select.Option>
              ))}
            </Select>
          }))}
          pagination={false}
          style={{ width: '50%' }}
          scroll={{ y: height - 385 }}
          size='small'
        />
        <div style={{ overflow: 'scroll', marginLeft: '40px', height: height - 345 }}>
          {
            showOrder?.map((group, index) => (
              <div key={`group-${index + 1}`}>
                <Table
                  dataSource={teamData(group)}
                  columns={groupColumn(index)}
                  style={{ width: '300px' }}
                  size="small"
                  pagination={false}
                />
              </div>
            ))
          }
        </div>
      </div>
      <div style={{ display: 'flex', gap: '10px', width: '150px', position: 'absolute', top: '10px', right: '10px' }}>
        <Button onClick={() => {
          setOrder([])
          setShowOrder([])
        }} >
          Reset
        </Button>
        <Button type="primary" onClick={() => setSettingModalVisible(true)}>
          บันทึก
        </Button>
      </div>
      <Modal
        visible={settingModalVisible}
        onCancel={() => setSettingModalVisible(false)}
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
            label='จำนวนทีมทั้งหมดที่เข้ารอบ'
            name='qualified'
          >
            <InputNumber />
          </Form.Item>

          {event.format === 'roundRobinConsolation' && <Form.Item
            label='จำนวนทีมสายล่าง'
            name='qualifiedConsolation'
          >
            <InputNumber />
          </Form.Item>}
        </Form>
      </Modal>
    </div>
  )
}
export default ManualDrawGroup