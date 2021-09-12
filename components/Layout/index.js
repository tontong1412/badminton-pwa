import Footer from './footer'
import Header from './header'
import { UserOutlined, BellOutlined, HomeOutlined, TeamOutlined } from '@ant-design/icons'

const AppLayout = (props) => {
  return (
    <>
      <Header description='This is Home Page' />
      <main>{props.children}</main>
      <Footer tabOption={[
        {
          name: 'Home',
          icon: <HomeOutlined style={{ fontSize: '24px' }} />,
          href: '/'
        },
        {
          name: 'Gang',
          icon: <TeamOutlined style={{ fontSize: '24px' }} />,
          href: '/gang'
        },
        {
          name: 'Notifications',
          icon: <BellOutlined style={{ fontSize: '24px' }} />,
          href: '/noti'
        },
        {
          name: 'My Account',
          icon: <UserOutlined style={{ fontSize: '24px' }} />,
          href: '/account'
        }
      ]} />
    </>
  )
}
export default AppLayout