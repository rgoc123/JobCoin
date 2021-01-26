const createRandomAmounts = (amount, addressesArray) => {
  const subAmounts = []

  let remainingAmount = amount
  const numAddresses = addressesArray.length

  // Make intial slices of amount to send
  while (remainingAmount) {
    if (remainingAmount < 5) {
      subAmounts.push(remainingAmount)
      remainingAmount = 0
    } else {
      const subAmount = Math.floor(Math.random() * (remainingAmount) + 1)
      subAmounts.push(subAmount)

      remainingAmount -= subAmount
    }
  }

  // Make sure subAmounts length is at least num addresses
  if (subAmounts.length < numAddresses) {
    // console.log('splitting')
    while (subAmounts.length < numAddresses) {
      for (let idx in subAmounts) {
        const subAmount = subAmounts[idx]
        if (subAmount > 1) {
          const origAmount = subAmounts.splice(idx, 1)
          const newAmountOne = Math.floor(Math.random() * origAmount) + 1
          const newAmountTwo = origAmount - newAmountOne

          subAmounts.push(newAmountOne)
          subAmounts.push(newAmountTwo)
          break
        }
      }
    }
  }

  // console.log('FINAL SUBAMOUNTS')
  // console.log(subAmounts)

  return subAmounts
}

exports.createRandomAmounts = createRandomAmounts

const distribute = (subAmounts, addressesArray) => {
  for (let idx in subAmounts) {
    const subAmount = subAmounts[idx]
    // Create random time anywhere between 1 and 6 seconds
    const randomTimeInterval = Math.floor(Math.random() * 5 + 1)

    if (idx < addressesArray.length) { // Make sure each addr gets one subAmount
      const toAddress = addressesArray[idx]

      // setTimeout(() => {
      //   apiClient.makeTx('HOUSE', toAddress, subAmount)
      // }, randomTimeInterval)
    } else { // Once every addr has gotten a subAmount, randomly distribute
      const randomAddressIdx = Math.floor(Math.random() * addressesArray.length)
      const toAddress = addressesArray[randomAddressIdx]

      // setTimeout(() => {
      //   apiClient.makeTx('HOUSE', toAddress, subAmount)
      // }, randomTimeInterval)
    }
  }
}

exports.mixAndDistribute = (addresses, amount) => {
  // TODO: Restore below
  // const addressesArray = addresses.split(',')
  const addressesArray = ['1', '2', '3', '4', '5']

  const subAmounts = createRandomAmounts(amount, addressesArray)

  distribute(subAmounts, addressesArray)
}
