import { useState, useEffect } from 'react'
import { useSWRConfig } from 'swr'
import { Modal, AutoComplete } from 'antd'
import axios from 'axios'
import Image from 'next/image'
import { useRouter } from 'next/router'
import Layout from '../../../components/Layout/gang'
import AddButton from '../../../components/addButton'
import { useGang } from '../../../utils'
import { API_ENDPOINT } from '../../../config'
import Loading from '../../../components/loading'
import { Tabs } from 'antd'

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

  useEffect(() => {
    setQueue(gang?.queue)
  }, [gang])

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


  const showModal = () => {
    setIsModalVisible(true)
  }

  const handleOk = () => {
    setConfirmLoading(true)
    axios.post(`${API_ENDPOINT}/gang/add-queue`, {
      gangID: id,
      teamA: {
        players: [
          gang.players.find(player => player.displayName === player1 || player.officialName === player1)._id,
          gang.players.find(player => player.displayName === player2 || player.officialName === player2)._id
        ]
      },
      teamB: {
        players: [
          gang.players.find(player => player.displayName === player3 || player.officialName === player3)._id,
          gang.players.find(player => player.displayName === player4 || player.officialName === player4)._id
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
        value: player.displayName || player.officialName
      }
    })
    setOptions(
      !searchText ? [] : searchOptions,
    )
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
                    <div>
                      <div style={{ width: '50%' }}>จำนวนลูก: {match.shuttlecockUsed}</div>
                      <div style={{ width: '50%' }}>สถานะ: {match.status}</div>
                    </div>
                    <div className='controller-container'>
                      <div className='controller'>แก้ไข</div>
                      <div className='controller' onClick={() => addShuttlecock(match._id)}>เพิ่มลูก</div>
                      <div className='controller' onClick={() => updateStatus(match._id, match.status)}>{match.status === 'waiting' ? 'เริ่มเกม' : 'จบเกม'}</div>
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