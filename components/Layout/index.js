import Footer from './footer'
import Header from './header'
import { useSelector } from 'react-redux'
import { UserOutlined, BellOutlined, HomeOutlined, TeamOutlined, TrophyOutlined, ScheduleOutlined } from '@ant-design/icons'
import { COLOR } from '../../constant'

const AppLayout = (props) => {
  const { activeMenu } = useSelector(state => state)
  return (
    <>
      <Header />
      <main>
        <div className='content'>
          {props.children}
        </div>
      </main>
      <Footer tabOption={[
        {
          name: 'หน้าแรก',
          icon: <HomeOutlined style={{ fontSize: '24px', color: activeMenu === 'home' ? COLOR.MINOR_THEME : '#aaa' }} />,
          href: '/',
          alias: 'home'
        },
        {
          name: 'จองสนาม',
          icon: <ScheduleOutlined style={{ fontSize: '24px', color: activeMenu === 'venue' ? COLOR.MINOR_THEME : '#aaa' }} />,
          href: '/venue',
          alias: 'venue',
        },
        {
          name: 'ก๊วน',
          icon: <TeamOutlined style={{ fontSize: '24px', color: activeMenu === 'gang' ? COLOR.MINOR_THEME : '#aaa' }} />,
          href: '/gang',
          alias: 'gang'
        },
        {
          name: 'รายการแข่ง',
          icon: <TrophyOutlined style={{ fontSize: '24px', color: activeMenu === 'tournament' ? COLOR.MINOR_THEME : '#aaa' }} />,
          href: '/tournament',
          alias: 'tournament'
        },
        // {
        //   name: 'แจ้งเตือน',
        //   icon: <BellOutlined style={{ fontSize: '24px', color: activeMenu === 'noti' ? COLOR.MINOR_THEME : '#aaa' }} />,
        //   href: '/noti',
        //   alias: 'noti',
        //   notiCount: 2
        // },
        {
          name: 'บัญชีของฉัน',
          icon: <UserOutlined style={{ fontSize: '24px', color: activeMenu === 'account' ? COLOR.MINOR_THEME : '#aaa' }} />,
          href: '/account',
          alias: 'account'
        }
      ]} />
    </>
  )
}
export default AppLayout