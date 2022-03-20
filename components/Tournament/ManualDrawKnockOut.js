import { Tabs, Button, Table, InputNumber, message, Popconfirm, Radio, Select, Modal } from 'antd'
import { useTournament, useMatches, useWindowSize } from '../../utils'
import { useState, useEffect } from 'react'
import drawBracket from '../../utils/drawBracket'
import request from '../../utils/request'
import ServiceErrorModal from '../ServiceErrorModal'

const DisplayTeam = ({ team }) => {
  return (
    <div>
      {team.players.map(player => (
        <div key={player._id} style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
          <div>{player.officialName}</div>
          <div>({player.club})</div>
        </div>
      ))}
    </div >
  )
}

const ManualDrawKnockOut = ({ playerList }) => {
  const [order, setOrder] = useState(Array.from({ length: Math.pow(2, Math.ceil(Math.log2(playerList.length))) }, (_, index) => null))
  const [showOrder, setShowOrder] = useState(Array.from({ length: Math.pow(2, Math.ceil(Math.log2(playerList.length))) }, (_, index) => null))
  // const [data, setData] = useState([]);
  // const [loading, setLoading] = useState(false)
  const [width, height] = useWindowSize()
  const [availableDraw, setAvailableDraw] = useState(Array.from({ length: Math.pow(2, Math.ceil(Math.log2(playerList.length))) }, (_, index) => index + 1))

  const onChangeOrder = async (orderValue, team) => {
    const tempAvailableDraw = [...availableDraw]
    const indexToRemove = tempAvailableDraw.findIndex(elm => elm == orderValue)
    tempAvailableDraw.splice(indexToRemove, 1)
    setAvailableDraw(tempAvailableDraw)

    if (orderValue) {
      const tempOrderShow = [...showOrder]
      tempOrderShow[orderValue - 1] = <DisplayTeam team={team.team} />
      const tempOrder = [...order]
      tempOrder[orderValue - 1] = team.team
      setShowOrder(tempOrderShow)
      setOrder(tempOrder)
    } else {
      console.log('order', order)
      const index = order.findIndex(elm => elm?._id === team.team._id)

      const tempOrder = [...order]
      tempOrder[index] = null

      const tempOrderShow = [...showOrder]
      tempOrderShow[index] = null

      const tempAvailableDraw = [...availableDraw]
      tempAvailableDraw.push(index + 1)
      tempAvailableDraw.sort((a, b) => a - b)


      setAvailableDraw(tempAvailableDraw)
      setOrder(tempOrder)
      setShowOrder(tempOrderShow)
    }
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
            draw: <Select style={{ width: '80px' }} onChange={(value) => onChangeOrder(value, team)} allowClear>
              {availableDraw.map((elm) => (
                <Select.Option key={elm} >
                  {elm}
                </Select.Option>
              ))}
            </Select>
          }))}
          pagination={false}
          style={{ width: '50%' }}
          scroll={{ y: height - 340 }}
          size='small'
        />
        <div style={{ overflow: 'scroll', marginLeft: '40px', height: height - 300 }}>
          {drawBracket(showOrder, 350)}
        </div>

      </div>
      {/* <Popconfirm placement="top" title={'แน่ใจที่จะบันทึกหรือไม่'} onConfirm={onRoundUp} okText="Yes" cancelText="No">
        <Button type='primary' style={{ position: 'absolute', top: '20px', right: '20px', width: '150px' }}>บันทึก</Button>
      </Popconfirm> */}
    </div>
  )
}
export default ManualDrawKnockOut