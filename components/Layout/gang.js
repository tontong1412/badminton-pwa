import Footer from './footer'
import Header from './header'
import { UnorderedListOutlined, TeamOutlined } from '@ant-design/icons'

const GangLayout = (props) => {
  return (
    <>
      <Header description='This is Home Page' backHref='/gang' />
      <main>{props.children}</main>
      <Footer tabOption={[
        {
          name: 'รายชื่อ',
          icon: <TeamOutlined style={{ fontSize: '24px' }} />,
          href: '/'
        },
        {
          name: 'คิว',
          icon: <UnorderedListOutlined style={{ fontSize: '24px' }} />,
          href: '/gang'
        }
      ]} />
    </>
  )
}
export default GangLayout