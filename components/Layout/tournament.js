import { useRouter } from 'next/router'
import Footer from './footer'
import Header from './header'
import { UnorderedListOutlined, TeamOutlined, SettingOutlined, SearchOutlined } from '@ant-design/icons'
import { useSelector } from 'react-redux'
import { COLOR, TAB_OPTIONS } from '../../constant'
import { useGang } from '../../utils'

const TournamentLayout = (props) => {
  const router = useRouter()
  const { id } = router.query
  const { user, activeMenu } = useSelector(state => state)
  const { gang } = useGang(id)
  let tabOptions = [
    {
      name: 'ข้อมูล',
      icon: <SearchOutlined style={{ fontSize: '24px', color: activeMenu === TAB_OPTIONS.GANG.DETAIL ? COLOR.MINOR_THEME : '#aaa' }} />,
      href: `/tournament/${id}`,
      alias: TAB_OPTIONS.GANG.DETAIL
    },
    {
      name: 'รายชื่อ/สาย',
      icon: <TeamOutlined style={{ fontSize: '24px', color: activeMenu === TAB_OPTIONS.GANG.PLAYERS ? COLOR.MINOR_THEME : '#aaa' }} />,
      href: `/tournament/${id}/player`,
      alias: TAB_OPTIONS.GANG.PLAYERS
    },
    {
      name: 'รายการแข่งขัน',
      icon: <UnorderedListOutlined style={{ fontSize: '24px', color: activeMenu === TAB_OPTIONS.GANG.QUEUE ? COLOR.MINOR_THEME : '#aaa' }} />,
      href: `/tournament/${id}/match`,
      alias: TAB_OPTIONS.GANG.QUEUE
    }
  ]

  return (
    <>
      <Header description='รายการแข่งขันแบดมินตันในประเทศไทย' back={{ href: '/tournament', alias: 'tournament' }} />
      <main>
        <div className='content'>
          {props.children}
        </div>
      </main>
      <Footer tabOption={tabOptions} />
    </>
  )
}
export default TournamentLayout