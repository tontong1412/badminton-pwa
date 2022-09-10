import { DatePicker, Form, Input, Modal, Select, Divider, AutoComplete, message, Checkbox } from 'antd'
import { useState, useEffect } from 'react'
import { useTournament, usePlayers, usePlayer } from '../../utils'
import request from '../../utils/request'
import moment from 'moment'
import { useSelector } from 'react-redux'
import Highlighter from "react-highlight-words";
import { COLOR } from '../../constant'
const RegisterModal = ({ visible, setVisible, tournamentID }) => {
  const [form] = Form.useForm()
  const [player1, setPlayer1] = useState()
  const [player2, setPlayer2] = useState()
  const { tournament, mutate } = useTournament(tournamentID)
  const [contactPerson, setContactPerson] = useState()
  const [loading, setLoading] = useState(false)
  const [options, setOptions] = useState([])
  const { players, mutate: mutatePlayer } = usePlayers()
  const { user } = useSelector(state => state)
  const [type, setType] = useState('single')
  const { player: me } = usePlayer(user.playerID)




  const onFinish = (values) => {
    if (player1 && player2 && player1 === player2) {
      Modal.error({
        title: 'โปรดตรวจสอบชื่อผู้เล่น',
        content: 'ผู้เล่นทั้งสองไม่สามารถเป็นคนเดียวกัน'
      })
      return
    }
    setLoading(true)
    const composePlayer = [
      {
        _id: player1,
        officialName: values.player1Name,
        club: values.player1Club,
        birthDate: values.player1BirthDate,
        gender: values.player1Gender,
        displayName: values.player1DisplayName
      },
    ]
    if (values.player2Name) {
      composePlayer.push({
        _id: player2,
        officialName: values.player2Name,
        club: values.player2Club,
        birthDate: values.player2BirthDate,
        gender: values.player2Gender,
        displayName: values.player2DisplayName
      }
      )
    }
    request.post('/event/register', {
      eventID: values.eventID,
      players: composePlayer,
      contact: {
        _id: user.playerID,
        lineID: values.lineID,
        tel: values.tel
      }
    },
      user.token
    ).then(() => {
      setVisible(false)
      setLoading(false)
      mutate()
      mutatePlayer()
      form.resetFields()
      setPlayer1()
      setPlayer2()
      message.success('ลงทะเบียนแล้ว ท่านสามารถตรวจสอบได้ที่แท็บ "รายชื่อ"')
    })
      .catch(err => {
        setVisible(false)
        setLoading(false)
        mutate()
        form.resetFields()
        setPlayer1()
        setPlayer2()
        if (err.response.status === 409) {
          Modal.info({ title: 'คู่นี้ลงสมัครแล้ว', content: 'ท่านสามารถตรวจสอบผลการประเมินมือได้ที่แท็บรายชื่อ' })
        } else {
          Modal.error({ title: 'ไม่สำเร็จ กรุณาลองใหม่อีกครั้ง' })
        }

      })

  }

  const onSearch = (searchText) => {
    const searchTextLower = searchText.toLowerCase()
    const searchOptions = players.filter(player => player.officialName?.toLowerCase().includes(searchTextLower)
    )
      .sort((a, b) => a.officialName.localeCompare(b.officialName))
      .map(player => {
        return {
          key: player._id,
          value: player.officialName,
          label: (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Highlighter
                highlightStyle={{ backgroundColor: 'peachpuff', padding: 0, margin: 0, borderRadius: '3px' }}
                searchWords={[searchText]}
                autoEscape={true}
                textToHighlight={player.officialName}
              />
            </div>
          )
        }
      })
    setOptions(
      !searchText ? [] : searchOptions,
    )
  }

  const onSelect = (data, options, player) => {
    if (player === 'player1') setPlayer1(options.key)
    else if (player === 'player2') setPlayer2(options.key)
    const selectedPlayer = players.find(player => player._id === options.key)

    if (player === 'contact') {
      setContactPerson(options.key)
      form.setFieldsValue({
        lineID: selectedPlayer.lineID,
        tel: selectedPlayer.tel
      })
    } else {
      form.setFieldsValue({
        [`${player}Gender`]: selectedPlayer.gender,
        [`${player}Club`]: selectedPlayer.club,
        [`${player}BirthDate`]: selectedPlayer.birthDate && moment(selectedPlayer.birthDate),
        [`${player}DisplayName`]: selectedPlayer.displayName,
      })
    }
  }

  const onChange = (player) => {
    if (player === 'player1') setPlayer1()
    else if (player === 'player2') setPlayer2()
    else if (player === 'contact') setContactPerson()
  }

  const onFormValuesChange = ({ eventID, isMe }) => {
    if (eventID) setType(tournament.events.find(elm => elm._id === eventID).type)
    if (isMe) {
      console.log(isMe)
      console.log(me)
      console.log(user)
      setPlayer1(user.playerID)
      form.setFieldsValue({
        player1Name: me.officialName,
        player1Gender: me.gender,
        player1Club: me.club,
        player1DisplayName: me.displayName,
        player1BirthDate: moment(me.birthDate)
      })
    }
    if (isMe === false) {
      setPlayer1()
      form.setFieldsValue({
        player1Name: undefined,
        player1Gender: undefined,
        player1Club: undefined,
        player1DisplayName: undefined,
        player1BirthDate: undefined
      })
    }
  }
  return (
    <Modal
      visible={visible}
      centered
      onCancel={() => {
        setVisible(false)
        form.resetFields()
        setPlayer1()
        setPlayer2()
      }}
      onOk={() => form.submit()}
      title={`สมัครแข่งขัน`}
      destroyOnClose
      confirmLoading={loading}
    >
      <Form
        name='createPlayer'
        form={form}
        onFinish={onFinish}
        style={{ maxWidth: '350px', margin: 'auto', height: '500px', overflow: 'scroll' }}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        scrollToFirstError
        initialValues={{ lineID: user.lineID, tel: user.tel }}
        onValuesChange={onFormValuesChange}
      >
        <Form.Item
          label='ประเภท'
          name='eventID'
          rules={[
            { required: true, message: 'กรุณาระบุรายการที่ต้องการลงแข่ง' },
          ]}
        >
          <Select
            placeholder='กรุณาเลือก'
            allowClear
          >
            {
              tournament?.events?.map(event =>
                <Select.Option
                  key={event._id}
                  value={event._id}
                >
                  {event.name}
                </Select.Option>)
            }
          </Select>
        </Form.Item>
        <Divider plain>ผู้เล่นคนที่ 1</Divider>
        <Form.Item
          name='isMe'
          valuePropName='checked'
        >
          <Checkbox>ฉัน</Checkbox>
        </Form.Item>
        <Form.Item
          label='ชื่อ-นามสกุล'
          name='player1Name'
          rules={[
            { required: true, message: 'กรุณาระบุชื่อ-นามสกุล' },
          ]}
        >
          <AutoComplete
            options={options}
            onSelect={(data, options) => onSelect(data, options, 'player1')}
            onSearch={onSearch}
            onChange={() => onChange('player1')}
          />
        </Form.Item>

        <Form.Item
          label='ชื่อเล่น'
          name='player1DisplayName'
        >
          <Input disabled={player1 && player1 !== user.playerID} />
        </Form.Item>
        <Form.Item
          label='ทีม'
          name='player1Club'
          rules={[
            { required: player1 && player1 === user.playerID, message: 'กรุณาระบุชื่อทีม' },
          ]}
        >
          <Input disabled={player1 && player1 !== user.playerID} />
        </Form.Item>
        <Form.Item
          label='เพศ'
          name='player1Gender'
        // rules={[
        //   { required: true, message: 'กรุณาระบุเพศ' },
        // ]}
        >
          <Select
            placeholder='กรุณาเลือก'
            allowClear
            disabled={player1 && player1 !== user.playerID}
          >
            <Select.Option value='male'>ชาย</Select.Option>
            <Select.Option value='female'>หญิง</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          label='วันเกิด'
          name='player1BirthDate'
        // rules={[
        //   { required: true, message: 'กรุณาระบุวันเกิด' },
        // ]}
        >
          <DatePicker disabled={player1 && player1 !== user.playerID} />
        </Form.Item>
        {type === 'double' && <div>
          <Divider plain>ผู้เล่นคนที่ 2</Divider>
          <Form.Item
            label='ชื่อ'
            name='player2Name'
            rules={[
              { required: true, message: 'กรุณาระบุชื่อ-นามสกุล' },
            ]}
          >
            <AutoComplete
              options={options}
              onSelect={(data, options) => onSelect(data, options, 'player2')}
              onSearch={onSearch}
              onChange={() => onChange('player2')}
            />
          </Form.Item>

          <Form.Item
            label='ชื่อเล่น'
            name='player2DisplayName'
          >
            <Input disabled={player2 && player2 !== user.playerID} />
          </Form.Item>

          <Form.Item
            label='ทีม'
            name='player2Club'
            rules={[
              { required: player1 && player1 === user.playerID, message: 'กรุณาระบุชื่อทีม' },
            ]}
          >
            <Input disabled={player2 && player2 !== user.playerID} />
          </Form.Item>
          <Form.Item
            label='เพศ'
            name='player2Gender'
          // rules={[
          //   { required: true, message: 'กรุณาระบุเพศ' },
          // ]}
          >
            <Select
              placeholder='กรุณาเลือก'
              allowClear
              disabled={player2 && player2 !== user.playerID}
            >
              <Select.Option value='male'>ชาย</Select.Option>
              <Select.Option value='female'>หญิง</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            label='วันเกิด'
            name='player2BirthDate'
          // rules={[
          //   { required: true, message: 'กรุณาระบุวันเกิด' },
          // ]}
          >
            <DatePicker disabled={player2 && player2 !== user.playerID} />
          </Form.Item>
        </div>}
        <Divider plain>หัวหน้าทีม/ผู้จัดการทีม</Divider>
        {/* <Form.Item
          label='ชื่อ'
          name='contactName'
          rules={[
            { required: true, message: 'กรุณาระบุชื่อ' },
          ]}
        >
          <AutoComplete
            options={options}
            onSelect={(data, options) => onSelect(data, options, 'contact')}
            onSearch={onSearch}
            onChange={() => onChange('contact')}
          />
        </Form.Item> */}
        <div style={{ textAlign: 'center' }}>{user.officialName}</div>
        <div style={{ textAlign: 'center', marginBottom: '10px' }}>{user.displayName}</div>
        <Form.Item
          label='เบอร์โทรศัพท์'
          name='tel'
          rules={[
            { required: true, message: 'กรุณาระบุเพื่อใช้ในการติดต่อ' },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label='Line ID'
          name='lineID'
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default RegisterModal