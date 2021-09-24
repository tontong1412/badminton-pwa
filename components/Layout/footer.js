import Link from 'next/link'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'


const Footer = ({ tabOption }) => {
  const { activeMenu } = useSelector(state => state)
  const dispatch = useDispatch()
  return (
    <div className='footer'>
      {tabOption.map(tab => {
        return (
          <Link passHref href={tab.href} key={`tab-${tab.name}`}>
            <div
              className='footer-tab'
              onClick={() => dispatch({ type: 'ACTIVE_MENU', payload: tab.alias })}
            >
              {tab.icon}
              <div
                style={{
                  fontSize: '12px',
                  paddingTop: '5px',
                  color: activeMenu === tab.alias ? '#DAA228' : null
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