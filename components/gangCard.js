import Link from 'next/link'
import Image from 'next/image'
import { useDispatch } from 'react-redux'
import { EnvironmentOutlined } from '@ant-design/icons';

const Card = ({ gang }) => {
  const dispatch = useDispatch()
  const info = [
    {
      icon: '/icon/badminton-court.png',
      text: gang.courtFee.type === 'share' ? 'share' : gang.courtFee.amount
    },
    {
      icon: '/icon/shuttlecock.png',
      text: gang?.shuttlecockFee
    }
  ]
  return (
    <Link
      href={`/gang/${gang._id}`}
      passHref
    >
      <div className='gang-card' onClick={() => {
        dispatch({ type: 'GANG', payload: gang })
        dispatch({ type: 'ACTIVE_MENU', payload: 'players' })
      }}>
        <div className='gang-img'>
          <Image
            unoptimized
            src='/icon/logo.png'
            alt=''
            width={150}
            height={120}
            objectFit='cover'
          />
        </div>
        <div className='info-container'>
          <div className='gang-name'>{gang.name}</div>
          {(gang.area || gang.location) && <div className='sub-title'><EnvironmentOutlined style={{ marginRight: '5px' }} />{`${gang.area || gang.location || ''}`}</div>}
          <div className='info-item-container'>
            {
              info.map((elm, index) => {
                return (
                  <div key={`icon-${index}`} className='info-item'>
                    <Image unoptimized src={elm.icon} alt='' width={20} height={20} layout='fixed' />
                    <div className='text'>{elm.text}</div>
                  </div>
                )
              })
            }
          </div>
        </div>
      </div>
    </Link >
  )
}
export default Card