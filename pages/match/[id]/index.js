import Layout from '../../../components/Layout/noFooter'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useMatch, useTournament, useSocket } from '../../../utils'
import Loading from '../../../components/loading'
import { useDispatch, useSelector } from 'react-redux'
import { COLOR, TAB_OPTIONS } from '../../../constant'
import { useState } from 'react'
import Image from 'next/image'
import request from '../../../utils/request'
import { SwapOutlined } from '@ant-design/icons'
import { Modal } from 'antd'


const Match = () => {
  const router = useRouter()
  const { id } = router.query
  const { match, isLoading, isError, mutate } = useMatch(id)
  const dispatch = useDispatch()
  const { user } = useSelector(state => state)
  const socket = useSocket()
  const [isUmpire, setIsUmpire] = useState(false)
  const [side, setSide] = useState(true)
  useEffect(() => {
    dispatch({ type: 'ACTIVE_MENU', payload: TAB_OPTIONS.TOURNAMENT_MANAGER.DETAIL })
  }, [])

  useEffect(() => {
    if (user && match && (user.playerID === match.umpire)) {
      setIsUmpire(true)
    } else {
      setIsUmpire(false)
    }
    console.log(match)
  }, [user, match])

  useEffect(() => {
    const handleEvent = (payload) => {
      mutate()
    }
    if (socket) {
      socket.on('update-match', handleEvent)
    }
  }, [socket])


  const updateScore = (team) => {
    let payload
    if (team === 'A') {
      const currentScore = match.teamA.score
      let teamBReceiver
      if (match.teamB.score % 2 === 0 && (currentScore + 1) % 2 === 0) {
        teamBReceiver = match.teamB.serving
      } else if (match.teamB.score % 2 === 1 && (currentScore + 1) % 2 === 1) {
        teamBReceiver = match.teamB.serving
      } else {
        teamBReceiver = Math.abs(match.teamB.serving - 1)
      }
      payload = {
        $inc: { 'teamA.score': 1 },
        'teamA.serving': match.teamA.isServing ? match.teamA.serving : Math.abs(match.teamA.serving - 1),
        'teamA.receiving': null,
        'teamB.receiving': teamBReceiver,
        'teamA.isServing': true,
        'teamB.isServing': false
      }
    } else {
      const currentScore = match.teamB.score
      let teamAReceiver
      if (match.teamA.score % 2 === 0 && (currentScore + 1) % 2 === 0) {
        teamAReceiver = match.teamA.serving
      } else if (match.teamA.score % 2 === 1 && (currentScore + 1) % 2 === 1) {
        teamAReceiver = match.teamA.serving
      } else {
        teamAReceiver = Math.abs(match.teamA.serving - 1)
      }
      payload = {
        $inc: { 'teamB.score': 1 },
        'teamB.serving': match.teamB.isServing ? match.teamB.serving : Math.abs(match.teamB.serving - 1),
        'teamB.receiving': null,
        'teamA.receiving': teamAReceiver,
        'teamB.isServing': true,
        'teamA.isServing': false
      }
    }
    request.put(`/match/${id}`, payload)
      .then(res => { })
      .catch(err => console.log(err))
  }

  const endGame = async () => {
    if (match.teamA.score === match.teamB.score) {
      Modal.info({ title: 'ไม่สามารถจบเกมได้เนื่องจากไม่มีผู้ชนะ' })
      return
    }
    const scoreLabel = [...match.scoreLabel]
    scoreLabel.push(`${match.teamA.score}-${match.teamB.score}`)
    await request.post('/match/set-score', {
      matchID: id,
      score: scoreLabel,
      status: scoreLabel.length < (match.step === 'group' ? 2 : 3) ? 'playing' : 'finished'
    })
    await request.put(`/match/${id}`, {
      'teamA.score': 0,
      'teamB.score': 0,
      'teamA.isServing': match.teamA.score > match.teamB.score,
      'teamB.isServing': match.teamB.score > match.teamA.score
    })
    setSide(!side)
  }



  if (isLoading) return <Loading />
  if (isError) return <p>error</p>


  return (
    <Layout>
      <div style={{
        padding: '20px',
        height: (typeof window !== "undefined") ? window.innerHeight - 60 : 400,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around',
        maxWidth: '1000px',
        margin: 'auto'

      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: side ? 'row-reverse' : 'row' }}>
          <div style={{ width: '35%' }}>
            {match?.teamA.team.players.map((player, index) => {
              return (
                <div
                  key={`teamA-${player._id}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    marginBottom: '5px',
                    fontSize: '24px',
                    flexDirection: side ? 'row-reverse' : 'row'
                  }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '20px', overflow: 'hidden', objectFit: 'contain' }}>
                    <Image src={player.photo || `/avatar.png`} alt='' width={40} height={40} objectFit='cover' />
                  </div>
                  <div>{player.displayName || player.officialName}</div>
                  {match.teamA.serving === index && match.teamA.isServing && <div style={{ padding: '2px 5px', backgroundColor: COLOR.MAIN_THEME, borderRadius: '5px' }}>S</div>}
                  {match.teamA.receiving === index && <div style={{ padding: '2px 5px', backgroundColor: COLOR.MAIN_THEME, borderRadius: '5px' }}>R</div>}
                </div>
              )
            })}
          </div>
          <div style={{
            width: '20%',
            textAlign: 'center',
            fontSize: '50px',
            display: 'flex',
            justifyContent: 'space-between',
            flexDirection: side ? 'row-reverse' : 'row'
          }}>
            <div style={{ width: 65 }}>{match.teamA.score}</div>
            <div style={{ width: 20 }}>-</div>
            <div style={{ width: 65 }}>{match.teamB.score}</div>
          </div>
          <div style={{ width: '35%' }}>
            {match?.teamB.team.players.map((player, index) => {
              return (
                <div
                  key={`teamB-${player._id}`}
                  style={{
                    flexDirection: side ? 'row' : 'row-reverse',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    marginBottom: '5px',
                    fontSize: '24px'
                  }}
                >
                  <div style={{ width: '40px', height: '40px', borderRadius: '20px', overflow: 'hidden', objectFit: 'contain' }}>
                    <Image src={player.photo || `/avatar.png`} alt='' width={40} height={40} objectFit='cover' />
                  </div>
                  <div className='info' style={{ marginRight: '5px', marginLeft: 0, textAlign: 'right' }}>{player.displayName || player.officialName}</div>
                  {match.teamB.serving === index && match.teamB.isServing && <div style={{ padding: '2px 5px', backgroundColor: COLOR.MAIN_THEME, borderRadius: '5px' }}>S</div>}
                  {match.teamB.receiving === index && <div style={{ padding: '2px 5px', backgroundColor: COLOR.MAIN_THEME, borderRadius: '5px' }}>R</div>}
                </div>
              )
            })}
          </div>
        </div>

        {match.scoreLabel.length < (match.step === 'group' ? 2 : 3) && <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', flexDirection: side ? 'row-reverse' : 'row' }}>
          <div style={{
            width: 100,
            height: 50,
            backgroundColor: COLOR.MINOR_THEME,
            borderRadius: 10,
            color: 'whitesmoke',
            fontSize: '50px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
            onClick={() => updateScore('A')}
          >
            +
          </div>
          <div style={{ textAlign: 'center' }}>
            <div onClick={() => setSide(!side)}>สลับข้าง</div>
            <div onClick={() => endGame()}>จบเกม</div>
            <div>undo</div>
          </div>
          <div style={{
            width: 100,
            height: 50,
            backgroundColor: COLOR.MINOR_THEME,
            borderRadius: 10,
            color: 'whitesmoke',
            fontSize: '50px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
            onClick={() => updateScore('B')}
          >
            +
          </div>
        </div>}


      </div>
    </Layout >
  )
}
export default Match