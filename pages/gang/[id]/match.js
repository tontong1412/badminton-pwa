import { useState, useEffect } from 'react'
import { useSWRConfig } from 'swr'
import { Modal, AutoComplete, Input, Empty } from 'antd'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'
import Image from 'next/image'
import { useRouter } from 'next/router'
import Layout from '../../../components/Layout/gang'
import AddButton from '../../../components/addButton'
import { useGang } from '../../../utils'
import { API_ENDPOINT } from '../../../config'
import Loading from '../../../components/loading'
import { Tabs, Menu, Dropdown } from 'antd'
import { TAB_OPTIONS } from '../../../constant'
import Stat from '../../../components/Stat'
import { analytics, logEvent } from '../../../utils/firebase'

const { TabPane } = Tabs

const MatchList = () => {
  const router = useRouter()
  const { id } = router.query
  const { mutate } = useSWRConfig()
  const { gang, isLoading, isError } = useGang(id)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [options, setOptions] = useState([])
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [queue, setQueue] = useState(gang?.queue)
  const [player1, setPlayer1] = useState()
  const [player2, setPlayer2] = useState()
  const [player3, setPlayer3] = useState()
  const [player4, setPlayer4] = useState()
  const [waitingList, setWaitingList] = useState()
  const [playingList, setPlayingList] = useState()
  const [finishedList, setFinishedList] = useState()
  const [tabData, setTabData] = useState()
  const [canManage, setCanManage] = useState(false)
  const { user } = useSelector(state => state)
  const [canAddQueue, setCanAddQueue] = useState(false)
  const [actionMode, setActionMode] = useState()
  const [selectedMatch, setMatch] = useState()
  const [setScoreModal, setSetScoreModal] = useState(false)
  const [scoreSet1, setScoreSet1] = useState()
  const [scoreSet2, setScoreSet2] = useState()
  const [scoreSet3, setScoreSet3] = useState()
  const [statModal, setStatModal] = useState(false)
  const [stat, setStat] = useState()
  const [tabKey, setTabKey] = useState('1')
  const [allowAddQueue, setAllowAddQueue] = useState(false)

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch({ type: 'ACTIVE_MENU', payload: TAB_OPTIONS.GANG.QUEUE })
  }, [])

  useEffect(() => {
    setQueue(gang?.queue)
    if (user && gang && (user.playerID === gang.creator._id || gang.managers.includes(user.playerID))) {
      setCanManage(true)
      setAllowAddQueue(true)
    } else {
      setCanManage(false)
      if (user && gang && gang.players.map(elm => elm._id).includes(user.playerID)) {
        setAllowAddQueue(true)
      }
    }


    setOptions(gang?.players.map(player => {
      return {
        value: player.displayName || player.officialName,
        label: renderItem(player.displayName, player.officialName)
      }
    }))

  }, [gang, user])

  useEffect(() => {
    setWaitingList(queue?.filter(match => match.status === 'waiting'))
    setPlayingList(queue?.filter(match => match.status === 'playing'))
    setFinishedList(queue?.filter(match => match.status === 'finished'))
  }, [queue])

  useEffect(() => {
    setTabData([
      {
        key: '1',
        label: 'รอคิว',
        matchList: waitingList
      },
      {
        key: '2',
        label: 'กำลังตี',
        matchList: playingList
      },
      {
        key: '3',
        label: 'ตีเสร็จแล้ว',
        matchList: finishedList
      },
    ])
  }, [waitingList, playingList, finishedList])

  useEffect(() => {
    if (player1 && player2 && player3 && player4) {
      setCanAddQueue(true)
    } else {
      setCanAddQueue(false)
    }
  }, [player1, player2, player3, player4])

  const removeQueue = async (matchID) => {
    logEvent(analytics, 'remove queue')
    axios.post(`${API_ENDPOINT}/gang/remove-queue`, {
      gangID: id,
      matchID
    }).then(res => {
      mutate(`${API_ENDPOINT}/gang/${id}`, res.data)
    })
  }

  const menu = (match) => (
    <Menu>
      <Menu.Item key='stat' disabled>
        <div>
          ดูสถิติ
        </div>
      </Menu.Item>
      <Menu.Item key='edit'>
        <div onClick={() => {
          setActionMode('update')
          showModal()
          setMatch(match)
          setPlayer1(match.teamA.team.players[0].displayName || match.teamA.team.players[0].officialName)
          setPlayer2(match.teamA.team.players[1].displayName || match.teamA.team.players[1].officialName)
          setPlayer3(match.teamB.team.players[0].displayName || match.teamB.team.players[0].officialName)
          setPlayer4(match.teamB.team.players[1].displayName || match.teamB.team.players[1].officialName)
        }}>
          แก้ไข
        </div>
      </Menu.Item>
      <Menu.Item key='delete'>
        <div onClick={() => removeQueue(match._id)}>
          ลบคิวนี้
        </div>
      </Menu.Item>
    </Menu>
  )

  const showModal = () => {
    setIsModalVisible(true)
  }

  const handleOk = () => {
    if (canManage) {
      logEvent(analytics, 'manager add queue')
    } else {
      logEvent(analytics, 'customer add queue')
    }
    setConfirmLoading(true)
    const endpoint = actionMode === 'create' ? `${API_ENDPOINT}/gang/add-queue` : `${API_ENDPOINT}/gang/update-queue`
    axios.post(endpoint, {
      gangID: id,
      matchID: selectedMatch?._id,
      teamA: {
        players: [
          gang.players.find(player => player.officialName === player1 || player.displayName === player1)?._id,
          gang.players.find(player => player.officialName === player2 || player.displayName === player2)?._id
        ]
      },
      teamB: {
        players: [
          gang.players.find(player => player.officialName === player3 || player.displayName === player3)?._id,
          gang.players.find(player => player.officialName === player4 || player.displayName === player4)?._id
        ]
      },
      reference: gang.reference
    }).then(() => {
      mutate(`${API_ENDPOINT}/gang/${id}`)
      setIsModalVisible(false)
      setConfirmLoading(false)
      setPlayer1()
      setPlayer2()
      setPlayer3()
      setPlayer4()
    })
      .catch(() => {
        setConfirmLoading(false)
        Modal.error({
          title: 'ผิดพลาด',
          content: (
            <div>
              <p>เกิดปัญหาขณะอัพเดทข้อมูล กรุณาลองใหม่ในภายหลัง</p>
            </div>
          ),
          onOk() {
            setPlayer1()
            setPlayer2()
            setPlayer3()
            setPlayer4()
          },
        })
      })
  }

  const handleCancel = () => {
    setIsModalVisible(false)
    setConfirmLoading(false)
    setPlayer1()
    setPlayer2()
    setPlayer3()
    setPlayer4()
  }

  const onSearch = (searchText) => {
    const searchTextLower = searchText.toLowerCase()
    const searchOptions = gang.players.filter(player =>
      player.displayName?.toLowerCase().includes(searchTextLower)
      || player.officialName?.toLowerCase().includes(searchTextLower)
    ).map(player => {
      return {
        value: player.displayName || player.officialName,
        label: renderItem(player.displayName, player.officialName)
      }
    })
    setOptions(
      !searchText ? [] : searchOptions,
    )
  }

  const validateScoreLabel = (score) => {
    if (!score) return
    const regex = /\d+-\d+/g
    const matchRegex = score?.match(regex)
    if (matchRegex?.length === 1) return matchRegex[0]
    return 'inValidPattern'
  }

  const onSetScore = () => {
    setConfirmLoading(true)
    const validatedSet1 = validateScoreLabel(scoreSet1)
    const validatedSet2 = validateScoreLabel(scoreSet2)
    const validatedSet3 = validateScoreLabel(scoreSet3)

    if (!validatedSet1
      || validatedSet1 === 'inValidPattern'
      || validatedSet2 === 'inValidPattern'
      || validatedSet3 === 'inValidPattern') return Modal.error({
        title: 'ผิดพลาด',
        content: 'กรุณากรอกคะแนนในรูปแบบที่ถูกต้อง ตัวอย่าง 21-15'
      })

    const score = [scoreSet1, scoreSet2]
    if (scoreSet3) score.push(scoreSet3)
    axios.post(`${API_ENDPOINT}/match/set-score`, {
      matchID: selectedMatch._id,
      score
    }).then(() => {
      setSetScoreModal(false)
      setConfirmLoading(false)
      mutate(`${API_ENDPOINT}/gang/${id}`)
    }).catch(() => {
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

  const renderItem = (displayName, officialName) => (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
      }}>
      <div>
        {displayName || officialName}
      </div>
      {displayName ? <div style={{ color: '#bbb' }}>{officialName}</div> : null}
    </div>
  );

  const onBlur = (value, clearFunction) => {
    if (value && !gang.players.find(player => player.officialName === value || player.displayName === value)) {
      Modal.error({
        title: 'ผู้เล่นไม่ได้ลงทะเบียน',
        content: (
          <div>
            <p>กรุณาเลือกจากผู้เล่นที่ลงทะเบียนไว้แล้ว</p>
          </div>
        ),
        onOk() { clearFunction() },
      })
    }
  }

  const addShuttlecock = (matchID) => {
    const queueIndex = gang.queue.findIndex(match => match._id === matchID)
    const tempQueue = [...gang.queue]
    tempQueue[queueIndex].shuttlecockUsed = tempQueue[queueIndex].shuttlecockUsed + 1
    setQueue(tempQueue)

    axios.post(`${API_ENDPOINT}/match/manage-shuttlecock`, {
      matchID,
      action: 'increment'
    }).then(() => {
      mutate(`${API_ENDPOINT}/gang/${id}`)
    }).catch(() => {
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

  const updateStatus = (matchID, matchStatus) => {
    const status = matchStatus === 'waiting' ? 'playing' : 'finished'
    const queueIndex = gang.queue.findIndex(match => match._id === matchID)
    const tempQueue = [...gang.queue]
    tempQueue[queueIndex].status = status
    setQueue(tempQueue)
    axios.put(`${API_ENDPOINT}/match/${matchID}`, {
      status
    }).then(() => {
      mutate(`${API_ENDPOINT}/gang/${id}`)
      if (status === 'playing') {
        setTabKey('2')
        // addShuttlecock(matchID)
      }
    }).catch(() => {
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

  const getStat = (matchID) => {
    logEvent(analytics, 'get stat')
    setStatModal(true)
    axios.get(`${API_ENDPOINT}/match/${matchID}/stat`)
      .then(res => {
        setStat(res.data)
      })
      .catch(() => { })
  }

  const onTabClick = (key) => {
    setTabKey(key)
  }
  if (isError) return 'An error has occurred.'
  if (isLoading) return <Loading />

  return (
    <div>
      <Tabs defaultActiveKey='1' activeKey={tabKey} onTabClick={onTabClick}>
        {tabData?.map(tab => (
          <TabPane tab={tab.label} key={tab.key}>
            {
              tab.matchList?.length > 0 ? tab.matchList?.map((match) => {
                return (
                  <div key={`match-${match._id}`} className='match-card'>
                    <div className='team-container'>
                      <div className='team'>
                        {match.teamA.team.players.map(player => {
                          return (
                            <div key={`teamA-${player._id}`} className='player-container'>
                              <div className='avatar'>
                                <Image className='avatar' src={player.photo || `/avatar.png`} alt='' width={35} height={35} objectFit='cover' />
                              </div>
                              <div className='info'>{player.displayName || player.officialName}</div>
                            </div>
                          )
                        })}
                      </div>
                      <div style={{ width: '15%', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                        {match.scoreLabel?.map((set, index) => <div key={`score-${index}`}>{set}</div>)}
                      </div>
                      <div className='team'>
                        {match.teamB.team.players.map(player => {
                          return (
                            <div key={`teamB-${player._id}`}
                              className='player-container'
                              style={{ flexDirection: 'row-reverse' }}
                            >
                              <div className='avatar'>
                                <Image className='avatar' src={player.photo || `/avatar.png`} alt='' width={35} height={35} objectFit='cover' />
                              </div>
                              <div className='info' style={{ marginRight: '5px', marginLeft: 0, textAlign: 'right' }}>{player.displayName || player.officialName}</div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <div style={{ width: '50%' }}>จำนวนลูก: {match.shuttlecockUsed}</div>
                    </div>
                    <div className='controller-container'>
                      {!canManage && match.status !== 'finished' && <div onClick={() => getStat(match._id)} className='controller'>สถิติ</div>}
                      {canManage && match.status !== 'finished' && <Dropdown overlay={menu(match)} placement='topLeft' trigger={['click']}><div className='controller'>เพิ่มเติม</div></Dropdown>}
                      {canManage && match.status === 'playing' && <div className='controller' onClick={() => addShuttlecock(match._id)}>เพิ่มลูก</div>}
                      {canManage && match.status !== 'finished' && <div className='controller' onClick={() => updateStatus(match._id, match.status)}>{match.status === 'waiting' ? 'เริ่มเกม' : 'จบเกม'}</div>}
                      {match.status === 'finished' && <div onClick={() => getStat(match._id)} className='controller'>สถิติ</div>}
                      {user.id && match.status === 'finished' && <div className='controller' onClick={() => {
                        setSetScoreModal(true)
                        setMatch(match)
                      }}>บันทึกผล
                      </div>}
                    </div>
                  </div>
                )
              })
                : <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}><div style={{ color: '#ccc' }}>เพิ่มคิวได้ที่ปุ่ม + ด้านล่าง</div></div>
            }
          </TabPane>
        ))}
      </Tabs>
      {allowAddQueue && <AddButton onClick={() => {
        setActionMode('create')
        showModal()
      }} />}
      <Modal
        title='เพิ่มคิว'
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        confirmLoading={confirmLoading}
        okButtonProps={{ disabled: !canAddQueue }}
        destroyOnClose>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
          <div>ผู้เล่น</div>
          <AutoComplete
            options={options}
            style={{
              width: 250,
              marginLeft: '10px'
            }}
            onSelect={(data => setPlayer1(data))}
            onSearch={onSearch}
            onChange={data => setPlayer1(data)}
            placeholder='ชื่อผู้เล่น'
            onBlur={() => onBlur(player1, setPlayer1)}
            defaultValue={player1}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
          <div>ผู้เล่น</div>
          <AutoComplete
            options={options}
            style={{
              width: 250,
              marginLeft: '10px'
            }}
            onSelect={(data => setPlayer2(data))}
            onSearch={onSearch}
            onChange={data => setPlayer2(data)}
            placeholder='ชื่อผู้เล่น'
            onBlur={() => onBlur(player2, setPlayer2)}
            defaultValue={player2}
          />
        </div>
        <div style={{ width: '100%', textAlign: 'center', marginBottom: '10px' }}>vs</div>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
          <div>ผู้เล่น</div>
          <AutoComplete
            options={options}
            style={{
              width: 250,
              marginLeft: '10px'
            }}
            onSelect={(data => setPlayer3(data))}
            onSearch={onSearch}
            onChange={data => setPlayer3(data)}
            placeholder='ชื่อผู้เล่น'
            onBlur={() => onBlur(player3, setPlayer3)}
            defaultValue={player3}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
          <div>ผู้เล่น</div>
          <AutoComplete
            options={options}
            style={{
              width: 250,
              marginLeft: '10px'
            }}
            onSelect={(data => setPlayer4(data))}
            onSearch={onSearch}
            onChange={data => setPlayer4(data)}
            placeholder='ชื่อผู้เล่น'
            onBlur={() => onBlur(player4, setPlayer4)}
            defaultValue={player4}
          />
        </div>
      </Modal>
      <Modal
        title='บันทึกผล'
        visible={setScoreModal}
        onOk={onSetScore}
        onCancel={() => {
          setScoreSet1()
          setScoreSet2()
          setScoreSet3()
          setSetScoreModal(false)
        }}
        confirmLoading={confirmLoading}
        destroyOnClose>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ textAlign: 'right' }}>
            {selectedMatch?.teamA.team.players.map(player => <div key={player._id}>{player.displayName || player.officialName}</div>)}
          </div>
          <div style={{ width: '30%' }}>
            <Input placeholder='e.g. 21-15' onChange={(e) => setScoreSet1(e.target.value)} style={{ marginBottom: '5px' }} />
            <Input placeholder='e.g. 21-15' onChange={(e) => setScoreSet2(e.target.value)} style={{ marginBottom: '5px' }} />
            <Input placeholder='e.g. 21-15' onChange={(e) => setScoreSet3(e.target.value)} style={{ marginBottom: '5px' }} />
          </div>
          <div >
            {selectedMatch?.teamB.team.players.map(player => <div key={player._id}>{player.displayName || player.officialName}</div>)}
          </div>
        </div>
      </Modal>
      <Modal
        title='สถิติ'
        visible={statModal}
        onOk={() => setStatModal(false)}
        onCancel={() => setStatModal(false)}
        destroyOnClose>
        <Stat stat={stat} />
      </Modal>
    </div >
  )
}
MatchList.getLayout = (page) => {
  return (
    <Layout>
      {page}
    </Layout>
  )
}
export default MatchList