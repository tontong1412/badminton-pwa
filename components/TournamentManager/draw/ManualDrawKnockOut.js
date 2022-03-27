import { Button, Table, Popconfirm, Select } from 'antd'
import { useWindowSize } from '../../../utils'
import { useState, } from 'react'
import drawBracket from '../../../utils/drawBracket'
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

const ManualDrawKnockOut = ({ eventID, playerList, mutate }) => {
  const [order, setOrder] = useState(Array.from({ length: Math.pow(2, Math.ceil(Math.log2(playerList.length))) }, (_, index) => null))
  const [showOrder, setShowOrder] = useState(Array.from({ length: Math.pow(2, Math.ceil(Math.log2(playerList.length))) }, (_, index) => null))
  const [width, height] = useWindowSize()
  const [availableDraw, setAvailableDraw] = useState(Array.from({ length: Math.pow(2, Math.ceil(Math.log2(playerList.length))) }, (_, index) => index + 1))
  const [selectedDraw, setSelectedDraw] = useState(Array.from({ length: Math.pow(2, Math.ceil(Math.log2(playerList.length))) }, (_, index) => null))
  const onChangeOrder = async (orderValue, team, i) => {

    if (orderValue) {
      const index = order.findIndex(elm => elm?._id === team.team._id)
      const tempOrder = [...order]
      const tempOrderShow = [...showOrder]
      const tempSelectedDraw = [...selectedDraw]
      const tempAvailableDraw = [...availableDraw]
      if (index !== -1) {
        tempOrder[index] = null
        tempOrderShow[index] = null
        tempSelectedDraw[i] = null
        tempAvailableDraw.push(index + 1)
        tempAvailableDraw.sort((a, b) => a - b)
      }
      tempOrderShow[orderValue - 1] = <DisplayTeam team={team.team} />
      setShowOrder(tempOrderShow)

      tempOrder[orderValue - 1] = team.team._id
      setOrder(tempOrder)

      tempSelectedDraw[i] = orderValue
      setSelectedDraw(tempSelectedDraw)

      // remove from available list
      const indexToRemove = tempAvailableDraw.findIndex(elm => elm == orderValue)
      tempAvailableDraw.splice(indexToRemove, 1)
      setAvailableDraw(tempAvailableDraw)
    } else {
      const index = order.findIndex(elm => elm?._id === team.team._id)
      if (!selectedDraw[i]) return
      const tempOrder = [...order]
      tempOrder[index] = null
      setOrder(tempOrder)

      const tempOrderShow = [...showOrder]
      tempOrderShow[index] = null
      setShowOrder(tempOrderShow)

      const tempSelectedDraw = [...selectedDraw]
      tempSelectedDraw[i] = null
      setSelectedDraw(tempSelectedDraw)

      // insert order back to available list
      const tempAvailableDraw = [...availableDraw]
      tempAvailableDraw.push(index + 1)
      tempAvailableDraw.sort((a, b) => a - b)
      setAvailableDraw(tempAvailableDraw)
    }
  }

  const onSaveOrder = () => {
    request.post('/event/random-order', { order, eventID })
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
            draw: <Select style={{ width: '80px' }} value={selectedDraw[index]} onChange={(value) => onChangeOrder(value, team, index)} allowClear>
              {availableDraw.map((elm) => (
                <Select.Option key={elm} >
                  {elm}
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
          {drawBracket(showOrder, 350)}
        </div>
      </div>
      <div style={{ display: 'flex', gap: '10px', width: '150px', position: 'absolute', top: '10px', right: '10px' }}>
        <Button onClick={() => {
          setOrder(Array.from({ length: Math.pow(2, Math.ceil(Math.log2(playerList.length))) }, (_, index) => null))
          setShowOrder(Array.from({ length: Math.pow(2, Math.ceil(Math.log2(playerList.length))) }, (_, index) => null))
          setAvailableDraw(Array.from({ length: Math.pow(2, Math.ceil(Math.log2(playerList.length))) }, (_, index) => index + 1))
          setSelectedDraw(Array.from({ length: Math.pow(2, Math.ceil(Math.log2(playerList.length))) }, (_, index) => null))
        }} >
          Reset
        </Button>
        <Popconfirm
          placement="top"
          title={'แน่ใจที่จะบันทึกหรือไม่'}
          onConfirm={onSaveOrder}
          okText="Yes"
          cancelText="No">
          <Button type="primary">
            บันทึก
          </Button>
        </Popconfirm>
      </div>
    </div>
  )
}
export default ManualDrawKnockOut