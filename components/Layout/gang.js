import { useRouter } from 'next/router'
import Footer from './footer'
import Header from './header'
import { UnorderedListOutlined, TeamOutlined, SettingOutlined } from '@ant-design/icons'
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
      name: 'รายชื่อ',
      icon: <TeamOutlined style={{ fontSize: '24px', color: activeMenu === TAB_OPTIONS.GANG.PLAYERS ? COLOR.MINOR_THEME : '#aaa' }} />,
      href: `/gang/${id}`,
      alias: TAB_OPTIONS.GANG.PLAYERS
    },
    {
      name: 'คิว',
      icon: <UnorderedListOutlined style={{ fontSize: '24px', color: activeMenu === TAB_OPTIONS.GANG.QUEUE ? COLOR.MINOR_THEME : '#aaa' }} />,
      href: `/gang/${id}/match`,
      alias: TAB_OPTIONS.GANG.QUEUE
    }
  ]
  if (user.playerID === gang?.creator?._id) {
    tabOptions = [
      {
        name: 'รายชื่อ',
        icon: <TeamOutlined style={{ fontSize: '24px', color: activeMenu === TAB_OPTIONS.GANG.PLAYERS ? COLOR.MINOR_THEME : '#aaa' }} />,
        href: `/gang/${id}`,
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
      <Header description='This is Home Page' back={{ href: '/gang', alias: 'gang' }} />
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