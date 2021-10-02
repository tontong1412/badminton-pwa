import { useState, useEffect } from 'react'
import { useSWRConfig } from 'swr'
import { Modal, AutoComplete } from 'antd'
import { useSelector } from 'react-redux'
import axios from 'axios'
import Image from 'next/image'
import { useRouter } from 'next/router'
import Layout from '../../../components/Layout/gang'
import AddButton from '../../../components/addButton'
import { useGang } from '../../../utils'
import { API_ENDPOINT } from '../../../config'
import Loading from '../../../components/loading'
import { Tabs, Menu, Dropdown } from 'antd'

const { TabPane } = Tabs
function callback(key) {
  console.log(key);
}



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
  const [canAddQueue, setcanAddQueue] = useState(false)

  useEffect(() => {
    setQueue(gang?.queue)
    if (user && gang && user.playerID === gang.creator._id || gang.managers.includes(user.playerID)) {
      setCanManage(true)
    } else {
      setCanManage(false)
    }

    setOptions(gang.players.map(player => {
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
      setcanAddQueue(true)
    } else {
      setcanAddQueue(false)
    }
  }, [player1, player2, player3, player4])

  const removeQueue = async (matchID) => {
    axios.post(`${API_ENDPOINT}/gang/remove-queue`, {
      gangID: id,
      matchID
    }).then(res => {
      console.log(res.data)
      mutate(`${API_ENDPOINT}/gang/${id}`, res.data)
    })
  }

  const menu = (matchID) => (
    <Menu>
      <Menu.Item key='stat'>
        <div>
          ดูสถิติ
        </div>
      </Menu.Item>
      <Menu.Item key='edit'>
        <div>
          แก้ไข
        </div>
      </Menu.Item>
      <Menu.Item key='delete'>
        <div onClick={() => removeQueue(matchID)}>
          ลบคิวนี้
        </div>
      </Menu.Item>
    </Menu>
  );


  const showModal = () => {
    setIsModalVisible(true)
  }

  const handleOk = () => {
    setConfirmLoading(true)
    axios.post(`${API_ENDPOINT}/gang/add-queue`, {
      gangID: id,
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
      }
    }).then(() => {
      mutate(`${API_ENDPOINT}/gang/${id}`)
      setIsModalVisible(false)
      setConfirmLoading(false)
    })
      .catch(() => {
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
    setConfirmLoading(false)
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

  const onBlur = (value) => {
    if (value && !gang.players.find(player => player.officialName === value || player.displayName === value)) {
      Modal.error({
        title: 'ผู้เล่นไม่ได้ลงทะเบียน',
        content: (
          <div>
            <p>กรุณาเลือกจากผู้เล่นที่ลงทะเบียนไว้แล้ว</p>
          </div>
        ),
        onOk() { },
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
      action: "increment"
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
        addShuttlecock(matchID)
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
  if (isError) return "An error has occurred."
  if (isLoading) return <Loading />

  return (
    <div>
      <Tabs defaultActiveKey="1" onChange={callback}>
        {tabData?.map(tab => (
          <TabPane tab={tab.label} key={tab.key}>
            {
              tab.matchList?.map((match, index) => {
                return (
                  <div key={`match-${match._id}`} className='match-card'>
                    <div className='team-container'>
                      <div className='team'>
                        {match.teamA.team.players.map(player => {
                          return (
                            <div key={`teamA-${player._id}`} className='player-container'>
                              <div className='avatar'>
                                <Image src={player.avatar || `/avatar.png`} alt='' width={40} height={40} />
                              </div>
                              <div className='info'>{player.displayName || player.officialName}</div>
                            </div>
                          )
                        })}
                      </div>
                      <div className='team'>
                        {match.teamB.team.players.map(player => {
                          return (
                            <div key={`teamB-${player._id}`} className='player-container'>
                              <div className='avatar'>
                                <Image src={player.avatar || `/avatar.png`} alt='' width={40} height={40} />
                              </div>
                              <div className='info'>{player.displayName || player.officialName}</div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <div style={{ width: '50%' }}>จำนวนลูก: {match.shuttlecockUsed}</div>
                    </div>
                    <div className='controller-container'>
                      {!canManage && <div className='controller'>ดูสถิติ</div>}
                      {canManage && <Dropdown overlay={menu(match._id)} placement="topLeft" trigger={['click']}><div className='controller'>เพิ่มเติม</div></Dropdown>}
                      {canManage && <div className='controller' onClick={() => addShuttlecock(match._id)}>เพิ่มลูก</div>}
                      {canManage && <div className='controller' onClick={() => updateStatus(match._id, match.status)}>{match.status === 'waiting' ? 'เริ่มเกม' : 'จบเกม'}</div>}
                    </div>
                  </div>
                )
              })
            }
          </TabPane>
        ))}
      </Tabs>
      <AddButton onClick={showModal} />
      <Modal
        title="เพิ่มคิว"
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
            placeholder="ชื่อผู้เล่น"
            onBlur={() => onBlur(player1)}
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
            placeholder="ชื่อผู้เล่น"
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
            placeholder="ชื่อผู้เล่น"
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
            placeholder="ชื่อผู้เล่น"
          />
        </div>
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