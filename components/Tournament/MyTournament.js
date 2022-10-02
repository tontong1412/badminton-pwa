
import { useEffect, useState, forwardRef, useImperativeHandle } from "react"
import { Divider } from "antd"
import { useSelector } from 'react-redux'
import MyGangCard from "../myGangCard"
import request from "../../utils/request"
import { useMyTournament } from "../../utils"
import MyTournamentCard from "./MyTournamentCard"
import MyTournamentCardHomePage from "./MyTournamentCardHomePage"

const MyTournament = (props, ref) => {
  const user = useSelector(state => state.user)
  const { tournaments, mutate } = useMyTournament(user.token)

  if (!tournaments || tournaments.length <= 0) return <div />

  return (
    <div>
      {tournaments.filter(e => e.status !== 'finish').length > 0 && <div style={{ margin: '20px 20px 0 20px' }}>รายการแข่งของฉัน</div>}
      <div style={{
        overflowX: 'scroll',
        overflowY: 'hidden',
        display: 'flex',
        marginLeft: '5px'
      }}>
        {tournaments?.length > 0 && tournaments
          .filter(e => e.status !== 'finish')
          .sort((a, b) => b.startDate > a.startDate ? -1 : 1)
          ?.map(tournament => {
            if (props.homePage) {
              return <MyTournamentCardHomePage
                key={`mygang-card-${tournament._id}`}
                tournament={tournament}
                style={{ float: 'right' }}
                mutate={mutate} />
            }
            return <MyTournamentCard
              key={`mygang-card-${tournament._id}`}
              tournament={tournament}
              style={{ float: 'right' }} />
          })
        }
      </div>
      {props.bottomLine && <Divider />}
    </div>
  )

}
export default forwardRef(MyTournament)