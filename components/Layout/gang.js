import { useRouter } from 'next/router'
import Footer from './footer'
import Header from './header'
import { UnorderedListOutlined, TeamOutlined } from '@ant-design/icons'

const GangLayout = (props) => {
  const router = useRouter()
  const { id } = router.query
  return (
    <>
      <Header description='This is Home Page' backHref='/gang' />
      <main>{props.children}</main>
      <Footer tabOption={[
        {
          name: 'รายชื่อ',
          icon: <TeamOutlined style={{ fontSize: '24px' }} />,
          href: `/gang/${id}`
        },
        {
          name: 'คิว',
          icon: <UnorderedListOutlined style={{ fontSize: '24px' }} />,
          href: `/gang/${id}/match`
        }
      ]} />
    </>
  )
}
export default GangLayout