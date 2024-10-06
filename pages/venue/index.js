import { useVenues } from "../../utils"
import { analytics, logEvent } from '../../utils/firebase'
import Layout from '../../components/Layout'
import Link from 'next/link'
import { useDispatch } from "react-redux"
import { useEffect } from "react"
import { COLOR, TAB_OPTIONS } from "../../constant"
import Image from "next/image"
import { Avatar, Card, Flex, Switch } from 'antd';
import { EnvironmentOutlined } from '@ant-design/icons'
import MyBooking from "../../components/venue/MyBooking"

const Venue = () => {
  const dispatch = useDispatch()
  const { venues, isLoading, isError, mutate } = useVenues()
  useEffect(() => {
    logEvent(analytics, 'venue')
    dispatch({ type: 'ACTIVE_MENU', payload: TAB_OPTIONS.VENUE })
  }, [])

  return (
    <Layout>
      <MyBooking bottomLine />
      {
        venues?.map(v => <div key={v._id}>
          <Card
            actions={[
              // <div key='detail'>ติดต่อสอบถาม</div>,
              <Link key='book' href={`/venue/${v._id}`}
                passHref><div > จอง</div></Link>,
            ]}
            style={{
              minWidth: 300,
              maxWidth: 400,
              margin: '10px',
              borderRadius: '10px',
              border: '1px solid #ddd',
              overflow: 'hidden'
            }}
            cover={
              <img
                height={150}
                style={{ objectFit: 'cover' }}
                alt="example"
                src={v.coverPhoto || '/icon/logo.png'}
              />
            }
          >
            <Card.Meta
              title={v.name}
              description={
                <>
                  <EnvironmentOutlined />
                  <span>{` Chiang Mai`}</span>
                </>
              }
            />
          </Card>
          {/* <div style={{
            margin: '10px',
            // padding: '16px',
            border: '1px solid #aaa',
            borderRadius: '5px',
            display: 'flex',
            maxWidth: '400px'
          }}>
            <div style={{ width: '30%' }}>
              <Image
                src='/icon/logo.png'
                alt=''
                width={100}
                height={100}
                objectFit='cover'
                fill='responsive'
              />
            </div>
            <div style={{ width: '70%', padding: '16px' }}>
              <div style={{ color: COLOR.MINOR_THEME, fontSize: '18px', width: '100%', overflow: 'hidden', textWrap: 'nowrap', textOverflow: 'ellipsis' }}>{v.name}</div>
              <div>เชียงใหม่</div>
            </div>

          </div> */}

        </div >)
      }
    </Layout >
  )
}
export default Venue