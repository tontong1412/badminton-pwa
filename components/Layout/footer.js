import Link from 'next/link'
import { useSelector } from 'react-redux'
import { COLOR } from '../../constant'
import { Badge } from 'antd'

const Footer = ({ tabOption }) => {
  const { activeMenu } = useSelector(state => state)
  return (
    <div className='footer noprint'>

      {tabOption.map(tab => {
        return (
          <Link passHref href={tab.href} key={`tab-${tab.name}`}>

            <div className='footer-tab'>
              <Badge count={tab.notiCount}>
                {tab.icon}
              </Badge>
              <div
                style={{
                  fontSize: '12px',
                  paddingTop: '5px',
                  color: activeMenu === tab.alias ? COLOR.MINOR_THEME : '#aaa'
                }}>
                {tab.name}
              </div>

            </div>
          </Link>
        )
      })}

    </div >
  )
}
export default Footer