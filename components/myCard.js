import Link from 'next/link'
import Image from 'next/image'
import { useDispatch } from 'react-redux'

const MyCard = ({ gang }) => {
  const dispatch = useDispatch()
  const info = [
    {
      icon: '/icon/badminton-court.png',
      text: gang.courtFee.type === 'share' ? 'share' : gang.courtFee.amount
    },
    {
      icon: '/icon/shuttlecock.png',
      text: gang.shuttlecockFee
    }
  ]
  return (
    <Link
      href={`/gang/${gang._id}`}
      passHref
    >
      <div
        style={{
          width: '80px',
          marginLeft: '5px'
        }}
        onClick={() => {
          dispatch({ type: 'GANG', payload: gang })
          dispatch({ type: 'ACTIVE_MENU', payload: 'players' })
        }}>
        <div style={{ width: '80px', height: '80px', border: '1px solid #eee', borderRadius: '40px', overflow: 'hidden' }}>
          <Image
            src='/icon/logo.png'
            alt=''
            width={80}
            height={80}
            objectFit='cover'
            fill='responsive'
          />
        </div>
        <div style={{ textAlign: 'center' }}>
          <div>{gang.name}</div>
        </div>
      </div>
    </Link >
  )
}
export default MyCard