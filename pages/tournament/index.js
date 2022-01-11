
import { useEffect } from 'react'
import { analytics, logEvent } from '../../utils/firebase'
import { useSelector, useDispatch } from 'react-redux'
import Layout from '../../components/Layout'
import { TAB_OPTIONS } from '../../constant'
import { useTournaments } from '../../utils'
import Image from 'next/image'
import Link from 'next/link'
const Tournament = () => {
  const dispatch = useDispatch()
  const { tournaments } = useTournaments()
  useEffect(() => {
    logEvent(analytics, 'tournament')
    dispatch({ type: 'ACTIVE_MENU', payload: TAB_OPTIONS.TOURNAMENT })
  }, [])
  return (
    <Layout >
      <div style={{ padding: '5px' }}>
        {tournaments?.map(tournament => {
          return (
            <Link
              href={`/tournament/${tournament._id}`}
              passHref
              key={tournament._id}
            >
              <div style={{
                display: 'flex',
                height: '200px',
                borderRadius: '10px',
                border: '1px solid #ddd',
                boxShadow: '2px 2px 10px -5px rgba(0,0,0,0.75)',
                overflow: 'hidden',
                marginBottom: '5px'
              }}>
                <div>
                  <Image
                    src='/icon/logo.png'
                    alt=''
                    width={150}
                    height={120}
                    objectFit='cover'
                  />
                </div>
                <div>{tournament.name}</div>
              </div>
            </Link>
          )
        })}
      </div>
    </Layout >
  )
}
export default Tournament