
import Image from "next/image"
import Link from 'next/link'
import { EnvironmentOutlined } from '@ant-design/icons'
import { Divider, Tag, Carousel } from "antd"
import { useSelector } from 'react-redux'
import { useTournaments } from "../../utils"
import moment from 'moment'
import { MAP_TOURNAMENT_STATUS, TAB_OPTIONS } from '../../constant'

const Banner = (props, ref) => {
  const user = useSelector(state => state.user)
  const { tournaments } = useTournaments()


  if (!tournaments || tournaments.filter(t => t.status === 'register').length === 0) return <div />

  return (
    <Carousel>
      <Link
        href={'www.google.com'}
        passHref
      >
        <div style={{
          minWidth: '350px',
          height: '150px',
          margin: '10px',
          borderRadius: '10px',
          boxShadow: '2px 2px 10px -5px rgba(0,0,0,0.75)',
        }}>
          <Image
            src={'/banner/placeholder.png'}
            alt=''
            width={400}
            height={150}
            objectFit='contain'
          // layout='responsive'
          />
        </div>
      </Link>
      <Link
        href={'www.google.com'}
        passHref
      >
        <div style={{
          minWidth: '350px',
          height: '150px',
          margin: '10px',
          borderRadius: '10px',
          boxShadow: '2px 2px 10px -5px rgba(0,0,0,0.75)',
          backgroundColor: 'pink'
        }}>

        </div>
      </Link>
      {/* {tournaments?.length > 0 && tournaments
        .filter(e => e.status === 'register')
        .sort((a, b) => b.startDate > a.startDate ? -1 : 1)
        ?.map(tournament => {
          return (

            <Link
              href={`/tournament/${tournament._id}`}
              passHref
              key={tournament._id}
            >
              <div style={{
                minWidth: '350px',
                height: '150px',
                // width: '100%',
                maxWidth: '400px',
                margin: '10px',
                borderRadius: '10px',
                boxShadow: '2px 2px 10px -5px rgba(0,0,0,0.75)',
                padding: '10px',
                gap: '10px',
                alignItems: "center"
              }}>
                <Image
                  src={'/banner/placeholder.png'}
                  alt=''
                  width={120}
                  height={120}
                  objectFit='contain'
                  layout='responsive'
                />
              </div>
            </Link>
          )
        })
      } */}
    </Carousel >
  )

}
export default Banner