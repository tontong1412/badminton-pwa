const drawBracket = (order = {}, blockWidth = 350) => {
  const height = 50
  const lineWidth = 50
  const teamCount = order.length

  return (
    <div style={{ display: 'flex' }}>

      <div>
        {order.map((team, i) => {
          return <>
            <div
              key={i + 1}
              style={{
                width: `${blockWidth}px`,
                height: `${height}px`,
                borderBottom: '1px solid #333',
                borderRight: i % 2 === 1 ? '1px solid #333' : null,
                display: 'flex',
                alignItems: 'flex-end',
                gap: '10px'
              }}>
              <div style={{ marginRight: '5px', width: '20px' }}>{i + 1}</div>
              <div>{team}</div>
            </div>
          </>
        })}
      </div>

      {
        Array.apply(null, Array(Math.ceil(Math.log2(teamCount || 1)))).map((round, i) => (
          <div key={`round-${i}`} style={{ paddingTop: `${(height / 2) + (i < 3 ? i : Math.pow(2, i - 1)) * height}px` }}>
            {Array.apply(null, Array(teamCount - (i < 3 ? i : Math.pow(2, i - 1)))).map((team, j) => {
              return <div
                key={`key-${j + 1}`}
                style={{
                  width: `${lineWidth}px`,
                  height: `${height}px`,
                  borderLeft: i !== 0 && (j % Math.pow(2, i + 1) < Math.pow(2, i) ? '1px solid #333' : null),
                  borderBottom: j % Math.pow(2, i + 1) === (i < 2 ? 0 : Math.pow(2, i - 1) - 1) ? '1px solid #333' : null
                }} />
            })}
          </div>
        ))
      }

      {/* <div style={{ paddingTop: `${height / 2}px` }}>
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
      </div> */}

      {/* <div style={{ paddingTop: `${(height / 2) + 2 * height}px` }}>
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
      </div> */}

      {/* <div style={{ paddingTop: `${(height / 2) + 4 * height}px` }}>
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
      </div> */}

      {/* <div style={{ paddingTop: `${(height / 2) + 8 * height}px` }}>
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
      </div> */}
      {/* <div style={{ paddingTop: `${(height / 2) + 16 * height}px` }}>
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
      </div> */}
    </div>
  )
}
export default drawBracket