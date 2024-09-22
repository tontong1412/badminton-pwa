import { useRouter } from 'next/router'
import Footer from './footer'
import Header from './header'
import { UnorderedListOutlined, TeamOutlined, SettingOutlined, SearchOutlined, TableOutlined, SyncOutlined, PartitionOutlined } from '@ant-design/icons'
import { useSelector } from 'react-redux'
import { COLOR, TAB_OPTIONS } from '../../constant'
import { useTournament } from '../../utils'

const TournamentManagerLayout = (props) => {
  const router = useRouter()
  const { id } = router.query
  const { user, activeMenu } = useSelector(state => state)
  const { tournament } = useTournament(id)
  let tabOptions = [
    {
      name: 'ข้อมูล',
      icon: <SearchOutlined style={{ fontSize: '24px', color: activeMenu === TAB_OPTIONS.TOURNAMENT_MANAGER.DETAIL ? COLOR.MINOR_THEME : '#aaa' }} />,
      href: `/tournament/${id}`,
      alias: TAB_OPTIONS.TOURNAMENT_MANAGER.DETAIL
    },
    // {
    //   name: 'ตรวจสอบรายชื่อ',
    //   icon: <TeamOutlined style={{ fontSize: '24px', color: activeMenu === TAB_OPTIONS.TOURNAMENT_MANAGER.PARTICIPANTS ? COLOR.MINOR_THEME : '#aaa' }} />,
    //   href: `/tournament/${id}/participants`,
    //   alias: TAB_OPTIONS.TOURNAMENT_MANAGER.PARTICIPANTS
    // },
    {
      name: 'รายชื่อ/สาย',
      icon: <PartitionOutlined style={{ fontSize: '24px', color: activeMenu === TAB_OPTIONS.TOURNAMENT_MANAGER.DRAWS ? COLOR.MINOR_THEME : '#aaa' }} />,
      href: `/tournament/${id}/draws`,
      alias: TAB_OPTIONS.TOURNAMENT_MANAGER.DRAWS
    },
    {
      name: 'รายการแข่งขัน',
      icon: <UnorderedListOutlined style={{ fontSize: '24px', color: activeMenu === TAB_OPTIONS.TOURNAMENT_MANAGER.MATCHES ? COLOR.MINOR_THEME : '#aaa' }} />,
      href: `/tournament/${id}/matches`,
      alias: TAB_OPTIONS.TOURNAMENT_MANAGER.MATCHES
    },
  ]
  if (user.playerID === tournament?.creator || tournament?.managers.map(e => e._id).includes(user.playerID)) {
    tabOptions = [
      {
        name: 'ข้อมูล',
        icon: <SearchOutlined style={{ fontSize: '24px', color: activeMenu === TAB_OPTIONS.TOURNAMENT_MANAGER.DETAIL ? COLOR.MINOR_THEME : '#aaa' }} />,
        href: `/tournament/${id}`,
        alias: TAB_OPTIONS.TOURNAMENT_MANAGER.DETAIL
      },
      // {
      //   name: 'รายชื่อ',
      //   icon: <TeamOutlined style={{ fontSize: '24px', color: activeMenu === TAB_OPTIONS.TOURNAMENT_MANAGER.PARTICIPANTS ? COLOR.MINOR_THEME : '#aaa' }} />,
      //   href: `/tournament/${id}/participants`,
      //   alias: TAB_OPTIONS.TOURNAMENT_MANAGER.PARTICIPANTS
      // },
      {
        name: 'รายชื่อ/สาย',
        icon: <PartitionOutlined style={{ fontSize: '24px', color: activeMenu === TAB_OPTIONS.TOURNAMENT_MANAGER.DRAWS ? COLOR.MINOR_THEME : '#aaa' }} />,
        href: `/tournament/${id}/draws`,
        alias: TAB_OPTIONS.TOURNAMENT_MANAGER.DRAWS
      },
      {
        name: 'รายการ',
        icon: <UnorderedListOutlined style={{ fontSize: '24px', color: activeMenu === TAB_OPTIONS.TOURNAMENT_MANAGER.MATCHES ? COLOR.MINOR_THEME : '#aaa' }} />,
        href: `/tournament/${id}/matches`,
        alias: TAB_OPTIONS.TOURNAMENT_MANAGER.MATCHES
      },
      {
        name: 'จัดการ',
        icon: <TableOutlined style={{ fontSize: '24px', color: activeMenu === TAB_OPTIONS.TOURNAMENT_MANAGER.MANAGE ? COLOR.MINOR_THEME : '#aaa' }} />,
        href: `/tournament/${id}/manage`,
        alias: TAB_OPTIONS.TOURNAMENT_MANAGER.MANAGE
      },
      {
        name: 'ตั้งค่า',
        icon: <SettingOutlined style={{ fontSize: '24px', color: activeMenu === TAB_OPTIONS.TOURNAMENT_MANAGER.SETTING ? COLOR.MINOR_THEME : '#aaa' }} />,
        href: `/tournament/${id}/setting`,
        alias: TAB_OPTIONS.TOURNAMENT_MANAGER.SETTING
      },
    ]
  }

  return (
    <>
      <Header description='โปรแกรมแข่งขันแบดมินตัน' back={{ href: '/', alias: 'tournament' }} />
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