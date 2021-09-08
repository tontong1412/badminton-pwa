import Link from 'next/link'
import { UserOutlined, BellOutlined, HomeOutlined, TeamOutlined } from '@ant-design/icons';
const Footer = () => {
  const tabOption = [
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
  ]
  return (
    <div className='footer'>
      {tabOption.map(tab => {
        return (
          <Link passHref href={tab.href} key={`tab-${tab.name}`}>
            <div className='footer-tab'>
              {tab.icon}
              <div style={{ fontSize: '12px', paddingTop: '5px' }}>{tab.name}</div>
            </div>
          </Link>
        )
      })}
    </div>
  )
}
export default Footer