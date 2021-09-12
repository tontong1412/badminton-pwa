import Link from 'next/link'

const Footer = ({ tabOption }) => {
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