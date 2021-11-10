import Footer from './footer'
import Header from './header'
import { useSelector } from 'react-redux'
import { UserOutlined, BellOutlined, HomeOutlined, TeamOutlined } from '@ant-design/icons'
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
        // {
        //   name: 'หน้าแรก',
        //   icon: <HomeOutlined style={{ fontSize: '24px', color: activeMenu === 'home' ? COLOR.MINOR_THEME : '#aaa' }} />,
        //   href: '/',
        //   alias: 'home'
        // },
        {
          name: 'ก๊วน',
          icon: <TeamOutlined style={{ fontSize: '24px', color: activeMenu === 'gang' ? COLOR.MINOR_THEME : '#aaa' }} />,
          href: '/gang',
          alias: 'gang'
        },
        // {
        //   name: 'แจ้งเตือน',
        //   icon: <BellOutlined style={{ fontSize: '24px', color: activeMenu === 'noti' ? '#DAA228' : '#aaa' }} />,
        //   href: '/noti',
        //   alias: 'noti'
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