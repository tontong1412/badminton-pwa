import axios from 'axios'
import useSWR from 'swr'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { wrapper } from '../../../redux/store'
import { API_ENDPOINT } from '../../../config'
import Layout from '../../../components/Layout/gang'
import { LogoutOutlined } from '@ant-design/icons'
import AddButton from '../../../components/addButton'
import { Modal, AutoComplete } from 'antd'

const fetcher = (url) => axios.get(url).then((res) => res.data)

const GangID = (props) => {
  const router = useRouter()
  const { id } = router.query
  const { tick } = useSelector(state => state)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [value, setValue] = useState('')
  const [options, setOptions] = useState([])
  const { data, error } = useSWR(
    `${API_ENDPOINT}/gang/${id}`,
    fetcher
  )
  const { data: players, error: playerError } = useSWR(
    `${API_ENDPOINT}/player`,
    fetcher
  )

  const showModal = () => {
    setIsModalVisible(true)
  }

  const handleOk = async () => {
    setIsModalVisible(false)
    let player = players.find(player => player.displayName === value || player.displayName === value)
    if (!player) {
      player = {
        displayName: value
      }
    }
    const res = await axios.post(`${API_ENDPOINT}/gang/register`, {
      gangID: id,
      player
    })

  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }

  const onSearch = (searchText) => {
    const searchTextLower = searchText.toLowerCase()
    const searchOptions = players.filter(player =>
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

  const onSelect = (data) => {
    console.log('onSelect', data)
    setValue(data)
  }

  const onChange = (data) => {
    setValue(data);
  }

  if (error) return "An error has occurred."
  if (!data) return "Loading..."
  return <>
    <div style={{ fontSize: '20px' }}>{data.name} </div>
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <div>ผู้เล่นทั้งหมด: {data.players.length} คน</div>
      <div>เพิ่มผู้เล่น</div>
    </div>
    {
      data.players.map(player => {
        return (
          <div key={player._id} className='gang-player'>
            <div className='player-container'>
              <div className='avatar'>
                <Image src='/avatar.png' alt='' width={50} height={50} />
              </div>
              <div className='player-name'>{player.displayName}</div>
            </div>
            <div><LogoutOutlined style={{ fontSize: '30px' }} /></div>
          </div>
        )
      })
    }
    <AddButton onClick={showModal} />
    <Modal title="เพิ่มผู้เล่น" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel} destroyOnClose>
      <AutoComplete
        options={options}
        style={{
          width: 200,
        }}
        onSelect={onSelect}
        onSearch={onSearch}
        onChange={onChange}
        placeholder="ชื่อผู้เล่น"
      />
    </Modal>
  </>
}

export async function getStaticPaths() {
  const res = await axios.get(`${API_ENDPOINT}/gang`)
  const gangs = await res.data
  const paths = gangs.map((gang) => ({
    params: { id: gang._id },
  }))
  return { paths, fallback: false }
}

export const getStaticProps = wrapper.getStaticProps((store) => async ({ params }) => {
  const res = await axios.get(`${API_ENDPOINT}/gang/${params.id}`)
  const gang = await res.data
  store.dispatch({ type: 'GANG', payload: gang })
  return { props: { gang } }
})

GangID.getLayout = (page) => {
  return (
    <Layout>
      {page}
    </Layout>
  )
}

export default GangID