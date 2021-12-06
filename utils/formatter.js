export const formatPromptpay = (input) => {
  if (input.length === 10) {
    const formattedCode = input.slice(0, 3) + '-' + input.slice(3, 6) + '-' + input.slice(6)
    return formattedCode
  } else if (input.length === 13) {
    const formattedCode = input.slice(0, 1) + '-' + input.slice(1, 5) + '-' + input.slice(5, 10) + '-' + input.slice(10, 12) + '-' + input.slice(12)
    return formattedCode
  } else {
    return input
  }
}