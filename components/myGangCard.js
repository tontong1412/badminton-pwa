import Link from 'next/link'
import Image from 'next/image'
import { useDispatch } from 'react-redux'

const MyGangCard = ({ gang }) => {
  const dispatch = useDispatch()
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
            unoptimized
            src='/icon/logo.png'
            alt=''
            width={80}
            height={80}
            objectFit='cover'
            fill='responsive'
          />
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ height: '50px', textOverflow: 'ellipsis', overflow: 'hidden' }}>{gang.name}</div>
        </div>
      </div>
    </Link >
  )
}
export default MyGangCard