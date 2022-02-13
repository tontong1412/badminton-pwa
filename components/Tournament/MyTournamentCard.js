import Link from 'next/link'
import Image from 'next/image'
import { useDispatch } from 'react-redux'

const MyTournamentCard = ({ tournament }) => {
  const dispatch = useDispatch()
  return (
    <Link
      href={`/tournament/${tournament._id}`}
      passHref
    >
      <div
        style={{
          width: '80px',
          marginLeft: '5px'
        }}>
        <div style={{ width: '80px', height: '80px', border: '1px solid #eee', borderRadius: '40px', overflow: 'hidden' }}>
          <Image
            src={tournament?.logo || '/icon/logo.png'}
            alt=''
            width={80}
            height={80}
            objectFit='cover'
            fill='responsive'
          />
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ height: '50px', textOverflow: 'ellipsis', overflow: 'hidden' }}>{tournament.name}</div>
        </div>
      </div>
    </Link >
  )
}
export default MyTournamentCard