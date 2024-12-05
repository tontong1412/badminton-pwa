import Layout from '../../../components/Layout/noFooter'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { usePlayer, useSocket, useWindowSize } from '../../../utils'
import Loading from '../../../components/loading'
import { useDispatch, useSelector } from 'react-redux'
import { COLOR, TAB_OPTIONS, MAP_GENDER, PLAYER } from '../../../constant'
import Image from 'next/image'
import { Button, Divider, Form, Modal, Select, Tag } from 'antd'
import moment from 'moment'
import request from '../../../utils/request'

const Player = () => {
  const router = useRouter()
  const { id } = router.query
  const { player, isLoading, isError, mutate } = usePlayer(id)
  const dispatch = useDispatch()
  const [activity, setActivity] = useState()
  const { user } = useSelector(state => state)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(false)



  useEffect(() => {
    if (user && user.admin) {
      setIsAdmin(true)
    } else {
      setIsAdmin(false)
    }
  }, [user])

  useEffect(() => {
    if (player) {
      const getRecentActivity = async () => {
        const recentActivity = await request.get(`/player/${player?._id}/recent-activity`)
        setActivity(recentActivity.data)
      }
      getRecentActivity()
    }


    return () => {
      setActivity({}); //unmount
    };
  }, [player])

  useEffect(() => {
    dispatch({ type: 'ACTIVE_MENU', payload: TAB_OPTIONS.TOURNAMENT_MANAGER.DETAIL })
  }, [])


  const onSetLevel = (values) => {
    setLoading(true)
    request.put(`/player/${id}/set-level`, values, user.token)
      .then(res => {
        mutate()
        setLoading(false)
      })
      .catch(e => setLoading(false))
  }

  if (isLoading) return <Loading />
  if (isError) return <p>error</p>

  return (
    <Layout previous>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '40px',
          overflow: 'hidden',
          objectFit: 'contain',
          marginTop: '10px'
        }}>
          <a href={player?.photo}>
            <Image unoptimized objectFit='cover' src={player.photo?.replace('/upload/', '/upload/q_10/') || `/avatar.png`} alt='' width={50} height={50} layout='responsive' />
          </a>
        </div>
        <div style={{ display: 'flex', marginTop: '20px', gap: '5px' }}>
          <div >{player.officialName}</div>
          {player.level && <Tag>{PLAYER.LEVEL[player.level]}</Tag>}
        </div>
        <div>{player.displayName && <div>{`(${player.displayName})`}</div>}</div>
        <div>{`${player.club}`}</div>

        {moment().diff(player.birthDate, 'year') ?
          <div style={{ display: 'flex', gap: '10px', width: '200px' }}>
            <div style={{ width: '100px', textAlign: 'right' }}>อายุ:</div>
            <div>{moment().diff(player.birthDate, 'year')}</div>
          </div> : null}

        {player.gender && <div style={{ display: 'flex', gap: '10px', width: '200px' }}>
          <div style={{ width: '100px', textAlign: 'right' }}>เพศ:</div>
          <div>{MAP_GENDER[player.gender]}</div>
        </div>}
        {activity?.length > 1 &&
          <div style={{ width: '100%' }}>
            <div style={{ borderBottom: '1px solid #eee', padding: '5px', width: '100%', textAlign: 'center' }}>รายการแข่งล่าสุด</div>
            {
              activity.slice(1).map(t =>
                <div key={t?._id} >
                  <div
                    style={{ borderBottom: '1px solid #eee', padding: '5px', width: '100%', textAlign: 'center' }}>
                    <a href={`/tournament/${t._id}`}>{t?.name}</a>
                    {t?.events.map(e => <Tag key={e?._id} color='blue' style={{ marginLeft: '3px' }}>{e?.name}</Tag>)}
                  </div>
                </div>)
            }
          </div>
        }
      </div >

      {isAdmin &&
        <div>
          <Divider />
          <Form
            onFinish={onSetLevel}
            style={{ width: '80%', margin: 'auto' }}
          >

            <Form.Item
              name="level"
              label="ประเมินมือ"
              hasFeedback
            >
              <Select placeholder="Please select a player level">
                {
                  PLAYER.LEVEL.map((level, index) => (<Select.Option key={index} value={index}>{level}</Select.Option>))
                }
              </Select>
            </Form.Item>
            <Form.Item style={{ textAlign: "center", marginTop: '20px' }}>

              <Button type="primary" htmlType="submit" loading={loading} style={{ width: '100%', }}>
                Submit
              </Button>
            </Form.Item>
          </Form>
        </div>
      }
    </Layout >
  )
}
export default Player