import { DatePicker, Form, Input, Modal, Select, Divider, AutoComplete, message, Checkbox, Collapse, Upload } from 'antd'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { useTournament, usePlayers, usePlayer } from '../../utils'
import request from '../../utils/request'
import moment from 'moment'
import { useSelector } from 'react-redux'
import Highlighter from "react-highlight-words";
import RulesRR from './Rules.js/Roundrobin'
import { COLOR, MAP_FORMAT_RULE } from '../../constant'
import { DownOutlined, RightOutlined, PlusOutlined } from '@ant-design/icons'
import { useRouter } from 'next/router';
import { API_ENDPOINT } from '../../config'
import { getBase64, beforeUpload } from '../../utils/image'
const RegisterModal = ({ visible, setVisible, tournamentID }) => {
  const [form] = Form.useForm()
  const router = useRouter()
  const [player1, setPlayer1] = useState()
  const [player1Data, setPlayer1Data] = useState()
  const [player2, setPlayer2] = useState()
  const [player2Data, setPlayer2Data] = useState()
  const { tournament, mutate } = useTournament(tournamentID)
  const [contactPerson, setContactPerson] = useState()
  const [loading, setLoading] = useState(false)
  const [options, setOptions] = useState([])
  const { players, mutate: mutatePlayer } = usePlayers()
  const { user } = useSelector(state => state)
  const [type, setType] = useState('single')
  const { player: me } = usePlayer(user.playerID)
  const [collapseActive, setCollapseActive] = useState(false)
  const [disableRegister, setDisableRegister] = useState(true)



  const onFinish = async (values) => {
    const register = (composePlayer) =>
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
        setPlayer1Data()
        setPlayer2()
        setPlayer2Data()
        router.push('/')
        message.success('ลงทะเบียนแล้ว ท่านสามารถตรวจสอบผลการประเมินมือและการชำระเงินได้ในหน้านี้')
      })
        .catch(err => {
          setVisible(false)
          setLoading(false)
          mutate()
          form.resetFields()
          setPlayer1()
          setPlayer1Data()
          setPlayer2()
          setPlayer2Data()
          if (err?.response?.status === 409) {
            Modal.info({ title: 'คู่นี้ลงสมัครแล้ว', content: 'ท่านสามารถตรวจสอบผลการประเมินมือได้ที่แท็บรายชื่อ' })
          } else {
            Modal.error({ title: 'ไม่สำเร็จ กรุณาลองใหม่อีกครั้ง' })
          }

        })
    if (player1 && player2 && player1 === player2) {
      setPlayer1()
      setPlayer1Data()
      setPlayer2()
      setPlayer2Data()
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
      })
    }
    if (values.player1Photo) {
      getBase64(values.player1Photo.file.originFileObj, img => {
        composePlayer[0].photo = img
        if (values.player2Photo) {
          getBase64(values.player2Photo.file.originFileObj, img2 => {
            composePlayer[1].photo = img2
            register(composePlayer)
          })
        } else {
          register(composePlayer)
        }
      })
    } else {
      if (values.player2Photo) {
        getBase64(values.player2Photo.file.originFileObj, img2 => {
          composePlayer[1].photo = img2
          register(composePlayer)
        })
      } else {
        register(composePlayer)
      }
    }
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
    const selectedPlayer = players.find(player => player._id === options.key)
    if (player === 'player1') {
      setPlayer1(options.key)
      setPlayer1Data(selectedPlayer)
    }
    else if (player === 'player2') {
      setPlayer2(options.key)
      setPlayer2Data(selectedPlayer)
    }

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
    if (player === 'player1') {
      setPlayer1()
      setPlayer1Data()
    }
    else if (player === 'player2') {
      setPlayer2()
      setPlayer2Data()
    }
    else if (player === 'contact') setContactPerson()
  }

  const onFormValuesChange = ({ eventID, isMe }) => {
    if (eventID) setType(tournament.events.find(elm => elm._id === eventID).type)
    if (isMe) {
      setPlayer1(user.playerID)
      setPlayer1Data(me)
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
      setPlayer1Data()
      form.setFieldsValue({
        player1Name: undefined,
        player1Gender: undefined,
        player1Club: undefined,
        player1DisplayName: undefined,
        player1BirthDate: undefined
      })
    }
    setDisableRegister(!form.getFieldValue('acceptRules'))
  }
  return (
    <Modal
      visible={visible}
      centered
      onCancel={() => {
        setVisible(false)
        form.resetFields()
        setPlayer1()
        setPlayer1Data()
        setPlayer2()
        setPlayer2Data()
      }}
      onOk={() => form.submit()}
      title={`สมัครแข่งขัน`}
      destroyOnClose
      confirmLoading={loading}
      okButtonProps={{ disabled: disableRegister }}
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
            placeholder='ไม่ต้องใส่คำนำหน้าชื่อ'
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
          <Input disabled={player1 && player1 !== user.playerID && player1Data.userID} />
        </Form.Item>
        <Form.Item
          label='ทีม'
          name='player1Club'
          rules={[
            { required: player1 && player1 === user.playerID, message: 'กรุณาระบุชื่อทีม' },
          ]}
        >
          {/* <Input disabled={player1 && player1 !== user.playerID && player1Data.userID} /> */}
          <Input />
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
            disabled={player1 && player1 !== user.playerID && player1Data.userID}
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
          <DatePicker disabled={player1 && player1 !== user.playerID && player1Data.userID} />
        </Form.Item>
        {player1Data?.photo ?
          <div style={{ width: '110px', height: '110px', border: '1px dashed #ccc', padding: '5px', overflow: 'hidden', borderRadius: '5px' }}>
            <Image unoptimized objectFit='contain' src={player1Data.photo?.replace('/upload/', '/upload/q_10/')} alt='' width={100} height={100} />
            {/* <Image unoptimized objectFit='contain' src={`/avatar.png` || player1Data.photo?.replace('/upload/', '/upload/q_10/')} alt='' width={100} height={100} /> */}
          </div>
          : <Form.Item
            name='player1Photo'
            label="รูปภาพ" valuePropName="player1Photo"
            rules={[
              { required: true, message: 'กรุณาอัพโหลดรูปภาพ' },
            ]}
          >
            <Upload action={`${API_ENDPOINT}/mock`} listType="picture-card" maxCount={1} beforeUpload={beforeUpload}>
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            </Upload>
          </Form.Item>}
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
              placeholder='ไม่ต้องใส่คำนำหน้าชื่อ'
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
            <Input disabled={player2 && player2 !== user.playerID && player2Data.userID} />
          </Form.Item>

          <Form.Item
            label='ทีม'
            name='player2Club'
            rules={[
              { required: player2 && player2 === user.playerID, message: 'กรุณาระบุชื่อทีม' },
            ]}
          >
            <Input />
            {/* <Input disabled={player2 && player2 !== user.playerID && player2Data.userID} /> */}
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
              disabled={player2 && player2 !== user.playerID && player2Data.userID}
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
            <DatePicker disabled={player2 && player2 !== user.playerID && player2Data.userID} />
          </Form.Item>
          {player2Data?.photo ?
            <div style={{ width: '110px', height: '110px', border: '1px dashed #ccc', padding: '5px', overflow: 'hidden', borderRadius: '5px' }}>
              <Image unoptimized objectFit='contain' src={player2Data.photo?.replace('/upload/', '/upload/q_10/')} alt='' width={100} height={100} />
              {/* <Image unoptimized objectFit='contain' src={`/avatar.png` || player2Data.photo?.replace('/upload/', '/upload/q_10/')} alt='' width={100} height={100} /> */}
            </div>
            : <Form.Item
              name='player2Photo'
              label="รูปภาพ"
              valuePropName="player2Photo"
              rules={[
                { required: true, message: 'กรุณาอัพโหลดรูปภาพ' },
              ]}
            >
              <Upload action={`${API_ENDPOINT}/mock`} listType="picture-card" maxCount={1} beforeUpload={beforeUpload}>
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              </Upload>
            </Form.Item>}
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
        <Collapse ghost expandIconPosition='left' accordion onChange={(value) => setCollapseActive(value)} style={{ width: '80%' }}>
          <Collapse.Panel header={<div><span style={{ textDecoration: 'underline', marginRight: '5px' }}>กติกาการแข่งขัน</span><span>{collapseActive ? <DownOutlined /> : <RightOutlined />}</span></div>} key="1" showArrow={false}>
            <RulesRR />
          </Collapse.Panel>
        </Collapse>

        <Form.Item
          name='acceptRules'
          valuePropName='checked'
          rules={[
            { required: true, message: 'กรุณายอมรับกติการการแข่งขัน' },
          ]}
        >
          <Checkbox>ฉันยอมรับกติกาการแข่งขัน</Checkbox>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default RegisterModal