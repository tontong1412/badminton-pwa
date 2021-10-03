import Footer from './footer'
import Header from './header'
import { useSelector } from 'react-redux'
import { UserOutlined, BellOutlined, HomeOutlined, TeamOutlined } from '@ant-design/icons'

const AppLayout = (props) => {
  const { activeMenu } = useSelector(state => state)
  return (
    <>
      <Header description='This is Home Page' />
      <main>
        <div className='content'>
          {props.children}
        </div>
      </main>
      <Footer tabOption={[
        {
          name: 'หน้าแรก',
          icon: <HomeOutlined style={{ fontSize: '24px', color: activeMenu === 'home' ? '#DAA228' : null }} />,
          href: '/',
          alias: 'home'
        },
        {
          name: 'ก๊วน',
          icon: <TeamOutlined style={{ fontSize: '24px', color: activeMenu === 'gang' ? '#DAA228' : null }} />,
          href: '/gang',
          alias: 'gang'
        },
        // {
        //   name: 'แจ้งเตือน',
        //   icon: <BellOutlined style={{ fontSize: '24px', color: activeMenu === 'noti' ? '#DAA228' : null }} />,
        //   href: '/noti',
        //   alias: 'noti'
        // },
        {
          name: 'บัญชีของฉัน',
          icon: <UserOutlined style={{ fontSize: '24px', color: activeMenu === 'account' ? '#DAA228' : null }} />,
          href: '/account',
          alias: 'account'
        }
      ]} />
    </>
  )
}
export default AppLayout