import { useTournament } from "../../../utils"
import { Tabs } from 'antd'

import { useState } from "react"
import EventTab from "./EventTab"

const Draw = (props) => {
  const { tournament } = useTournament(props.tournamentID)
  const [mode, setMode] = useState('group')
  const [tab, setTab] = useState(tournament?.events[0]._id)

  return <div>
    <Tabs
      defaultActiveKey={tab}
      activeKey={tab}
      onChange={(key) => {
        setTab(key)
        setMode('knockOut')
      }}
    >
      {tournament?.events?.map(event => {
        return (
          <Tabs.TabPane key={event._id} tab={event.name} style={{ position: 'relative' }}>
            <EventTab key={event._id} eventID={event._id} mode={mode} setMode={setMode} />
          </Tabs.TabPane>
        )
      })}
    </Tabs >
  </div >
}
export default Draw