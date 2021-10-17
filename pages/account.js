import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useSelector, useDispatch } from 'react-redux'
import { useRouter } from 'next/router'
import { Button, Upload, Spin, message } from 'antd'
import Layout from '../components/Layout'
import { TAB_OPTIONS } from '../constant'
import { EditOutlined, CameraOutlined } from '@ant-design/icons'
import axios from 'axios'
import { API_ENDPOINT } from '../config'

const getBase64 = (img, callback) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

const beforeUpload = (file) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }
  const isLt5M = file.size / 1024 / 1024 < 5;
  if (!isLt5M) {
    message.error('Image must smaller than 5MB!');
  }
  return isJpgOrPng && isLt5M;
}

const Account = () => {
  const { user } = useSelector(state => state)
  const dispatch = useDispatch()
  const router = useRouter()
  const [imageUrl, setImageUrl] = useState()
  const [imageLoading, setImageLoading] = useState(false)
  const logout = () => {
    dispatch({ type: 'LOGOUT' })
    localStorage.clear()
  }
  useEffect(() => {
    dispatch({ type: 'ACTIVE_MENU', payload: TAB_OPTIONS.ACCOUNT })
  }, [])

  if (!user.id) {
    return <div onClick={() => router.push('/login')}>Please login <span style={{ color: '#4F708A' }}>Click here</span></div>
  }
  if (!user.playerID) {
    return <div onClick={() => router.push('/claim-player')}>Please create profile <span style={{ color: '#4F708A' }}>Click here</span></div>
  }
  const onChange = (info) => {
    if (info.file.status === 'done') {
      getBase64(info.file.originFileObj, image => {
        setImageUrl(image)
      })
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  }

  const uploadPhoto = () => {
    setImageLoading(true)
    axios.put(`${API_ENDPOINT}/player/${user.playerID}`, {
      photo: imageUrl
    }).then((res) => {
      dispatch({ type: 'LOGIN', payload: { photo: res.data.photo } })
      setImageUrl()
      setImageLoading(false)
    }).catch(() => {
      setImageLoading(fasle)
      setImageUrl()
    })
  }

  return (
    <>
      <div style={{ textAlign: 'center', marginTop: '10px' }}>
        <div style={{ position: 'relative', width: '100px', height: '100px', margin: 'auto' }}>
          <div style={{ width: '100%', height: '100%', borderRadius: '50px', overflow: 'hidden', border: '1px solid #eee' }}>
            <Image objectFit='cover' src={imageUrl || user?.photo || `/avatar.png`} alt='' width={100} height={100} />
          </div>
          <Upload
            name='file'
            onChange={onChange}
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
        {
          imageUrl && (imageLoading ? <Spin size='small' /> :
            <div style={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
              <div style={{ margin: '0px 5px' }} onClick={uploadPhoto}>ยืนยัน</div>
              <div style={{ margin: '0px 5px' }} onClick={() => setImageUrl()}>ยกเลิก</div>
            </div>)
        }

        <div style={{ fontWeight: 'bold', marginTop: '10px' }}>
          {user.displayName || user.officialName}
          <span onClick={() => console.log('edit profile')} style={{ margin: '5px' }}>
            <EditOutlined />
          </span>
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