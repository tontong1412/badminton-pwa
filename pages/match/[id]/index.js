import Layout from '../../../components/Layout/noFooter'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useMatch, useSocket, useWindowSize } from '../../../utils'
import Loading from '../../../components/loading'
import { useDispatch, useSelector } from 'react-redux'
import { COLOR, TAB_OPTIONS } from '../../../constant'
import Image from 'next/image'
import request from '../../../utils/request'
import { Button, Divider, Form, Modal, Select } from 'antd'

const Match = () => {
  const router = useRouter()
  const [form] = Form.useForm()
  const { id } = router.query
  const { match, isLoading, isError, mutate } = useMatch(id)
  const dispatch = useDispatch()
  const { user } = useSelector(state => state)
  const socket = useSocket()
  const [isUmpire, setIsUmpire] = useState(false)
  const [side, setSide] = useState(true)
  const [undo, setUndo] = useState([])
  const [settingVisible, setSettingVisible] = useState(false)
  const [width, height] = useWindowSize()
  const [isSingle, setIsSingle] = useState(false)

  useEffect(() => {
    dispatch({ type: 'ACTIVE_MENU', payload: TAB_OPTIONS.TOURNAMENT_MANAGER.DETAIL })
  }, [])

  useEffect(() => {
    setIsSingle(match?.teamA.team.players.length === 1)
  }, [match])


  useEffect(() => {
    if (user && match && (user.playerID === match.umpire?._id)) {
      setIsUmpire(true)
    } else {
      setIsUmpire(false)
    }
  }, [user, match])

  useEffect(() => {
    const handleEvent = (payload) => {
      mutate()
    }
    if (socket) {
      socket.on('update-match', handleEvent)
    }
  }, [socket])

  const onSetServingReceiving = async (values) => {
    const { server, receiver } = values
    const [serverTeam, serverIndex] = server.split('-')
    const [receiverTeam, receiverIndex] = receiver.split('-')


    const payload = {
      [`team${serverTeam}.isServing`]: true,
      [`team${serverTeam}.serving`]: serverIndex,
      [`team${serverTeam}.receiving`]: serverIndex,
      [`team${receiverTeam}.receiving`]: receiverIndex,
      [`team${receiverTeam}.serving`]: receiverIndex,
      [`team${receiverTeam}.isServing`]: false,
    }
    await request.put(`/match/${id}`, payload)
    setSettingVisible(false)

  }

  const manageShuttlecock = (action) => {
    request.post('/match/manage-shuttlecock', {
      matchID: id,
      action,
    }).then(() => mutate())
      .catch(() => Modal.error({ title: 'ผิดพลาด' }))
  }


  const updateScore = (team) => {
    const keepForUndo = [
      ...undo,
      {
        'teamA.score': match.teamA.score,
        'teamA.serving': match.teamA.serving,
        'teamA.receiving': match.teamA.receiving,
        'teamA.isServing': match.teamA.isServing,
        'teamB.score': match.teamB.score,
        'teamB.serving': match.teamB.serving,
        'teamB.receiving': match.teamB.receiving,
        'teamB.isServing': match.teamB.isServing,
      }]
    setUndo(keepForUndo)
    let payload
    if (team === 'A') {
      const currentScore = match.teamA.score
      let teamBReceiver

      if (match.teamB.score % 2 === 0 && (currentScore + 1) % 2 === 0) {
        teamBReceiver = match.teamB.serving
      } else if (match.teamB.score % 2 === 1 && (currentScore + 1) % 2 === 1) {
        teamBReceiver = match.teamB.serving
      } else {
        teamBReceiver = Math.abs(match.teamB.serving - 1)
      }
      payload = {
        $inc: { 'teamA.score': 1 },
        'teamA.serving': isSingle ? 0 : (match.teamA.isServing ? match.teamA.serving : Math.abs(match.teamA.serving - 1)),
        'teamA.receiving': null,
        'teamB.receiving': isSingle ? 0 : teamBReceiver,
        'teamA.isServing': true,
        'teamB.isServing': false
      }
    } else {
      const currentScore = match.teamB.score
      let teamAReceiver
      if (match.teamA.score % 2 === 0 && (currentScore + 1) % 2 === 0) {
        teamAReceiver = match.teamA.serving
      } else if (match.teamA.score % 2 === 1 && (currentScore + 1) % 2 === 1) {
        teamAReceiver = match.teamA.serving
      } else {
        teamAReceiver = Math.abs(match.teamA.serving - 1)
      }
      payload = {
        $inc: { 'teamB.score': 1 },
        'teamB.serving': isSingle ? 0 : (match.teamB.isServing ? match.teamB.serving : Math.abs(match.teamB.serving - 1)),
        'teamB.receiving': null,
        'teamA.receiving': isSingle ? 0 : teamAReceiver,
        'teamB.isServing': true,
        'teamA.isServing': false
      }
    }
    request.put(`/match/${id}`, payload)
      .then(res => {
        if (team === 'A') {
          const currentScore = match.teamA.score
          let teamBReceiver
          if (match.teamB.score % 2 === 0 && (currentScore + 1) % 2 === 0) {
            teamBReceiver = match.teamB.serving
          } else if (match.teamB.score % 2 === 1 && (currentScore + 1) % 2 === 1) {
            teamBReceiver = match.teamB.serving
          } else {
            teamBReceiver = Math.abs(match.teamB.serving - 1)
          }
          mutate({
            ...match,
            teamA: {
              ...match.teamA,
              score: match.teamA.score + 1,
              serving: isSingle ? 0 : (match.teamA.isServing ? match.teamA.serving : Math.abs(match.teamA.serving - 1)),
              receiving: null,
              isServing: true
            },
            teamB: {
              ...match.teamB,
              receiving: isSingle ? 0 : teamBReceiver,
              isServing: false
            }
          })
        } else {
          const currentScore = match.teamB.score
          let teamAReceiver
          if (match.teamA.score % 2 === 0 && (currentScore + 1) % 2 === 0) {
            teamAReceiver = match.teamA.serving
          } else if (match.teamA.score % 2 === 1 && (currentScore + 1) % 2 === 1) {
            teamAReceiver = match.teamA.serving
          } else {
            teamAReceiver = Math.abs(match.teamA.serving - 1)
          }
          mutate({
            ...match,
            teamB: {
              ...match.teamB,
              score: match.teamB.score + 1,
              serving: isSingle ? 0 : (match.teamB.isServing ? match.teamB.serving : Math.abs(match.teamB.serving - 1)),
              receiving: null,
              isServing: true
            },
            teamA: {
              ...match.teamA,
              receiving: isSingle ? 0 : teamAReceiver,
              isServing: false
            }
          })
        }

      })
      .catch(err => console.log(err))
  }

  const endMatch = async () => {
    await request.put(`/match/${match._id}`, {
      status: 'finished'
    }).then(res => mutate())
      .catch(e => console.log(e))
  }

  const endGame = async () => {
    if (match.teamA.score === match.teamB.score) {
      Modal.info({ title: 'ไม่สามารถจบเกมได้เนื่องจากไม่มีผู้ชนะ' })
      return
    }
    const scoreLabel = [...match.scoreLabel]
    scoreLabel.push(`${match.teamA.score}-${match.teamB.score}`)
    await request.post('/match/set-score', {
      matchID: id,
      score: scoreLabel,
      status: 'playing'
    })
    await request.put(`/match/${id}`, {
      'teamA.score': 0,
      'teamB.score': 0,
      'teamA.isServing': match.teamA.score > match.teamB.score,
      'teamB.isServing': match.teamB.score > match.teamA.score,
      'teamA.serving': match.teamA.score > match.teamB.score ? 0 : null,
      'teamB.serving': match.teamB.score > match.teamA.score ? 0 : null,
      'teamA.receiving': 0,
      'teamB.receiving': 0,
    })
    setUndo([])
    setSide(!side)
    mutate()
  }
  const onUndo = async () => {
    const prev = undo.pop()
    await request.put(`/match/${id}`, prev)
      .then(res => {
        mutate({
          ...match,
          teamB: {
            ...match.teamB,
            score: prev['teamB.score'],
            serving: prev['teamB.serving'],
            receiving: prev['teamB.receiving'],
            isServing: prev['teamB.isServing']
          },
          teamA: {
            ...match.teamA,
            score: prev['teamA.score'],
            serving: prev['teamA.serving'],
            receiving: prev['teamA.receiving'],
            isServing: prev['teamA.isServing']
          }
        })
      })
  }

  if (isLoading) return <Loading />
  if (isError) return <p>error</p>


  return (
    <Layout previous>
      <div style={{
        padding: '20px',
        height: height - 60,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around',
        maxWidth: '1000px',
        margin: 'auto',
        // overflow: 'scroll'

      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexDirection: side ? 'row-reverse' : 'row'

        }}>

          <div style={{ width: '35%' }}>
            {match?.teamA?.team?.players.map((player, index) => {
              return (
                <div
                  key={`teamA-${player._id}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    marginBottom: '5px',
                    fontSize: '20px',
                    flexDirection: side ? 'row-reverse' : 'row'
                  }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '20px', overflow: 'hidden', objectFit: 'contain' }}>
                    <Image unoptimized src={player.photo?.replace('/upload/', '/upload/q_10/') || `/avatar.png`} alt='' width={40} height={40} objectFit='cover' />
                  </div>
                  <div>{player.officialName || player.displayName}</div>
                  {match.teamA.serving === index && match.teamA.isServing && <div style={{ padding: '2px 5px', backgroundColor: COLOR.MAIN_THEME, borderRadius: '5px' }}>S</div>}
                  {match.teamA.receiving === index && !match.teamA.isServing && <div style={{ padding: '2px 5px', backgroundColor: COLOR.MAIN_THEME, borderRadius: '5px' }}>R</div>}
                </div>
              )
            })}

          </div>


          <div style={{
            width: '20%',
            textAlign: 'center',
          }}>
            <div >
              {
                match.scoreLabel.map((set, i) => {
                  const setElm = set.split('-')
                  setElm.splice(1, 0, '-')
                  return (
                    <div key={i + 1} style={{ display: 'flex', flexDirection: side ? 'row-reverse' : 'row', gap: '5px', justifyContent: 'center' }}>
                      {setElm.map((elm, j) => <div key={j + 1}>{elm}</div>)}
                    </div>
                  )

                })
              }
            </div>

            {match.status != 'finished' && <div style={{
              justifyContent: 'space-between',
              flexDirection: side ? 'row-reverse' : 'row',
              fontSize: '40px',
              display: 'flex',
            }}>
              <div style={{ width: 65 }}>{match.teamA.score}</div>
              <div style={{ width: 20 }}>-</div>
              <div style={{ width: 65 }}>{match.teamB.score}</div>
            </div>}
          </div>


          <div style={{ width: '35%' }}>
            {match?.teamB?.team?.players.map((player, index) => {
              return (
                <div
                  key={`teamB-${player._id}`}
                  style={{
                    flexDirection: side ? 'row' : 'row-reverse',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    marginBottom: '5px',
                    fontSize: '20px'
                  }}
                >
                  <div style={{ width: '40px', height: '40px', borderRadius: '20px', overflow: 'hidden', objectFit: 'contain' }}>
                    <Image unoptimized src={player.photo?.replace('/upload/', '/upload/q_10/') || `/avatar.png`} alt='' width={40} height={40} objectFit='cover' />
                  </div>
                  <div className='info' style={{ marginRight: '5px', marginLeft: 0, textAlign: 'right' }}>{player.officialName || player.displayName}</div>
                  {match.teamB.serving === index && match.teamB.isServing && <div style={{ padding: '2px 5px', backgroundColor: COLOR.MAIN_THEME, borderRadius: '5px' }}>S</div>}
                  {match.teamB.receiving === index && !match.teamB.isServing && < div style={{ padding: '2px 5px', backgroundColor: COLOR.MAIN_THEME, borderRadius: '5px' }}>R</div>}
                </div>
              )
            })}
          </div>
        </div>

        <div>
          <div style={{ textAlign: 'center', fontSize: '20px' }}>แมตช์ที่: {match.matchNumber}</div>
          {(match.gangID || match.umpire) && <div style={{ textAlign: 'center', fontSize: '20px' }}>จำนวนลูก: {match.shuttlecockUsed} ลูก</div>}
          {match.umpire && <div style={{ textAlign: 'center', fontSize: '20px' }}>ผู้ตัดสิน: {match.umpire?.officialName}</div>}
        </div>



        {((user && match.gangID) || isUmpire) && match.status === 'playing' && <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', flexDirection: side ? 'row-reverse' : 'row' }}>
          <Button
            type='primary'
            style={{
              width: 100,
              height: 50,
              borderRadius: 10,
              fontSize: '50px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
            onClick={() => updateScore('A')}
          >
            +
          </Button>
          <div>
            <div style={{ textAlign: 'center', display: 'flex', gap: '10px' }}>
              <Button onClick={() => setSide(!side)}>สลับข้าง</Button>
              {match.teamA.score === 0 && match.teamB.score === 0 && <Button onClick={() => setSettingVisible(true)}>เลือกคนรับ/เสิร์ฟ</Button>}
              <Button type='danger' onClick={() => Modal.confirm({
                title: 'แน่ใจที่จะจบเกม?',
                // icon: <ExclamationCircleFilled />,
                // content: 'Some descriptions',
                onOk: endGame,
                onCancel: () => { console.log('Cancel') },
              })}>จบเกม</Button>
              <Button disabled={undo.length <= 0} onClick={() => onUndo()}>undo</Button>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', paddingTop: '10px' }}>
              <Button style={{ width: '50%' }} onClick={() => manageShuttlecock('decrement')}>ลบลูก</Button>
              <Button style={{ width: '50%' }} onClick={() => manageShuttlecock('increment')}>เพิ่มลูก</Button>
            </div>
            {match.teamA.score === 0 && match.teamB.score === 0 &&
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', paddingTop: '30px' }}>
                <Button style={{ width: '100%' }} type='danger' onClick={() => Modal.confirm({
                  title: 'แน่ใจที่จะจบแมตช์นี้?',
                  // icon: <ExclamationCircleFilled />,
                  content: 'กรุณาตรวจสอบจำนวนลูกที่ใช้ให้ถูกต้องก่อนกดจบแมตช์',
                  onOk: endMatch,
                  onCancel: () => { console.log('Cancel') },
                })}>จบแมตช์</Button>
              </div>}
          </div>
          <Button
            type='primary'
            style={{
              width: 100,
              height: 50,
              borderRadius: 10,
              fontSize: '50px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
            onClick={() => updateScore('B')}
          >
            +
          </Button>
        </div>}
      </div>
      <Modal
        visible={settingVisible}
        title='เลือกคนเสิร์ฟ/รับ'
        onOk={form.submit}
        onCancel={() => setSettingVisible(false)}
        destroyOnClose
      >
        <Form
          form={form}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          onFinish={onSetServingReceiving}
        >
          <Form.Item
            label="คนเสิร์ฟ"
            name="server"
            rules={[{ required: true }]}
          >
            <Select style={{ width: '200px' }}>
              {match.teamA.team.players.map((player, index) => <Select.Option
                key={`A-${index}`}
                value={`A-${index}`}
              >
                {player.officialName || player.displayName}
              </Select.Option>)}
              {match?.teamB?.team?.players.map((player, index) => <Select.Option
                key={`B-${index}`}
                value={`B-${index}`}
              >
                {player.officialName || player.displayName}
              </Select.Option>)}
            </Select>
          </Form.Item>
          <Form.Item
            label="คนรับ"
            name="receiver"
            rules={[{ required: true }]}
          >
            <Select style={{ width: '200px' }}>
              {match?.teamA?.team?.players.map((player, index) => <Select.Option
                key={`A-${index}`}
                value={`A-${index}`}
              >
                {player.officialName || player.displayName}
              </Select.Option>)}
              {match?.teamB?.team?.players.map((player, index) => <Select.Option
                key={`B-${index}`}
                value={`B-${index}`}>
                {player.officialName || player.displayName}
              </Select.Option>)}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </Layout >
  )
}
export default Match