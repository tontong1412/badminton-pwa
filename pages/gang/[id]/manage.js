import axios from 'axios'
import generatePayload from 'promptpay-qr'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useState, useRef, useEffect } from 'react'
import { mutate } from 'swr'
import { Modal, AutoComplete } from 'antd'
import { LogoutOutlined } from '@ant-design/icons'
import { API_ENDPOINT } from '../../../config'
import Layout from '../../../components/Layout/gang'
import AddButton from '../../../components/addButton'
import { useGang, usePlayers } from '../../../utils'
import qrcode from 'qrcode'
import { WEB_URL } from '../../../config'
import Loading from '../../../components/loading'

const GangID = () => {
  const router = useRouter()
  const { id } = router.query
  const { gang, isLoading, isError } = useGang(id)
  const [qrSVG, setQrSVG] = useState()

  useEffect(() => {
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
        <div style={{ textAlign: 'center' }}>
          <div dangerouslySetInnerHTML={{ __html: qrSVG }} />
          <div style={{ fontWeight: 'bold', fontSize: '20px' }}>{gang.name}</div>

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