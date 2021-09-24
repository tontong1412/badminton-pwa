import { useRouter } from 'next/router'
import Footer from './footer'
import Header from './header'
import { UnorderedListOutlined, TeamOutlined, SettingOutlined } from '@ant-design/icons'
import { useSelector } from 'react-redux'

const GangLayout = (props) => {
  const router = useRouter()
  const { id } = router.query
  const { user } = useSelector(state => state)
  const tabOption = [
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
  ]
  if (user.id) {
    tabOption.push({
      name: 'จัดการก๊วน',
      icon: <SettingOutlined style={{ fontSize: '24px' }} />,
      href: `/gang/${id}`
    })
  }
  return (
    <>
      <Header description='This is Home Page' backHref='/gang' />
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