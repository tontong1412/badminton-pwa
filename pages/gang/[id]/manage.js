import axios from 'axios'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Modal, Button, AutoComplete } from 'antd'
import { API_ENDPOINT } from '../../../config'
import Layout from '../../../components/Layout/gang'
import { useGang } from '../../../utils'
import qrcode from 'qrcode'
import { WEB_URL } from '../../../config'
import Loading from '../../../components/loading'
import { TAB_OPTIONS } from '../../../constant'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { usePlayers } from '../../../utils'

const GangID = () => {
  const router = useRouter()
  const user = useSelector(state => state.user)
  const { id } = router.query
  const { gang, isLoading, isError } = useGang(id)
  const [qrSVG, setQrSVG] = useState()
  const dispatch = useDispatch()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [addManagerVisible, setAddManagerVisible] = useState(false)
  const [options, setOptions] = useState([])
  const [stat, setStat] = useState()
  const [playerID, setPlayerID] = useState()
  const { players } = usePlayers()
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [isCreator, setIsCreator] = useState(false)

  useEffect(() => {
    dispatch({ type: 'ACTIVE_MENU', payload: TAB_OPTIONS.GANG.SETTING })
    const payload = `${WEB_URL}/gang/${id}/register`
    qrcode.toString(payload, (err, svg) => {
      if (err) return console.log(err)
      setQrSVG(svg)
    })
  }, [])

  useEffect(() => {
    if (user && gang && user.playerID === gang.creator._id) {
      setIsCreator(true)
    } else {
      setIsCreator(false)
    }
  }, [gang, user])

  const getStat = () => {
    axios.get(`${API_ENDPOINT}/gang/stat/${id}`)
      .then(res => {
        setStat(res.data)
        setIsModalVisible(true)
      })
      .catch(() => { })
  }
  const clear = () => {
    Modal.confirm({
      title: 'คุณแน่ใจที่จะ reset ก๊วนหรือไม่',
      icon: <ExclamationCircleOutlined />,
      content: 'หาก reset ผู้เล่นและคิวทั้งหมดจะถูกลบ',
      onOk() {
        axios.post(`${API_ENDPOINT}/gang/close`, { gangID: id })
          .then(() => { })
          .catch(() => { })
      },
      onCancel() { },
    });
  }

  const removeGang = () => {
    Modal.confirm({
      title: 'คุณแน่ใจที่จะลบก๊วนนี้หรือไม่',
      icon: <ExclamationCircleOutlined />,
      content: 'หากลบแล้วจะไม่สามารถกู้คืนข้อมูลได้',
      onOk() {
        axios.delete(`${API_ENDPOINT}/gang/${id}`,)
          .then(() => { router.push('/gang') })
          .catch(() => { })
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }

  const addManager = () => {
    console.log(user)
    setConfirmLoading(true)
    axios.post(`${API_ENDPOINT}/gang/addManager`, {
      gangID: id,
      playerID,
    }, {
      headers: {
        'Authorization': `Token ${user.token}`
      }
    }).then(() => {
      setAddManagerVisible(false)
      setConfirmLoading(false)
    }).catch(err => {
      setAddManagerVisible(false)
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

  const onSearch = (searchText) => {
    const searchTextLower = searchText.toLowerCase()
    const searchOptions = players.filter(player =>
      player.userID &&
      (player.displayName?.toLowerCase().includes(searchTextLower)
        || player.officialName?.toLowerCase().includes(searchTextLower))
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
    setPlayerID(options.key)
  }

  const onChange = (data) => {
    setPlayerID()
  }


  if (isError) return "An error has occurred."
  if (isLoading) return <Loading />

  return (
    <div>
      {qrSVG ?
        <div style={{ textAlign: 'center', maxWidth: '350px', margin: 'auto' }}>
          <div dangerouslySetInnerHTML={{ __html: qrSVG }} />
          <div style={{ fontWeight: 'bold', fontSize: '20px' }}>{gang.name}</div>
          <div><Button onClick={getStat} style={{ width: '200px', marginBottom: '10px' }}>สถิติ</Button></div>
          <div><Button onClick={clear} type='primary' style={{ width: '200px', marginBottom: '10px' }}>Reset</Button></div>
          {isCreator && <div><Button onClick={() => router.push(`/gang/${id}/manager`)} type='primary' style={{ width: '200px', marginBottom: '50px' }}>ผู้จัดการ</Button></div>}
          {isCreator && <div><Button onClick={removeGang} type='danger' style={{ width: '200px', marginBottom: '10px' }}>ลบก๊วน</Button></div>}
        </div>
        :
        <Loading />
      }
      <Modal title="สถิติ" visible={isModalVisible} onOk={() => setIsModalVisible(false)} onCancel={() => setIsModalVisible(false)}>
        <p>ผู้เล่นทั้งหมด: {stat?.totalPlayer} คน</p>
        <p>ใช้ลูกแบดทั้งหมด: {stat?.totalShuttlecockUsed} ลูก</p>
        <p>จำนวนเกมทั้งหมด: {stat?.totalMatchPlayed} เกม</p>
        <p>รายรับทั้งหมด: {stat?.totalIncome} บาท</p>
      </Modal>

      <Modal
        title="เพิ่มผู้จัดการ"
        visible={addManagerVisible}
        onOk={addManager}
        onCancel={() => setAddManagerVisible(false)}
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
          placeholder="ชื่อผู้จัดการ"
        />
      </Modal>
    </div >
  )
}

GangID.getLayout = (page) => {
  return (
    <Layout>
      {page}
    </Layout>
  )
}

export default GangID