import { useRouter } from 'next/router'
import Footer from './footer'
import Header from './header'
import { UnorderedListOutlined, TeamOutlined, SettingOutlined, SearchOutlined } from '@ant-design/icons'
import { useSelector } from 'react-redux'
import { COLOR, TAB_OPTIONS } from '../../constant'
import { useGang } from '../../utils'

const GangLayout = (props) => {
  const router = useRouter()
  const { id } = router.query
  const { user, activeMenu } = useSelector(state => state)
  const { gang } = useGang(id)
  let tabOptions = [
    {
      name: 'ข้อมูล',
      icon: <SearchOutlined style={{ fontSize: '24px', color: activeMenu === TAB_OPTIONS.GANG.DETAIL ? COLOR.MINOR_THEME : '#aaa' }} />,
      href: `/gang/${id}`,
      alias: TAB_OPTIONS.GANG.DETAIL
    },
    {
      name: 'รายชื่อ',
      icon: <TeamOutlined style={{ fontSize: '24px', color: activeMenu === TAB_OPTIONS.GANG.PLAYERS ? COLOR.MINOR_THEME : '#aaa' }} />,
      href: `/gang/${id}/player`,
      alias: TAB_OPTIONS.GANG.PLAYERS
    },
    {
      name: 'คิว',
      icon: <UnorderedListOutlined style={{ fontSize: '24px', color: activeMenu === TAB_OPTIONS.GANG.QUEUE ? COLOR.MINOR_THEME : '#aaa' }} />,
      href: `/gang/${id}/match`,
      alias: TAB_OPTIONS.GANG.QUEUE
    }
  ]
  if (user.playerID === gang?.creator?._id || gang?.managers.map(elm => elm._id).includes(user.playerID)) {
    tabOptions = [
      {
        name: 'ข้อมูล',
        icon: <SearchOutlined style={{ fontSize: '24px', color: activeMenu === TAB_OPTIONS.GANG.DETAIL ? COLOR.MINOR_THEME : '#aaa' }} />,
        href: `/gang/${id}`,
        alias: TAB_OPTIONS.GANG.DETAIL
      },
      {
        name: 'รายชื่อ',
        icon: <TeamOutlined style={{ fontSize: '24px', color: activeMenu === TAB_OPTIONS.GANG.PLAYERS ? COLOR.MINOR_THEME : '#aaa' }} />,
        href: `/gang/${id}/player`,
        alias: TAB_OPTIONS.GANG.PLAYERS
      },
      {
        name: 'คิว',
        icon: <UnorderedListOutlined style={{ fontSize: '24px', color: activeMenu === TAB_OPTIONS.GANG.QUEUE ? COLOR.MINOR_THEME : '#aaa' }} />,
        href: `/gang/${id}/match`,
        alias: TAB_OPTIONS.GANG.QUEUE
      },
      {
        name: 'จัดการก๊วน',
        icon: <SettingOutlined style={{ fontSize: '24px', color: activeMenu === TAB_OPTIONS.GANG.SETTING ? COLOR.MINOR_THEME : '#aaa' }} />,
        href: `/gang/${id}/manage`,
        alias: TAB_OPTIONS.GANG.SETTING
      }
    ]
  }

  return (
    <>
      <Header description='จัดก๊วนแบดมินตันง่ายๆ ทั้งจัดคิว คิดเงิน และเก็บสถิติ ด้วย Badminstar' back={{ href: '/gang', alias: 'gang' }} />
      <main>
        <div className='content'>
          {props.children}
        </div>
      </main>
      <Footer tabOption={tabOptions} />
    </>
  )
}
export default GangLayout