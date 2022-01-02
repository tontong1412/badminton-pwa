const processBracketData = (data) => {
  data.sort((a, b) => {
    return b.round - a.round
  })
  const maxRound = Math.max(...data.map(e => e.round))
  data = data.reduce((prev, curr, index) => {
    const roundIndex = Math.log2(maxRound) - Math.log2(curr.round)
    const key = curr.round !== 2 ? `round${roundIndex}` : 'finals'
    if (!prev[key]) {
      prev[key] = []
    }
    prev[key].push(curr)
    return prev
  }, {})
  return data
}
export default processBracketData
