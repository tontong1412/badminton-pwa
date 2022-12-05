import Layout from '../../../components/Layout/tournamentManager'
import { isMobile } from 'react-device-detect'
import { useDispatch } from 'react-redux'
import { COLOR, ROUND_NAME, TAB_OPTIONS } from '../../../constant'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import 'moment/locale/th'
import Loading from '../../../components/loading'
import MatchesTable from '../../../components/TournamentManager/matches'
import { useMatches, useTournament } from '../../../utils'
import { Tabs } from 'antd'
import MatchUp from '../../../components/Bracket/MatchUp'
const { TabPane } = Tabs
const TAB_LIST = [
  {
    key: 'waiting',
    label: 'รอแข่ง'
  },
  {
    key: 'playing',
    label: 'กำลังแข่ง'
  },
  {
    key: 'finished',
    label: 'แข่งเสร็จแล้ว'
  }
]

const Matches = () => {
  const dispatch = useDispatch()
  const router = useRouter()
  const { id } = router.query
  const { matches, isError, isLoading, mutate } = useMatches(id)
  const { tournament } = useTournament(id)
  useEffect(() => {
    dispatch({ type: 'ACTIVE_MENU', payload: TAB_OPTIONS.TOURNAMENT_MANAGER.MATCHES })
  }, [])

  if (!matches || isLoading) return <Loading />

  return (
    <Layout>
      <h2 style={{ marginBottom: 0 }}>{tournament?.name}</h2>
      <h2>รายการแข่งขัน</h2>
      {isMobile
        ?
        <Tabs defaultActiveKey={TAB_LIST[0].key} >
          {TAB_LIST.map((tab =>
            <TabPane tab={tab.label} key={tab.key}>
              {matches?.filter(m => m.status === tab.key && m.matchNumber)
                .sort((a, b) => tab.key === 'waiting' ? a.matchNumber - b.matchNumber : b.matchNumber - a.matchNumber)
                .map(match => {
                  return (
                    <div key={match._id} className='match-list matchups' onClick={() => router.push(`/match/${match._id}`)}>
                      <div style={{
                        backgroundColor: COLOR.MINOR_THEME,
                        borderTopLeftRadius: '0.25rem',
                        borderTopRightRadius: '0.25rem',
                        color: 'whitesmoke',
                        padding: '0px 10px',
                        display: 'flex',
                        justifyContent: 'space-between',
                      }}>
                        <div>{`${match.eventName} - รอบ ${match.step === 'group' ? 'แบ่งกลุ่ม' : ROUND_NAME[match.round]}`}</div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                          {match.status !== 'waiting' && <div>{`#${match.matchNumber}`}</div>}
                          {match.status === 'playing' && <div>{`คอร์ด - ${match.court}`}</div>}
                        </div>
                      </div>
                      <MatchUp match={match} />
                    </div>
                  )

                })}
            </TabPane>))}
        </Tabs>
        : <MatchesTable tournamentID={id} />}

    </Layout >
  )
}
export default Matches