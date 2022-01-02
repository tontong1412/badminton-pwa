import Layout from '../../../components/Layout/tournamentManager'
import { useDispatch } from 'react-redux'
import { TAB_OPTIONS } from '../../../constant'
import { useEffect } from 'react'
const Manage = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch({ type: 'ACTIVE_MENU', payload: TAB_OPTIONS.TOURNAMENT_MANAGER.MANAGE })
  }, [])
  const drawBracket = () => {
    const height = 50
    const lineWidth = 50
    const blockWidth = 200
    const test = [
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16
    ]
    const teamCount = test.length

    return (
      <div style={{ display: 'flex' }}>

        <div>
          {test.map((team, i) => {
            return <>
              <div style={{
                width: `${blockWidth}px`,
                height: `${height}px`,
                borderBottom: '1px solid #333',
                borderRight: i % 2 === 1 ? '1px solid #333' : null
              }}>{'team'}</div>
            </>
          })}
        </div>

        <div style={{ paddingTop: `${height / 2}px` }}>
          {Array.apply(null, Array(teamCount)).map((team, i) => {
            return <div
              key={`key-${i + 1}`}
              style={{
                width: `${lineWidth}px`,
                height: `${height}px`,
                borderBottom: i % 2 === 0 ? '1px solid #333' : null
              }} />
          })}
        </div>

        <div style={{ paddingTop: `${(height / 2) + height}px` }}>
          {Array.apply(null, Array(teamCount - 1)).map((team, i) => {
            return <div
              key={`key-${i + 1}`}
              style={{
                width: `${lineWidth}px`,
                height: `${height}px`,
                borderLeft: i % 4 < 2 ? '1px solid #333' : null,
                borderBottom: i % 4 === 0 ? '1px solid #333' : null,
              }} />
          })}
        </div>

        <div style={{ paddingTop: `${(height / 2) + 2 * height}px` }}>
          {Array.apply(null, Array(teamCount - 2)).map((team, i) => {
            return <div
              key={`key-${i + 1}`}
              style={{
                width: `${lineWidth}px`,
                height: `${height}px`,
                borderLeft: i % 8 < 4 ? '1px solid #333' : null,
                borderBottom: i % 8 === 1 ? '1px solid #333' : null,
              }} />
          })}
        </div>

        <div style={{ paddingTop: `${(height / 2) + 4 * height}px` }}>
          {Array.apply(null, Array(teamCount - 4)).map((team, i) => {
            return <div
              key={`key-${i + 1}`}
              style={{
                width: `${lineWidth}px`,
                height: `${height}px`,
                borderLeft: i % 16 < 8 ? '1px solid #333' : null,
                borderBottom: i % 16 === 3 ? '1px solid #333' : null,
              }} />
          })}
        </div>
        <div style={{ paddingTop: `${(height / 2) + 8 * height}px` }}>
          {Array.apply(null, Array(teamCount - 8)).map((team, i) => {
            return <div
              key={`key-${i + 1}`}
              style={{
                width: `${lineWidth}px`,
                height: `${height}px`,
                borderLeft: i % 32 < 16 ? '1px solid #333' : null,
                borderBottom: i % 32 === 7 ? '1px solid #333' : null,
              }} />
          })}
        </div>
        <div style={{ paddingTop: `${(height / 2) + 16 * height}px` }}>
          {Array.apply(null, Array(teamCount - 16)).map((team, i) => {
            return <div
              key={`key-${i + 1}`}
              style={{
                width: `${lineWidth}px`,
                height: `${height}px`,
                borderLeft: i % 64 < 32 ? '1px solid #333' : null,
                borderBottom: i % 64 === 15 ? '1px solid #333' : null,
              }} />
          })}
        </div>
      </div>
    )
  }
  return (
    <Layout>
      <h1>Manage</h1>
      <div>{drawBracket()}</div>
    </Layout>
  )
}
export default Manage