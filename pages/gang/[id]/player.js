import axios from 'axios'
import generatePayload from 'promptpay-qr'
import { analytics, logEvent } from '../../../utils/firebase'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useState, useRef, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Modal, AutoComplete, Popconfirm, Tag, Button, Collapse, Form, Input, Space, InputNumber, Upload, message } from 'antd'
import { API_ENDPOINT } from '../../../config'
import Layout from '../../../components/Layout/gang'
import AddButton from '../../../components/addButton'
import { useBills, useGang, usePlayers } from '../../../utils'
import qrcode from 'qrcode'
import Loading from '../../../components/loading'
import { TAB_OPTIONS, TRANSACTION } from '../../../constant'
import { DeleteOutlined, RightOutlined, DownOutlined, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'
import { getBase64, beforeUpload } from '../../../utils/image'

const GangID = () => {
  const router = useRouter()
  const [form] = Form.useForm()
  const { id } = router.query
  const { user } = useSelector(state => state)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [value, setValue] = useState('')
  const [playerID, setPlayerID] = useState()
  const [options, setOptions] = useState([])
  const { gang, isLoading, isError, mutate } = useGang(id)
  const { players } = usePlayers()
  const [qrSVG, setQrSVG] = useState()
  const [paymentData, setPaymentData] = useState()
  const playerEndRef = useRef(null)
  const [isManager, setIsManager] = useState(false)
  const dispatch = useDispatch()
  const [playerArray, setPlayerArray] = useState(gang?.players)
  const { bills, mutate: mutateBills } = useBills(id)
  const [collapseActive, setCollapseActive] = useState(false)
  const [otherFieldLength, setOtherFieldLength] = useState(0)
  const [loadingImage, setLoadingImage] = useState(false)

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

  useEffect(() => {
    if (gang && bills) formatPlayerWithPayment()
  }, [gang, bills])

  const formatPlayerWithPayment = () => {
    const tempPlayers = gang?.players?.map(player => {
      const billIndex = bills?.findIndex((bill => bill.payer._id === player._id))
      return {
        ...player,
        payment: bills[billIndex]
      }
    })
    setPlayerArray(tempPlayers)
  }

  const scrollToBottom = () => {
    playerEndRef.current?.scrollIntoView({
      behavior: 'smooth',
    })
  }

  const showModal = () => {
    setIsModalVisible(true)
  }

  const handleOk = () => {
    if (!value) {
      Modal.error({
        title: 'ผิดพลาด',
        content: (
          <div>
            <p>กรุณากรอกชื่อ</p>
          </div>
        ),
        onOk() { },
      })
      return
    }
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
      mutate()
      scrollToBottom()
      setIsModalVisible(false)
      setConfirmLoading(false)
      setValue('')
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
    setValue('')
  }

  const onSearch = (searchText) => {
    const searchTextLower = searchText.toLowerCase()
    const searchOptions = players.filter(player =>
      player.displayName?.toLowerCase().includes(searchTextLower)
      || player.officialName?.toLowerCase().includes(searchTextLower)
    ).map(player => {
      return {
        key: player._id,
        value: player._id,
        label: (
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>{player.displayName || player.officialName}</div>
            <div style={{ color: '#aaa' }}>{player.displayName && player.officialName}</div>
          </div>
        )
      }
    })
    setOptions(
      !searchText ? [] : searchOptions,
    )
  }

  const modalFooter = () => {
    let footer = []
    footer.push(<Upload
      action={`${API_ENDPOINT}/mock`}
      name='file'
      onChange={onChangeImage}
      maxCount={1}
      beforeUpload={beforeUpload}
      showUploadList={false}

    >
      <Button style={{ marginRight: '8px' }} loading={loadingImage}>อัพโหลด slip</Button>
    </Upload>)
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
    setValue(options.label.props.children[0].props.children)
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
      mutateBills()
    }).catch(() => { })
  }

  const onRemovePlayer = (playerID) => {
    axios.post(`${API_ENDPOINT}/gang/remove-player`, {
      playerID,
      gangID: id
    }).then(() => {
      mutate()
    }).catch(() => { })
  }

  const onClosePaymentModal = () => {
    setIsPaymentModalVisible(false)
    setQrSVG(null)
    setPaymentData()
    setCollapseActive(false)
    form.resetFields()
    setOtherFieldLength(0)
  }

  const onAddOther = (values, transactionID, playerID) => {
    axios.put(`${API_ENDPOINT}/transaction/${transactionID}/add-other`, values.others)
      .then(res => {
        setPaymentData(res.data)
        form.resetFields()
        setOtherFieldLength(0)
        getBill(playerID)
      })
      .catch(err => console.log(err))
  }

  const removeOther = (other, transactionID, playerID) => {
    axios.put(`${API_ENDPOINT}/transaction/${transactionID}/remove-other`, { other })
      .then(res => {
        setPaymentData(res.data)
        getBill(playerID)
      })
      .catch(err => console.log(err))
  }

  const onChangeImage = (info) => {
    if (info.file.status === 'done') {
      getBase64(info.file.originFileObj, image => {
        setLoadingImage(true)
        axios.put(`${API_ENDPOINT}/transaction/${paymentData._id}`, {
          slip: image,
          status: isManager ? 'paid' : 'pending'
        }).then(() => {
          setLoadingImage(false)
          getBill(paymentData.payer._id)
          mutateBills()
        }).catch(() => { })
      })
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
      message.error(JSON.stringify(info, null, 1));
    }
  }

  if (isError) return "An error has occurred."
  if (isLoading) return <Loading />
  return <>
    <div style={{ fontSize: '20px' }}>{gang.name} </div>
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <div></div>
      <div>ผู้เล่นทั้งหมด: {playerArray?.length || '0'} คน</div>
    </div>
    {
      playerArray?.length > 0 ? playerArray.map(player => {
        return (
          <div key={`player-${player._id}`} className='gang-player'>
            <div className='player-container'>
              <div className='avatar'>
                <Image objectFit='cover' src={player.photo || `/avatar.png`} alt='' width={50} height={50} layout='responsive' />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div className='player-name'>{player.displayName || player.officialName}</div>
                <div style={{ color: '#ccc', marginLeft: '10px' }}>{`${player.displayName ? (player.officialName || '') : ''}`}</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {(isManager || user.playerID === player._id) &&
                <div >
                  <Tag
                    color={TRANSACTION[player?.payment?.status || 'notpaid'].COLOR}
                  >
                    {TRANSACTION[player?.payment?.status || 'notpaid'].LABEL}
                  </Tag>
                </div>}
              {(isManager || user.playerID === player._id) && <div onClick={() => getBill(player._id)} >ดูบิล</div>}
              {isManager && <Popconfirm
                title="คุณแน่ใจที่จะลบผู้เล่นนี้หรือไม่"
                onConfirm={() => onRemovePlayer(player._id)}
                onCancel={() => { }}
                okText="Yes"
                cancelText="No"
                placement="topRight"
              ><div
                style={{ marginLeft: '5px', color: 'red' }}>
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
        value={value}
        allowClear
      />
    </Modal>
    <Modal
      className='payment-modal'
      title="รายการ"
      visible={isPaymentModalVisible}
      onOk={onClosePaymentModal}
      onCancel={onClosePaymentModal}
      footer={modalFooter()}
      confirmLoading={confirmLoading}
      destroyOnClose
      style={{ height: 'calc(100vh - 200px)' }}
      bodyStyle={{ overflowY: 'scroll' }}
    >
      {/* <div style={{ height: '400px', overflow: 'scroll' }}> */}
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
              <div style={{ marginLeft: '5px' }}><Tag color={TRANSACTION[paymentData.status || 'notpaid'].COLOR}>{TRANSACTION[paymentData.status || 'notpaid'].LABEL}</Tag></div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>ค่าสนาม</div>
              <div>{`${Math.ceil(paymentData?.courtFee)} บาท`}</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Collapse ghost expandIconPosition='left' accordion onChange={(value) => setCollapseActive(value)} style={{ width: '80%' }}>
                <Collapse.Panel header={<div>{`ค่าลูกแบด (${paymentData?.shuttlecockUsed} ลูก)`} <span >{collapseActive ? <DownOutlined /> : <RightOutlined />}</span></div>} key="1" showArrow={false}>
                  {
                    paymentData.matches.map((match, index) => {
                      return (
                        <div key={`match-${index + 1}`} >
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginLeft: '15px' }}>
                            <div>{`เกมที่ ${index + 1}`}</div>
                            <div>{`${match.shuttlecockUsed} ลูก`}</div>
                          </div>
                          <div style={{ marginLeft: '30px' }}>
                            {match?.teamA?.team?.players.map((player, index) => (
                              <div key={`teama-${index + 1}`} style={{ marginRight: '10px' }}>{player.displayName || player.officialName}</div>
                            ))}
                            {match?.teamB?.team?.players.map((player, index) => (
                              <div key={`teamb-${index + 1}`} style={{ marginRight: '10px' }}>{player.displayName || player.officialName}</div>
                            ))}
                          </div>
                        </div>
                      )
                    })
                  }
                </Collapse.Panel>
              </Collapse>
              <div>{`${paymentData?.shuttlecockTotal} บาท`}</div>
            </div>
            {
              paymentData.other?.map((elm, index) => {
                return (
                  <div key={`other-${index + 1}`} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      {isManager && <DeleteOutlined
                        style={{ color: 'red', marginRight: '10px' }}
                        onClick={() => removeOther(elm, paymentData._id, paymentData.payer._id)}
                      />}
                      <div>{elm.name}</div>
                    </div>
                    <div>{`${elm.amount} บาท`}</div>
                  </div>
                )
              })
            }
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>{`รวม`}</div>
              <div>{`${paymentData?.total} บาท`}</div>
            </div>
            {isManager && <Form form={form} name="otherItem" onFinish={(values) => onAddOther(values, paymentData._id, paymentData.payer._id)} >
              <Form.List name="others">
                {(fields, { add, remove }) => {
                  return (
                    <>
                      {fields.map(({ key, name, fieldKey, ...restField }) => (
                        <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline" >
                          <Form.Item
                            {...restField}
                            name={[name, 'name']}
                            fieldKey={[fieldKey, 'name']}
                            rules={[{ required: true, message: '' }]}
                          >
                            <Input placeholder="รายการ" allowClear />
                          </Form.Item>
                          <Form.Item
                            {...restField}
                            name={[name, 'amount']}
                            fieldKey={[fieldKey, 'amount']}
                            rules={[{ required: true, message: '' }]}
                          >
                            <InputNumber placeholder="จำนวนเงิน" />
                          </Form.Item>
                          <MinusCircleOutlined onClick={() => {
                            remove(name)
                            setOtherFieldLength(otherFieldLength - 1)
                          }} />
                        </Space>
                      ))}
                      <Form.Item>
                        <Button type="dashed" onClick={() => {
                          add()
                          setOtherFieldLength(otherFieldLength + 1)
                        }} block icon={<PlusOutlined />}>
                          เพิ่มรายการ
                        </Button>
                      </Form.Item>
                    </>
                  )
                }}
              </Form.List>
              {otherFieldLength > 0 && <Form.Item>
                <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                  เพิ่ม
                </Button>
              </Form.Item>}
            </Form>}
            {paymentData?.slip && <Image objectFit='contain' src={paymentData.slip} alt='' width={50} height={50} layout='responsive' />}
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