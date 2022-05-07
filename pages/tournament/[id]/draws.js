import Layout from '../../../components/Layout/tournamentManager'
import { useDispatch, useSelector } from 'react-redux'
import { TAB_OPTIONS, MAP_TOURNAMENT_STATUS_TO_DRAW_TAB } from '../../../constant'
import Bracket from '../../../components/Bracket'
import { useTournament } from '../../../utils'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Loading from '../../../components/loading'
import { Tabs, Radio } from 'antd'
import RoundRobin from '../../../components/RoundRobin'
import Participants from '../../../components/TournamentManager/participants'
const { TabPane } = Tabs
const Draws = () => {
  const dispatch = useDispatch()
  const { user } = useSelector(state => state)
  const [isManager, setIsManager] = useState(false)
  const router = useRouter()
  const { id } = router.query
  const { tournament, isLoading, isError, mutate } = useTournament(id)
  const [mode, setMode] = useState(MAP_TOURNAMENT_STATUS_TO_DRAW_TAB[tournament?.status || 'participants'])
  const [tab, setTab] = useState(tournament?.events[0]?._id)
  useEffect(() => {
    dispatch({ type: 'ACTIVE_MENU', payload: TAB_OPTIONS.TOURNAMENT_MANAGER.DRAWS })
  }, [])

  useEffect(() => {
    if (user && tournament && (user.playerID === tournament.creator || tournament?.managers?.map(e => e._id).includes(user.playerID))) {
      setIsManager(true)
    } else {
      setIsManager(false)
    }
  }, [user, tournament])

  const renderDraws = (event) => {
    if (mode === 'knockOut') {
      return <Bracket key={event._id} event={event} step='knockOut' isManager={isManager} />
    } else if (mode === 'group') {
      return <RoundRobin key={event._id} event={event} isManager={isManager} />
    } else if (mode === 'consolation') {
      return <Bracket key={event._id} event={event} step='consolation' isManager={isManager} />
    } else if (mode === 'participants') {
      return <Participants tournamentID={id} eventID={event._id} />
    }
    return null
  }


  if (isLoading) return <Loading />
  if (isError) return <div>Error</div>
  return (
    <Layout>
      <h1>สายการแข่งขัน</h1>
      <Tabs
        defaultActiveKey={tab}
        activeKey={tab}
        onChange={(key) => {
          setTab(key)
          setMode(MAP_TOURNAMENT_STATUS_TO_DRAW_TAB[tournament?.status || 'participants'])
        }}
      >
        {tournament?.events?.map(event => {
          return (
            <TabPane tab={event.name} key={event._id}>

              <Radio.Group onChange={e => setMode(e.target.value)} value={mode} style={{ marginBottom: 8 }}>
                <Radio.Button value="participants">รายชื่อ</Radio.Button>
                {event?.format !== 'singleElim' && <Radio.Button value="group">แบ่งกลุ่ม</Radio.Button>}
                <Radio.Button value="knockOut">Knock Out</Radio.Button>
                {event?.format === 'roundRobinConsolation' && <Radio.Button value="consolation">สายล่าง</Radio.Button>}
              </Radio.Group>
              {renderDraws(event)}
            </TabPane>
          )
        })}
      </Tabs>

    </Layout>
  )
}
export default Draws