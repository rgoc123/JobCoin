const apiClient = require('./apiClient.js')

const { HOUSE_ADDRESS } = require('./config.js')

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

const delay = (time) => {
  return new Promise(resolve => setTimeout(resolve, time*1000))
}

const distribute = async (subAmounts, addressesArray) => {
  for (let idx in subAmounts) {
    const subAmount = subAmounts[idx]
    // Create random time anywhere between 1 and 10 seconds
    const randomTimeInterval = Math.floor(Math.random() * 10 + 1)

    let toAddress
    if (idx < addressesArray.length) { // Make sure each addr gets one subAmount
      toAddress = addressesArray[idx]
    } else { // Once every addr has gotten a subAmount, randomly distribute
      const randomAddressIdx = Math.floor(Math.random() * addressesArray.length)
      toAddress = addressesArray[randomAddressIdx]
    }

    await delay(randomTimeInterval)
    console.log(`Transferring ${subAmount} coins to address ${toAddress}`)
    apiClient.makeTx(HOUSE_ADDRESS, toAddress, subAmount)
  }
}

exports.mixAndDistribute = async (addresses, amount) => {
  // TODO: Restore below
  const addressesArray = addresses.split(',')
  console.log(addressesArray)

  const subAmounts = createRandomAmounts(amount, addressesArray)

  await distribute(subAmounts, addressesArray)
}
