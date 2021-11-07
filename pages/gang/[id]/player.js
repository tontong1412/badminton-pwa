import axios from 'axios'
import generatePayload from 'promptpay-qr'
import { analytics, logEvent } from '../../../utils/firebase'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useState, useRef, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { mutate } from 'swr'
import { Modal, AutoComplete, Popconfirm, Tag, Button } from 'antd'
import { API_ENDPOINT } from '../../../config'
import Layout from '../../../components/Layout/gang'
import AddButton from '../../../components/addButton'
import { useGang, usePlayers } from '../../../utils'
import qrcode from 'qrcode'
import Loading from '../../../components/loading'
import { TAB_OPTIONS } from '../../../constant'
import { DeleteOutlined } from '@ant-design/icons'

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
    logEvent(analytics, `gang-${id}`)
    dispatch({ type: 'ACTIVE_MENU', payload: TAB_OPTIONS.GANG.PLAYERS })
  }, [])

  useEffect(() => {
    if (user && gang && (user.playerID === gang.creator?._id || gang.managers.map(elm => elm._id)?.includes(user.playerID))) {
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

  const modalFooter = () => {
    let footer = []
    if (isManager) {
      footer.push(
        <Popconfirm
          title="ยืนยัน"
          onConfirm={() => updateBillStatus(paymentData._id)}
          onCancel={() => { }}
          okText="Yes"
          cancelText="No"
        ><Button key="status-paid">จ่ายแล้ว</Button>
        </Popconfirm>
      )
    }
    footer.push(<Button key="ok" type="primary" onClick={onClosePaymentModal} >ปิด</Button>)
    return footer
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
    if (isManager) {
      logEvent(analytics, 'manager get bill')
    } else {
      logEvent(analytics, 'customer get bill')
    }
    setIsPaymentModalVisible(true)
    axios.get(`${API_ENDPOINT}/gang/bill`, {
      params: {
        playerID,
        gangID: id
      }
    }).then(res => {
      const paymentCode = res.data.payment?.code
      setPaymentData(res.data)
      if (paymentCode) {
        const payload = paymentCode.length > 20 ? paymentCode : generatePayload(paymentCode, { amount: res.data.total })
        qrcode.toString(payload, (err, svg) => {
          if (err) return console.log(err)
          setQrSVG(svg)
        })
      }
    })
      .catch(() => { })
  }

  const updateBillStatus = (transactionID) => {
    axios.put(`${API_ENDPOINT}/transaction/${transactionID}`, {
      status: 'paid'
    }).then((res) => {
      setPaymentData(res.data)
    }).catch(() => { })
  }

  const onRemovePlayer = (playerID) => {
    axios.post(`${API_ENDPOINT}/gang/remove-player`, {
      playerID,
      gangID: id
    }).then(() => {
      mutate(`${API_ENDPOINT}/gang/${id}`)
    }).catch(() => { })
  }

  const onClosePaymentModal = () => {
    setIsPaymentModalVisible(false)
    setQrSVG(null)
    setPaymentData()
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
      gang.players.length > 0 ? gang.players.map(player => {
        return (
          <div key={`player-${player._id}`} className='gang-player'>
            <div className='player-container'>
              <div className='avatar'>
                <Image objectFit='cover' src={player.photo || `/avatar.png`} alt='' width={50} height={50} layout='responsive' />
              </div>
              <div className='player-name'>{player.displayName || player.officialName}<span style={{ color: '#ccc', marginLeft: '10px' }}>{`${player.displayName ? (player.officialName || '') : ''}`}</span></div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {(isManager || user.playerID === player._id) && <div onClick={() => getBill(player._id)} >ดูบิล</div>}
              {isManager && <Popconfirm
                title="คุณแน่ใจที่จะลบผู้เล่นนี้หรือไม่"
                onConfirm={() => onRemovePlayer(player._id)}
                onCancel={() => { }}
                okText="Yes"
                cancelText="No"
                placement="topRight"
              ><div
                style={{ marginLeft: '20px', color: 'red' }}>
                  <DeleteOutlined />
                </div>
              </Popconfirm>}
            </div>

          </div>
        )
      })
        : <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}><div style={{ color: '#ccc' }}>เพิ่มผู้เล่นได้ที่ปุ่ม + ด้านล่าง</div></div>
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
      title="รายการ"
      visible={isPaymentModalVisible}
      onOk={onClosePaymentModal}
      onCancel={onClosePaymentModal}
      footer={modalFooter()}
      confirmLoading={confirmLoading}
      destroyOnClose>
      <div >
        {paymentData ?
          <div style={{ textAlign: 'center' }}>
            {qrSVG &&
              <>
                <div dangerouslySetInnerHTML={{ __html: qrSVG }} />
                <div style={{ fontWeight: 'bold', fontSize: '20px' }}>{paymentData?.payment?.name}</div>
                <div style={{ fontWeight: 'bold', fontSize: '20px' }}>{`${Math.ceil(paymentData?.total)} บาท`}</div>
              </>}
            <div style={{ display: 'flex' }}>
              <div style={{ fontWeight: 'bold' }}>{`${paymentData.payer.displayName || paymentData.payer.officialName}`}</div>
              <div style={{ marginLeft: '5px' }}><Tag color={paymentData.status === 'pending' ? 'red' : 'green'}>{paymentData.status === 'pending' ? 'ยังไม่จ่าย' : 'จ่ายแล้ว'}</Tag></div>
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