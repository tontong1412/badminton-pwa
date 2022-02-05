import { useDispatch, useSelector } from "react-redux"
import { Form, Input, Button, Modal, Select, DatePicker } from 'antd'
import Layout from '../components/Layout/noFooter'
import { useRouter } from "next/router"
import { useState } from "react"
import request from "../utils/request"
import ServiceErrorModal from "../components/ServiceErrorModal"
import CreatePlayerForm from "../components/Form/createPlayer"


const ClaimPlayer = () => {
  const { user } = useSelector(state => state)
  const [loading, setLoading] = useState(false)
  const [playerExistModal, setPlayerExistModal] = useState(false)
  const [playerExistData, setPlayerExistData] = useState()
  const router = useRouter()
  const dispatch = useDispatch()
  const onFinish = async (values) => {
    try {
      setLoading(true)
      // สร้าง player
      const { data: player } = await request.post(`/player`, values, user.token)
        .then(res => res)
        .catch(error => {
          if (error.response.status === 409) { // this player is already created
            if (error.response.data.userID) { // check if player is owned by other account
              throw new Error('player already claim')
              // TODO: error player นี้มีคน claim ไปแล้ว หากเป็นตัวจริงกรุณาติดต่อทางเว็บไซต์เพื่อยืนยันตัวตน
            } else {
              // TODO: แสดงข้อมูล player + activity ล่าสุด พร้อมปุ่ม claim or decline
              setPlayerExistData({
                profile: error.response.data,
                events: []
              })
              throw new Error('found player')
            }
          }
        })
      // ผูก player ที่สร้างเข้ากับ account
      await request.post('/player/claim', { playerID: player._id }, user.token)
      // ขอ token ใหม่ที่มีข้อมูล player
      const { data: userWithClaimPlayer } = await request.get('/user/current', { token: user.token })
      // redirect ไปที่หน้า account
      router.push('/account')
      // เก็บข้อมูล user ใน redux
      dispatch({
        type: 'LOGIN',
        payload: {
          ...user,
          token: userWithClaimPlayer.user.token,
          playerID: player._id,
          officialName: player.officialName,
          displayName: player.displayName,
          club: player.club
        }
      })
      setLoading(false)
    } catch (err) {
      setLoading(false)
      if (err.message === 'player already claim') {
        Modal.error({
          title: 'ชื่อนี้มีคนใช้แล้ว',
          content: (
            <div>
              <p>โปรดตรวจสอบว่าเป็นชื่อและนามสกุลจริงของคุณ</p>
              <p>หากพบมีคนแอบอ้างว่าเป็นคุณ สามารถส่งหลักฐานยืนยันตัวตนพร้อมช่องทางการติดต่อมาได้ที่อีเมล tontongfordev@gmail.com</p>
            </div>
          ),
          onOk() { },
        })
      } else if (err.message === 'found player') {
        setPlayerExistModal(true)
      } else {
        ServiceErrorModal()
      }
    }
  }
  return (
    <>
      <div style={{ margin: '10px' }}>
        <CreatePlayerForm onFinish={onFinish} loading={loading} />
      </div>
      <Modal
        title="พบผู้เล่นที่อาจเป็นคุณ"
        visible={playerExistModal}
        onOk={async () => {
          await request.post('/player/claim', { playerID: playerExistData.profile._id }, user.token)
          // ขอ token ใหม่ที่มีข้อมูล player
          const { data: userWithClaimPlayer } = await request.get('/user/current', { token: user.token })
          // redirect ไปที่หน้า account
          router.push('/account')
          // เก็บข้อมูล user ใน redux
          dispatch({
            type: 'LOGIN',
            payload: {
              ...user,
              token: userWithClaimPlayer.user.token,
              playerID: playerExistData.profile._id,
              officialName: playerExistData.profile.officialName,
              displayName: playerExistData.profile.displayName,
              club: playerExistData.profile.club
            }
          })
          setPlayerExistModal(false)
        }}
        onCancel={() => {
          setPlayerExistModal(false)
          Modal.error({
            title: 'ชื่อนี้มีคนใช้แล้ว',
            content: (
              <div>
                <p>โปรดตรวจสอบว่าเป็นชื่อและนามสกุลจริงของคุณ</p>
                <p>หากพบมีคนแอบอ้างว่าเป็นคุณ สามารถส่งหลักฐานยืนยันตัวตนพร้อมช่องทางการติดต่อมาได้ที่อีเมล tontongfordev@gmail.com</p>
              </div>
            ),
            onOk() { },
          })
        }}
        okText='นี่คือฉัน'
        cancelText='ไม่ใช่ฉัน'
      >
        <div>{playerExistData?.profile.officialName}</div>
      </Modal>
    </>
  )
}
ClaimPlayer.getLayout = (page) => {
  return (
    <Layout>
      {page}
    </Layout>
  )
}
export default ClaimPlayer