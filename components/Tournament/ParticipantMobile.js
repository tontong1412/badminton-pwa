import { Tag, Input, Checkbox, Collapse } from "antd"
import { TRANSACTION, EVENT, COLOR } from "../../constant"
import Image from "next/image"
import { useState, useEffect } from "react"
import moment from 'moment'

const statusOptions = [
  {
    label: 'ผ่าน',
    value: 'approved',
  },
  {
    label: 'ไม่ผ่าน',
    value: 'rejected',
  },
  {
    label: 'รอประเมิน',
    value: 'idle',
  }
]
const paymentStatusOption = [
  {
    label: 'จ่ายแล้ว',
    value: 'paid',
  },
  {
    label: 'รอยืนยัน',
    value: 'pending',
  },
  {
    label: 'ยังไม่จ่าย',
    value: 'idle',
  }
]

const ParticipantMobile = ({ dataSource, isManager, onUpdateTeam, handicap }) => {
  const [displayParticipants, setDisplayParticipants] = useState(dataSource)

  useEffect(() => {
    setDisplayParticipants(dataSource.sort((a, b) => moment(b.date).diff(moment(a.date))))
  }, [dataSource])

  const onSearch = (value) => {
    const searchTextLower = value.toLowerCase().trim()
    const searchParticipant = dataSource.filter(t => t.allow.team.team.players.some(p =>
      p.officialName?.toLowerCase().includes(searchTextLower) ||
      p.club?.toLowerCase().includes(searchTextLower)
    )).sort((a, b) => moment(b.date).diff(moment(a.date)))
    setDisplayParticipants(searchParticipant)
  }

  const onFilterStatus = (checkedValues) => {
    const filterParticipant = [...dataSource].filter(t =>
      checkedValues.includes(t.payment.team.status)
    ).sort((a, b) => moment(b.date).diff(moment(a.date)))
    setDisplayParticipants(filterParticipant)
  }

  const onFilterPaymentStatus = (checkedValues) => {
    const filterParticipant = [...dataSource].filter(t =>
      checkedValues.includes(t.payment.team.paymentStatus)
    ).sort((a, b) => moment(b.date).diff(moment(a.date)))
    setDisplayParticipants(filterParticipant)
  }
  return (
    <div style={{ margin: '10px' }}>

      <Input.Search
        allowClear
        enterButton="Search"
        placeholder='ค้นหาโดยชื่อผู้เข้าแข่งขัน หรือ ชื่อทีม'
        onSearch={onSearch} />

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ width: '300px' }}>
          <Collapse ghost accordion expandIconPosition='center'>
            <Collapse.Panel header="Filter Options">
              <Checkbox.Group options={statusOptions} defaultValue={statusOptions.map(e => e.value)} onChange={onFilterStatus} />
              <Checkbox.Group options={paymentStatusOption} defaultValue={paymentStatusOption.map(e => e.value)} onChange={onFilterPaymentStatus} />
            </Collapse.Panel>
          </Collapse>
        </div>
        <div style={{ width: '120px' }}>
          <div style={{ margin: '0 10px' }}>{`ทั้งหมด ${displayParticipants.length} คู่`}</div>
        </div>
      </div>

      {displayParticipants.map(p =>
        <div key={p.key}
          style={{
            minWidth: '350px',
            maxWidth: '400px',
            marginBottom: '10px',
            flexDirection: 'column',
            borderRadius: '10px',
            boxShadow: '2px 2px 10px -5px rgba(0,0,0,0.75)',
          }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '15px', borderBottom: '1px solid #eee' }}>
            <div>รายการ {p.event}</div>
            <div style={{ display: 'flex' }}>
              {/* หยวนๆได้ +1 */}
              {(handicap && (p.handicap || p.handicap === 0)) && <Tag color={p.handicap > 0 ? 'orange' : 'green'}>{`${p.handicap > 0 ? '+' : ''}${p.handicap}`}</Tag>}

              <Tag color={EVENT.TEAM_STATUS[p.payment.team.status].COLOR}>{EVENT.TEAM_STATUS[p.payment.team.status].LABEL}</Tag>
              <Tag color={TRANSACTION[p.payment.text].COLOR}> {TRANSACTION[p.payment.text].LABEL}</Tag>
            </div>
          </div>
          <div style={{ padding: '15px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>{p.player}</div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <Image alt='icon' src='/icon/shuttlecock.png' width={20} height={20} />
                <div>{p.shuttlecockRemain}</div>
              </div>
            </div>
            {(p?.note?.note || p?.note?.isInQueue) && <div>{`หมายเหตุ: ${p?.note?.isInQueue ? 'สำรอง' : ''}${p?.note?.isInQueue && p?.note?.note ? ',' : ''}${p?.note?.note || ''}`}</div>}
          </div>

          {isManager &&
            <div style={{ borderTop: '1px solid #eee', textAlign: 'center', padding: '5px 0', width: '100%', display: 'flex', justifyContent: 'space-between' }}>
              {p.payment.team.status === 'idle' && <div onClick={() => onUpdateTeam(p.allow.event._id, p.allow.team._id, 'status', 'approved')} style={{ width: '100%', borderRight: '1px solid #eee' }}>ผ่าน</div>}
              {p.payment.team.status === 'idle' && <div onClick={() => onUpdateTeam(p.allow.event._id, p.allow.team._id, 'status', 'rejected')} style={{ width: '100%', borderRight: '1px solid #eee' }}>ไม่ผ่าน</div>}
              <div style={{ width: '100%' }}>{p.action}</div>
            </div>}
        </div>
      )
      }
    </div >
  )
}
export default ParticipantMobile