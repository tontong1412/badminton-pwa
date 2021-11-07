import axios from 'axios'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useState, useRef, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Modal, AutoComplete, Popconfirm, Button } from 'antd'
import { API_ENDPOINT } from '../../../config'
import Layout from '../../../components/Layout/noFooter'
import AddButton from '../../../components/addButton'
import { useGang, usePlayers } from '../../../utils'
import Loading from '../../../components/loading'
import { DeleteOutlined } from '@ant-design/icons'

const GangID = () => {
  const router = useRouter()
  const { id } = router.query
  const { user } = useSelector(state => state)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [playerID, setPlayerID] = useState()
  const [options, setOptions] = useState([])
  const { gang, isLoading, isError, mutate } = useGang(id)
  const { players } = usePlayers()
  const playerEndRef = useRef(null)
  const [isCreator, setIsCreator] = useState(false)

  useEffect(() => {
    if (user && gang && (user.playerID === gang.creator?._id)) {
      setIsCreator(true)
    } else {
      setIsCreator(false)
    }
  }, [user, gang])


  const showModal = () => {
    setIsModalVisible(true)
  }

  const addManager = () => {
    setConfirmLoading(true)
    axios.post(`${API_ENDPOINT}/gang/add-manager`, {
      gangID: id,
      playerID,
    }, {
      headers: {
        'Authorization': `Token ${user.token}`
      }
    }).then((res) => {
      mutate()
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
      player.userID &&
      (player.displayName?.toLowerCase().includes(searchTextLower)
        || player.officialName?.toLowerCase().includes(searchTextLower))
    ).map(player => {
      return {
        key: player._id,
        value: player.displayName || player.officialName,
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

  const onSelect = (data, options) => {
    setPlayerID(options.key)
  }

  const onChange = (data) => {
    setPlayerID()
  }

  const onRemoveManager = (playerID) => {
    axios.post(`${API_ENDPOINT}/gang/remove-manager`, {
      playerID,
      gangID: id
    }, {
      headers: {
        'Authorization': `Token ${user.token}`
      }
    }).then(() => {
      mutate()
    }).catch(() => { })
  }

  if (isError) return "An error has occurred."
  if (isLoading) return <Loading />
  if (!isCreator) return <div>permission denied</div>
  return <>
    <div style={{ fontSize: '20px' }}>{gang.name} </div>
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <div></div>
      <div>ผู้จัดการทั้งหมด: {gang.managers.length} คน</div>
    </div>
    {
      gang.managers.length > 0 ? gang.managers.map(player => {
        return (
          <div key={`player-${player._id}`} className='gang-player'>
            <div className='player-container'>
              <div className='avatar'>
                <Image objectFit='cover' src={player.photo || `/avatar.png`} alt='' width={50} height={50} layout='responsive' />
              </div>
              <div className='player-name'>{player.displayName || player.officialName}<span style={{ color: '#ccc', marginLeft: '10px' }}>{`${player.displayName ? (player.officialName || '') : ''}`}</span></div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {<Popconfirm
                title="คุณแน่ใจที่จะลบผู้จัดการคนนี้หรือไม่"
                onConfirm={() => onRemoveManager(player._id)}
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
        : <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}><div style={{ color: '#ccc' }}>เพิ่มผู้จัดการได้ที่ปุ่ม + ด้านล่าง</div></div>
    }
    {isCreator && <AddButton onClick={showModal} style={{ bottom: '40px' }} />}
    <Modal
      title="เพิ่มผู้จัดการ"
      visible={isModalVisible}
      onOk={addManager}
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
        placeholder="ชื่อผู้จัดการ"
      />
    </Modal>
    <div style={{ height: '80px' }} ref={playerEndRef} />
  </>
}

GangID.getLayout = (page) => {
  console.log(page)
  return (
    <Layout previous>
      {page}
    </Layout>
  )
}

export default GangID