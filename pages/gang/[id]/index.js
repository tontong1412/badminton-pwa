import axios from 'axios'
import generatePayload from 'promptpay-qr'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useState, useRef, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { mutate } from 'swr'
import { Modal, AutoComplete } from 'antd'
import { LogoutOutlined } from '@ant-design/icons'
import { API_ENDPOINT } from '../../../config'
import Layout from '../../../components/Layout/gang'
import AddButton from '../../../components/addButton'
import { useGang, usePlayers } from '../../../utils'
import qrcode from 'qrcode'
import Loading from '../../../components/loading'
import { TAB_OPTIONS } from '../../../constant'

const GangID = () => {
  const router = useRouter()
  const { id } = router.query
  const { user } = useSelector(state => state)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [value, setValue] = useState('')
  const [playerID, setPlayerID] = useState()
  const [options, setOptions] = useState([])
  const { gang, isLoading, isError } = useGang(id)
  const { players } = usePlayers()
  const [qrSVG, setQrSVG] = useState()
  const [paymentData, setPaymentData] = useState()
  const playerEndRef = useRef(null)
  const [isManager, setIsManager] = useState(false)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch({ type: 'ACTIVE_MENU', payload: TAB_OPTIONS.GANG.PLAYERS })
  }, [])

  useEffect(() => {
    if (user && gang && (user.playerID === gang.creator._id || gang.managers.includes(user.playerID))) {
      setIsManager(true)
    } else {
      setIsManager(false)
    }
  }, [user, gang])

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
    let player
    if (playerID) {
      player = { _id: playerID }
    } else {
      player = { displayName: value }
    }
    axios.post(`${API_ENDPOINT}/gang/register`, {
      gangID: id,
      player
    }).then(() => {
      mutate(`${API_ENDPOINT}/gang/${id}`)
      scrollToBottom()
      setIsModalVisible(false)
      setConfirmLoading(false)
    }).catch(err => {
      setIsModalVisible(false)
      setConfirmLoading(false)
      Modal.error({
        title: 'ผิดพลาด',
        content: (
          <div>
            <p>เกิดปัญหาขณะอัพเดทข้อมูล กรุณาลองใหม่ในภายหลัง</p>
          </div>
        ),
        onOk() { },
      })
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
        key: player._id,
        value: player.displayName || player.officialName,
      }
    })
    setOptions(
      !searchText ? [] : searchOptions,
    )
  }

  const onSelect = (data, options) => {
    setValue(data)
    setPlayerID(options.key)
  }

  const onChange = (data) => {
    setValue(data)
    setPlayerID()
  }

  const getBill = async (playerID) => {
    setIsPaymentModalVisible(true)
    const res = await axios.get(`${API_ENDPOINT}/gang/bill`, {
      params: {
        playerID,
        gangID: id
      }
    })
    const mobileNumber = res.data.payment?.code || '092-901-0011'
    const payload = generatePayload(mobileNumber, { amount: res.data.total })
    setPaymentData(res.data)
    qrcode.toString(payload, (err, svg) => {
      if (err) return console.log(err)
      setQrSVG(svg)
    })

  }

  if (isError) return "An error has occurred."
  if (isLoading) return <Loading />
  return <>
    <div style={{ fontSize: '20px' }}>{gang.name} </div>
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <div></div>
      <div>ผู้เล่นทั้งหมด: {gang.players.length} คน</div>
    </div>
    {
      gang.players.map(player => {
        return (
          <div key={`player-${player._id}`} className='gang-player'>
            <div className='player-container'>
              <div className='avatar'>
                <Image src={player.avatar || `/avatar.png`} alt='' width={50} height={50} />
              </div>
              <div className='player-name'>{player.displayName || player.officialName}</div>
            </div>
            {(isManager || user.playerID === player._id) && <div onClick={() => getBill(player._id)}>จ่ายเงิน</div>}
          </div>
        )
      })
    }
    {isManager && <AddButton onClick={showModal} />}
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
      onCancel={() => {
        setIsPaymentModalVisible(false)
        setQrSVG(null)
      }}
      confirmLoading={confirmLoading}
      destroyOnClose>
      <div style={{ minHeight: '450px' }}>
        {qrSVG ?
          <div style={{ textAlign: 'center' }}>
            <div dangerouslySetInnerHTML={{ __html: qrSVG }} />
            <div style={{ fontWeight: 'bold', fontSize: '20px' }}>{paymentData?.payment?.name}</div>
            <div style={{ fontWeight: 'bold', fontSize: '20px' }}>{`${Math.ceil(paymentData?.total)} บาท`}</div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div style={{ fontWeight: 'bold' }}>{`${paymentData.payer.displayName || paymentData.payer.officialName}`}</div>
              <div></div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>ค่าสนาม</div>
              <div>{`${Math.ceil(paymentData?.courtFee)} บาท`}</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>{`ค่าลูกแบด (${paymentData?.shuttlecockUsed} ลูก)`}</div>
              <div>{`${paymentData?.total - paymentData?.courtFee} บาท`}</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>{`รวม`}</div>
              <div>{`${paymentData?.total} บาท`}</div>
            </div>
          </div>
          :
          <Loading />
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