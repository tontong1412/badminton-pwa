import axios from 'axios'
import generatePayload from 'promptpay-qr'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useState, useRef } from 'react'
import { useSelector } from 'react-redux'
import { Modal, AutoComplete } from 'antd'
import { LogoutOutlined } from '@ant-design/icons'
import { API_ENDPOINT } from '../../../config'
import Layout from '../../../components/Layout/gang'
import AddButton from '../../../components/addButton'
import { useGang, usePlayers } from '../../../utils'
import qrcode from 'qrcode'

const GangID = () => {
  const router = useRouter()
  const { id } = router.query
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [value, setValue] = useState('')
  const [options, setOptions] = useState([])
  const { gang, isLoading, isError } = useGang(id)
  const { players } = usePlayers()
  const [qrSVG, setQrSVG] = useState()
  const [paymentData, setPaymentData] = useState()
  const playerEndRef = useRef(null)

  const scrollToBottom = () => {
    playerEndRef.current?.scrollIntoView({
      behavior: 'smooth',
    })
  }

  const showModal = () => {
    setIsModalVisible(true)
  }

  const handleOk = () => {
    setConfirmLoading(true)
    let player = players.find(player => player.displayName === value || player.displayName === value)
    if (!player) {
      player = {
        displayName: value
      }
    }
    axios.post(`${API_ENDPOINT}/gang/register`, {
      gangID: id,
      player
    }).then(() => {
      mutate(`${API_ENDPOINT}/gang/${id}`)
      scrollToBottom()
      setIsModalVisible(false)
      setConfirmLoading(false)
    })
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }

  const onSearch = (searchText) => {
    const searchTextLower = searchText.toLowerCase()
    const searchOptions = players.filter(player =>
      player.displayName?.toLowerCase().includes(searchTextLower)
      || player.officialName?.toLowerCase().includes(searchTextLower)
    ).map(player => {
      return {
        value: player.displayName || player.officialName
      }
    })
    setOptions(
      !searchText ? [] : searchOptions,
    )
  }

  const onSelect = (data) => {
    setValue(data)
  }

  const onChange = (data) => {
    setValue(data);
  }

  const getBill = async (playerID) => {
    setIsPaymentModalVisible(true)
    const res = await axios.get(`${API_ENDPOINT}/gang/bill`, {
      params: {
        playerID,
        gangID: id
      }
    })
    const mobileNumber = res.data.paymentCode || '092-901-0011'
    const payload = generatePayload(mobileNumber, { amount: res.data.total })
    setPaymentData(res.data)
    qrcode.toString(payload, options, (err, svg) => {
      if (err) return console.log(err)
      setQrSVG(svg)
    })

  }

  if (isError) return "An error has occurred."
  if (isLoading) return "Loading..."
  return <>
    <div style={{ fontSize: '20px' }}>{gang.name} </div>
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <div>ผู้เล่นทั้งหมด: {gang.players.length} คน</div>
      <div>เพิ่มผู้เล่น</div>
    </div>
    {
      gang.players.map(player => {
        return (
          <div key={player._id} className='gang-player'>
            <div className='player-container'>
              <div className='avatar'>
                <Image src={player.avatar || `/avatar${Math.floor(Math.random() * (6 - 1) + 1)}.png`} alt='' width={50} height={50} />
              </div>
              <div className='player-name'>{player.displayName}</div>
            </div>
            <div onClick={() => getBill(player._id)}><LogoutOutlined style={{ fontSize: '30px' }} /></div>
          </div>
        )
      })
    }
    <AddButton onClick={showModal} />
    <Modal
      title="เพิ่มผู้เล่น"
      visible={isModalVisible}
      onOk={handleOk}
      onCancel={handleCancel}
      confirmLoading={confirmLoading}
      destroyOnClose>
      <AutoComplete
        options={options}
        style={{
          width: 200,
        }}
        onSelect={onSelect}
        onSearch={onSearch}
        onChange={onChange}
        placeholder="ชื่อผู้เล่น"
      />
    </Modal>
    <Modal
      title=""
      visible={isPaymentModalVisible}
      onOk={() => setIsPaymentModalVisible(false)}
      onCancel={() => setIsPaymentModalVisible(false)}
      confirmLoading={confirmLoading}
      destroyOnClose>
      <div style={{ height: '450px' }}>
        {qrSVG ?
          <div style={{ textAlign: 'center' }}>
            <div dangerouslySetInnerHTML={{ __html: qrSVG }} />
            <div style={{ fontWeight: 'bold', fontSize: '20px' }}>{paymentData?.reciever.officialName}</div>
            <div style={{ fontWeight: 'bold', fontSize: '20px' }}>{`${paymentData?.total} บาท`}</div>
            <div>{`ค่าสนาม: ${paymentData?.courtFee}`}</div>
            <div>{`จำนวนลูกที่ใช้: ${paymentData?.shuttlecockUsed}`}</div>
          </div>
          :
          <div>Loading...</div>
        }
      </div>
    </Modal>
    <div style={{ height: '80px' }} ref={playerEndRef} />
  </>
}

GangID.getLayout = (page) => {
  return (
    <Layout>
      {page}
    </Layout>
  )
}

export default GangID