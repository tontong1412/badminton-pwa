import Layout from '../../../components/Layout/tournamentManager'
import { useDispatch, useSelector } from 'react-redux'
import { TAB_OPTIONS } from '../../../constant'
import Bracket from '../../../components/Bracket'
import { useTournament } from '../../../utils'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Loading from '../../../components/loading'
import { Tabs, Radio } from 'antd'
import RoundRobin from '../../../components/RoundRobin'
const { TabPane } = Tabs
const Draws = () => {
  const dispatch = useDispatch()
  const router = useRouter()
  const { id } = router.query
  const { tournament, isLoading, isError, mutate } = useTournament(id)
  const [mode, setMode] = useState('group')
  useEffect(() => {
    dispatch({ type: 'ACTIVE_MENU', payload: TAB_OPTIONS.TOURNAMENT_MANAGER.DRAWS })
  }, [])

  if (isLoading) return <Loading />
  if (isError) return <div>Error</div>
  return (
    <Layout>
      <h1>สายการแข่งขัน</h1>
      <Tabs defaultActiveKey="1" >
        {tournament?.events.map(event => {
          return (
            <TabPane tab={event.name} key={event._id}>
              <Radio.Group onChange={e => setMode(e.target.value)} value={mode} style={{ marginBottom: 8 }}>
                <Radio.Button value="group">รอบแบ่งกลุ่ม</Radio.Button>
                <Radio.Button value="knockOut">รอบ Knock Out</Radio.Button>
              </Radio.Group>
              {
                mode === 'knockOut'
                  ? <Bracket event={event} />
                  : <RoundRobin event={event} />
              }
            </TabPane>
          )
        })}
      </Tabs>

    </Layout>
  )
}
export default Draws