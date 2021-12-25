import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useSelector, useDispatch } from 'react-redux'
import { useRouter } from 'next/router'
import { Button, Upload, message } from 'antd'
import Layout from '../components/Layout'
import { TAB_OPTIONS } from '../constant'
import { EditOutlined, CameraOutlined } from '@ant-design/icons'
import { API_ENDPOINT } from '../config'
import Loading from '../components/loading'
import { analytics, logEvent } from '../utils/firebase'
import request from '../utils/request'
import { getBase64, beforeUpload } from '../utils/image'

const Account = () => {
  const { user } = useSelector(state => state)
  const dispatch = useDispatch()
  const router = useRouter()
  const [imageUrl, setImageUrl] = useState()
  const [ownPlayer, setOwnPlayer] = useState(false)

  const logout = () => {
    logEvent(analytics, 'log out')
    dispatch({ type: 'LOGOUT' })
    localStorage.clear()
  }

  useEffect(() => {
    logEvent(analytics, 'account')
    dispatch({ type: 'ACTIVE_MENU', payload: TAB_OPTIONS.ACCOUNT })
  }, [])

  useEffect(() => {
    if (!user.id) {
      router.push('/login')
      return <div />
      // return <div onClick={() => router.push('/login')}>Please login <span style={{ color: '#4F708A' }}>Click here</span></div>
    }
    if (!user.playerID) {
      setOwnPlayer(false)
    } else {
      setOwnPlayer(true)
    }
  }, [user])


  const onChangeImage = (info) => {
    if (info.file.status === 'done') {
      getBase64(info.file.originFileObj, image => {
        setImageUrl(image) // for user experience
        uploadPhoto(image)
      })
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
      console.log(info)
    }
  }

  const uploadPhoto = (image) => {
    logEvent(analytics, 'upload profile photo')
    request.put(`/player/${user.playerID}`, {
      photo: image
    }, user.token
    ).then((res) => {
      dispatch({ type: 'LOGIN', payload: { photo: res.data.photo } })
      setImageUrl()
    }).catch(() => {
      setImageUrl()
    })
  }

  if (!user.id) return <Loading />
  if (!ownPlayer) return <div onClick={() => router.push('/claim-player')}>Please create profile <span style={{ color: '#4F708A' }}>Click here</span></div>

  return (
    <>
      <div style={{ textAlign: 'center', marginTop: '10px' }}>
        <div style={{ position: 'relative', width: '100px', height: '100px', margin: 'auto' }}>
          <div style={{ width: '100%', height: '100%', borderRadius: '50px', overflow: 'hidden', border: '1px solid #eee' }}>
            <Image objectFit='cover' src={imageUrl || user?.photo || `/avatar.png`} alt='' width={100} height={100} />
          </div>
          <Upload
            action={`${API_ENDPOINT}/mock`}
            name='file'
            onChange={onChangeImage}
            maxCount={1}
            beforeUpload={beforeUpload}
            showUploadList={false}>
            <div style={{
              position: 'absolute',
              bottom: '5px',
              right: '5px',
              width: '25px',
              height: '25px',
              backgroundColor: 'white',
              borderRadius: '15px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              border: '2px solid #eee',
            }}
            >
              <CameraOutlined />
            </div>
          </Upload>
        </div>

        <div style={{ fontWeight: 'bold', marginTop: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          {user.displayName || user.officialName}
          <div onClick={() => router.push('/edit-profile')} style={{ margin: '5px' }}>
            <EditOutlined />
          </div>
        </div>
        {user.displayName && <div>{user.officialName}</div>}
        <div style={{ marginTop: '10px' }}><Button type='danger' onClick={logout}>Log Out</Button></div>
      </div >
    </>
  )
}
Account.getLayout = (page) => {
  return (
    <Layout>
      {page}
    </Layout>
  )
}
export default Account