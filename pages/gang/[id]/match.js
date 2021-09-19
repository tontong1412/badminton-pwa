import { useState } from 'react'
import { useSWRConfig } from 'swr'
import { Modal } from 'antd'
import axios from 'axios'
import Image from 'next/image'
import { useRouter } from 'next/router'
import Layout from '../../../components/Layout/gang'
import AddButton from '../../../components/addButton'
import { useGang } from '../../../utils'
import { API_ENDPOINT } from '../../../config'

const MatchList = () => {
  const router = useRouter()
  const { id } = router.query
  const { mutate } = useSWRConfig()
  const { gang, isLoading, isError } = useGang(id)
  const addShuttlecock = (matchID) => {
    // update the local data immediately, but disable the revalidation
    // mutate(`${API_ENDPOINT}/gang/${id}`, { ...gang, name: newName }, false)
    axios.post(`${API_ENDPOINT}/match/manage-shuttlecock`, {
      matchID,
      action: "increment"
    }).then(() => {
      mutate(`${API_ENDPOINT}/gang/${id}`)
    }).catch(() => {
      Modal.error({
        title: 'ผิดพลาด',
        content: (
          <div>
            <p>เกิดปัญหาขณะอัพเดทข้อมูล กรุณาลองใหม่ในภายหลัง</p>
          </div>
        ),
        onOk() { },
      })
    })
  }
  if (isError) return "An error has occurred."
  if (isLoading) return "Loading..."
  return (
    <div>
      {
        gang.queue.map(match => {
          return (
            <div key={match._id} className='match-card'>
              <div className='team-container'>
                <div className='team'>
                  {match.teamA.team.players.map(player => {
                    return (
                      <div key={player._id} className='player-container'>
                        <div className='avatar'>
                          <Image src='/avatar.png' alt='' width={40} height={40} />
                        </div>
                        <div className='info'>{player.displayName}</div>
                      </div>
                    )
                  })}
                </div>
                <div className='team'>
                  {match.teamB.team.players.map(player => {
                    return (
                      <div key={player._id} className='player-container'>
                        <div className='avatar'>
                          <Image src='/avatar.png' alt='' width={40} height={40} />
                        </div>
                        <div className='info'>{player.displayName}</div>
                      </div>
                    )
                  })}
                </div>
              </div>
              <div>
                <div style={{ width: '50%' }}>จำนวนลูก: {match.shuttlecockUsed}</div>
              </div>
              <div className='controller-container'>
                <div className='controller'>แก้ไข</div>
                <div className='controller' onClick={() => addShuttlecock(match._id)}>เพิ่มลูก</div>
                <div className='controller'>จบเกม</div>
              </div>
            </div>
          )
        })
      }
      <AddButton />
    </div >
  )
}
MatchList.getLayout = (page) => {
  return (
    <Layout>
      {page}
    </Layout>
  )
}
export default MatchList