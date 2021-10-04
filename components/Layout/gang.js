import { useRouter } from 'next/router'
import Footer from './footer'
import Header from './header'
import { UnorderedListOutlined, TeamOutlined, SettingOutlined } from '@ant-design/icons'
import { useSelector } from 'react-redux'
import { COLOR } from '../../constant'

const GangLayout = (props) => {
  const router = useRouter()
  const { id } = router.query
  const { user, activeMenu, gang } = useSelector(state => state)
  const tabOption = [
    {
      name: 'รายชื่อ',
      icon: <TeamOutlined style={{ fontSize: '24px', color: activeMenu === 'players' ? COLOR.MINOR_THEME : null }} />,
      href: `/gang/${id}`,
      alias: 'players'
    },
    {
      name: 'คิว',
      icon: <UnorderedListOutlined style={{ fontSize: '24px', color: activeMenu === 'queue' ? COLOR.MINOR_THEME : null }} />,
      href: `/gang/${id}/match`,
      alias: 'queue'
    }
  ]
  if (user.playerID === gang?.creator?._id) {
    tabOption.push({
      name: 'จัดการก๊วน',
      icon: <SettingOutlined style={{ fontSize: '24px', color: activeMenu === 'setting' ? COLOR.MINOR_THEME : null }} />,
      href: `/gang/${id}/manage`,
      alias: 'setting'
    })
  }
  return (
    <>
      <Header description='This is Home Page' back={{ href: '/gang', alias: 'gang' }} />
      <main>
        <div className='content'>
          {props.children}
        </div>
      </main>
      <Footer tabOption={tabOption} />
    </>
  )
}
export default GangLayout