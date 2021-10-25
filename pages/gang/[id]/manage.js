import axios from 'axios'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Modal, Button } from 'antd'
import { API_ENDPOINT } from '../../../config'
import Layout from '../../../components/Layout/gang'
import { useGang } from '../../../utils'
import qrcode from 'qrcode'
import { WEB_URL } from '../../../config'
import Loading from '../../../components/loading'
import { TAB_OPTIONS } from '../../../constant'
import { ExclamationCircleOutlined } from '@ant-design/icons'

const GangID = () => {
  const router = useRouter()
  const { id } = router.query
  const { gang, isLoading, isError } = useGang(id)
  const [qrSVG, setQrSVG] = useState()
  const dispatch = useDispatch()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [stat, setStat] = useState()

  useEffect(() => {
    dispatch({ type: 'ACTIVE_MENU', payload: TAB_OPTIONS.GANG.SETTING })
    const payload = `${WEB_URL}/gang/${id}/register`
    qrcode.toString(payload, (err, svg) => {
      if (err) return console.log(err)
      setQrSVG(svg)
    })
  }, [])

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
      onCancel() {
        console.log('Cancel');
      },
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


  if (isError) return "An error has occurred."
  if (isLoading) return <Loading />

  return (
    <div>
      {qrSVG ?
        <div style={{ textAlign: 'center', maxWidth: '350px', margin: 'auto' }}>
          <div dangerouslySetInnerHTML={{ __html: qrSVG }} />
          <div style={{ fontWeight: 'bold', fontSize: '20px' }}>{gang.name}</div>
          <div><Button onClick={getStat} style={{ width: '200px', marginBottom: '10px' }}>สถิติ</Button></div>
          <div><Button onClick={clear} type='primary' style={{ width: '200px', marginBottom: '50px' }}>Reset</Button></div>
          <div><Button onClick={removeGang} type='danger' style={{ width: '200px', marginBottom: '10px' }}>ลบก๊วน</Button></div>
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