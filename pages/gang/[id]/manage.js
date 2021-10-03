import axios from 'axios'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { mutate } from 'swr'
import { Modal, Button } from 'antd'
import { API_ENDPOINT } from '../../../config'
import Layout from '../../../components/Layout/gang'
import { useGang } from '../../../utils'
import qrcode from 'qrcode'
import { WEB_URL } from '../../../config'
import Loading from '../../../components/loading'
import { TAB_OPTIONS } from '../../../constant'

const GangID = () => {
  const router = useRouter()
  const { id } = router.query
  const { gang, isLoading, isError } = useGang(id)
  const [qrSVG, setQrSVG] = useState()
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch({ type: 'ACTIVE_MENU', payload: TAB_OPTIONS.GANG.SETTING })
    const payload = `${WEB_URL}/gang/${id}`
    qrcode.toString(payload, (err, svg) => {
      if (err) return console.log(err)
      setQrSVG(svg)
    })
  }, [])


  if (isError) return "An error has occurred."
  if (isLoading) return <Loading />

  return (
    <div>
      {qrSVG ?
        <div style={{ textAlign: 'center', maxWidth: '350px', margin: 'auto' }}>
          <div dangerouslySetInnerHTML={{ __html: qrSVG }} />
          <div style={{ fontWeight: 'bold', fontSize: '20px' }}>{gang.name}</div>
          <div><Button style={{ width: '200px', marginBottom: '10px' }}>สถิติ</Button></div>
          <div><Button type='primary' style={{ width: '200px', marginBottom: '50px' }}>สรุปยอด</Button></div>
          <div><Button type='danger' style={{ width: '200px', marginBottom: '10px' }}>ลบก๊วน</Button></div>
        </div>
        :
        <Loading />
      }
    </div>
  )
}

GangID.getLayout = (page) => {
  return (
    <Layout>
      {page}
    </Layout>
  )
}

export default GangID