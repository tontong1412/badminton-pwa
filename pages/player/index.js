import Layout from '../../components/Layout/noFooter'
import moment from 'moment'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { usePlayers, useSocket, useWindowSize } from '../../utils'
import Loading from '../../components/loading'
import { useDispatch, useSelector } from 'react-redux'
import { COLOR, TAB_OPTIONS, PLAYER } from '../../constant'
import Image from 'next/image'
import { Button, Divider, Form, Modal, Select, Table } from 'antd'

const columns = [
  {
    title: 'Level',
    dataIndex: 'level',
    key: 'level',
    render: (text) => <a>{text}</a>,
  },
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    render: (text) => <a>{text}</a>,
  },
  {
    title: 'AKA',
    dataIndex: 'displayName',
    key: 'displayName',
    render: (text) => <a>{text}</a>,
  },
  {
    title: 'Club',
    dataIndex: 'club',
    key: 'club',
    render: (text) => <a>{text}</a>,
  },
  {
    title: 'Age',
    dataIndex: 'age',
    key: 'age',
    render: (text) => <a>{text}</a>,
  },
]

const Players = () => {
  const router = useRouter()
  const [form] = Form.useForm()
  const { id } = router.query
  const { players, isLoading, isError, mutate } = usePlayers()
  const dispatch = useDispatch()
  const { user } = useSelector(state => state)
  const socket = useSocket()
  const [playerData, setPlayerData] = useState([])

  useEffect(() => {
    dispatch({ type: 'ACTIVE_MENU', payload: TAB_OPTIONS.TOURNAMENT_MANAGER.DETAIL })
  }, [])

  useEffect(() => {
    if (players && players.length > 0) {
      const tempPlayerData = players.filter(p => typeof p.officialName === 'string' && p.officialName !== null).map(p => ({
        key: p._id,
        name: p.officialName,
        age: moment().diff(p.birthDate, 'year') || 'ไม่ระบุ',
        club: p.club,
        displayName: p.displayName,
        level: p.level ? PLAYER[p.level] : 'ยังไม่ได้ประเมิน'
      }))
      setPlayerData(tempPlayerData)
    }
  }, [players])

  // useEffect(() => {
  //   if (user && match && (user.playerID === match.umpire?._id)) {
  //     setIsUmpire(true)
  //   } else {
  //     setIsUmpire(false)
  //   }
  // }, [user, match])

  useEffect(() => {
    const handleEvent = (payload) => {
      mutate()
    }
    if (socket) {
      socket.on('update-match', handleEvent)
    }
  }, [socket])




  if (isLoading) return <Loading />
  if (isError) return <p>error</p>


  return (
    <Layout previous>
      <Table columns={columns} dataSource={playerData} />
    </Layout >
  )
}
export default Players