import Footer from './footer'
import Header from './header'
import { UnorderedListOutlined, TeamOutlined } from '@ant-design/icons'
import { useSelector } from 'react-redux'

const GangLayout = (props) => {
  const { gang } = useSelector(state => state)
  return (
    <>
      <Header description='This is Home Page' backHref='/gang' />
      <main>{props.children}</main>
      <Footer tabOption={[
        {
          name: 'รายชื่อ',
          icon: <TeamOutlined style={{ fontSize: '24px' }} />,
          href: `/gang/${gang._id}`
        },
        {
          name: 'คิว',
          icon: <UnorderedListOutlined style={{ fontSize: '24px' }} />,
          href: `/gang/${gang._id}/match`
        }
      ]} />
    </>
  )
}
export default GangLayout