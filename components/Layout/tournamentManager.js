import { useRouter } from 'next/router'
import Footer from './footer'
import Header from './header'
import { UnorderedListOutlined, TeamOutlined, SettingOutlined, SearchOutlined, TableOutlined, SyncOutlined, PartitionOutlined } from '@ant-design/icons'
import { useSelector } from 'react-redux'
import { COLOR, TAB_OPTIONS } from '../../constant'

const TournamentManagerLayout = (props) => {
  const router = useRouter()
  const { id } = router.query
  const { user, activeMenu } = useSelector(state => state)
  let tabOptions = [
    {
      name: 'ข้อมูล',
      icon: <SearchOutlined style={{ fontSize: '24px', color: activeMenu === TAB_OPTIONS.TOURNAMENT_MANAGER.DETAIL ? COLOR.MINOR_THEME : '#aaa' }} />,
      href: `/tournament-manager/${id}`,
      alias: TAB_OPTIONS.TOURNAMENT_MANAGER.DETAIL
    },
    {
      name: 'รายชื่อ',
      icon: <TeamOutlined style={{ fontSize: '24px', color: activeMenu === TAB_OPTIONS.TOURNAMENT_MANAGER.PARTICIPANTS ? COLOR.MINOR_THEME : '#aaa' }} />,
      href: `/tournament-manager/${id}/participants`,
      alias: TAB_OPTIONS.TOURNAMENT_MANAGER.PARTICIPANTS
    },
    {
      name: 'จับสาย',
      icon: <TableOutlined style={{ fontSize: '24px', color: activeMenu === TAB_OPTIONS.TOURNAMENT_MANAGER.MANAGE ? COLOR.MINOR_THEME : '#aaa' }} />,
      href: `/tournament-manager/${id}/manage`,
      alias: TAB_OPTIONS.TOURNAMENT_MANAGER.MANAGE
    },
    {
      name: 'สายการแข่งขัน',
      icon: <PartitionOutlined style={{ fontSize: '24px', color: activeMenu === TAB_OPTIONS.TOURNAMENT_MANAGER.DRAWS ? COLOR.MINOR_THEME : '#aaa' }} />,
      href: `/tournament-manager/${id}/draws`,
      alias: TAB_OPTIONS.TOURNAMENT_MANAGER.DRAWS
    },
    {
      name: 'รายการแข่งขัน',
      icon: <UnorderedListOutlined style={{ fontSize: '24px', color: activeMenu === TAB_OPTIONS.TOURNAMENT_MANAGER.MATCHES ? COLOR.MINOR_THEME : '#aaa' }} />,
      href: `/tournament-manager/${id}/matches`,
      alias: TAB_OPTIONS.TOURNAMENT_MANAGER.MATCHES
    },
  ]

  return (
    <>
      <Header description='โปรแกรมจัดการแข่งขันแบดมินตัน' back={{ href: '/tournament-manager', alias: 'tournament' }} />
      <main>
        <div className='content'>
          {props.children}
        </div>
      </main>
      <Footer tabOption={tabOptions} />
    </>
  )
}
export default TournamentManagerLayout