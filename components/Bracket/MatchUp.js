import React from 'react'
import { MATCH } from '../../constant'
import moment from 'moment'
import { useState } from 'react'
import { Modal, Form, InputNumber, DatePicker } from 'antd'
import request from '../../utils/request'

const MatchUp = ({ match, isManager }) => {
  const matchType = (match?.teamA?.team?.players?.length > 1 || match?.teamB?.team?.players?.length > 1) ? MATCH.TYPE.DOUBLE : MATCH.TYPE.SINGLE
  const [modalVisible, setModalVisible] = useState(false)
  const [form] = Form.useForm()
  const onFinish = (values) => {
    request.put(`/match/${match._id}`, values)
      .then(async () => {
        setModalVisible(false)
      })
      .catch((e) => console.log(e))
  }
  const renderMatchDetail = (match, team, teamIndex) => {
    if (match.status === 'waiting') return (
      <div className='detail-date'>
        <p>{`#${match.matchNumber}\r\n${moment(match.date).format('l')}`}</p>
      </div>
    )
    return (
      <React.Fragment>
        {match.scoreLabel.map((set, i) => <div key={i} className='detail-score'><p>{set.split('-')[teamIndex]}</p></div>)}
        {match.status === 'playing' && <div className='detail-score'><p>{match[team].score}</p></div>}
        {match.status === 'finished' && match.scoreLabel.length < 3 && Array.apply(null, Array(3 - match.scoreLabel.length)).map((i) => <div key={i} className='detail-score'><p></p></div>)}
        {match.status === 'playing' && match.scoreLabel.length < 2 && Array.apply(null, Array(2 - match.scoreLabel.length)).map((i) => <div key={i} className='detail-score'><p></p></div>)}
      </React.Fragment>
    )
  }
  return (
    <div className="matchup">
      <div className="participants" >
        {/* <div className="participants" onClick={() => setModalVisible(true)}> */}
        <div className='group'>
          <div className={`participant ${match.status === 'finished' ? match.teamA.scoreSet > match.teamB.scoreSet ? 'winner' : 'loser' : null}`}>
            {
              matchType === MATCH.TYPE.SINGLE
                ? <span>{match.teamA?.team?.players[0]?.officialName || ((match.matchNumber || match.teamA.scoreSet === 1) ? 'waiting' : 'bye')}</span>
                // <span>{match.teamA.team.players[0] ? match.teamA.team.players[0]/*.officialName*/ : 'bye'}</span> :
                : <React.Fragment>
                  <div>{match.teamA.team?.players[0]?.officialName || ((match.matchNumber || match.teamA.scoreSet === 1) ? 'waiting' : 'bye')}</div>
                  <div>{match.teamA.team?.players[1]?.officialName || ((match.matchNumber || match.teamA.scoreSet === 1) ? 'waiting' : 'bye')}</div>
                </React.Fragment>
            }
          </div>
          {
            !match.matchNumber || match.status === 'playing' || (match.scoreLabel && match.scoreLabel.length) > 0
              ? renderMatchDetail(match, 'teamA', 0)
              : <div className='detail-date'>
                <p>{`#${match.matchNumber}\r\n${moment(match.date).format('l')}`}</p>
              </div>
          }
        </div>
        <div className='group'>
          <div className={`participant ${match.status === 'finished' ? match.teamB.scoreSet > match.teamA.scoreSet ? 'winner' : 'loser' : null}`}>
            {
              matchType === MATCH.TYPE.SINGLE
                // <span>{match.teamB[0] ? match.teamB.team.players[0]/*.officialName*/ : 'bye'}</span> :
                ? <span>{match.teamB?.team?.players[0]?.officialName || ((match.matchNumber || match.teamB.scoreSet === 1) ? 'waiting' : 'bye')}</span>
                : <React.Fragment>
                  <div>{match.teamB?.team?.players[0]?.officialName || ((match.matchNumber || match.teamB.scoreSet === 1) ? 'waiting' : 'bye')} </div>
                  <div>{match.teamB?.team?.players[1]?.officialName || ((match.matchNumber || match.teamB.scoreSet === 1) ? 'waiting' : 'bye')} </div>
                </React.Fragment>
            }
          </div>
          {
            !match.matchNumber || match.status === 'playing' || (match.scoreLabel && match.scoreLabel.length) > 0
              ? renderMatchDetail(match, 'teamB', 1)
              : <div className='detail-time'><p>{moment(match.date).format('LT')}</p></div>
          }
        </div>
      </div>
      <Modal
        visible={modalVisible}
        onOk={() => form.submit()}
        onCancel={() => { setModalVisible(false) }}
        title={match._id}
      >
        <Form
          name='createPlayer'
          form={form}
          onFinish={onFinish}
          style={{ maxWidth: '350px', margin: 'auto', overflow: 'scroll' }}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          scrollToFirstError
          initialValues={{ matchNumber: match.matchNumber, date: moment(match.date) }}
          onValuesChange={({ matchNumber }) => form.setFieldsValue({
            date: moment('2022-04-08T09:05:00.000Z').add(Math.floor((matchNumber - 205) / 12) * 30, 'minutes')
          })}
        >
          <Form.Item
            label='แมตช์ที่'
            name='matchNumber'
          >
            <InputNumber />
          </Form.Item>
          <Form.Item
            label='เวลา'
            name='date'
          >
            <DatePicker showTime format="DD-MMM-YYYY HH:mm" minuteStep={5} />
          </Form.Item>
        </Form>
      </Modal>
    </div >
  )
}
export default MatchUp
