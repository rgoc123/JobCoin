const { makeTx, getAddressInfo } = require('./apiClient.js')
const { generateRandomAddress } = require('./utils.js')
const { HOUSE_ADDRESS } = require('./config.js')

const createRandomAmounts = (amount, addressesArray) => {
  const subAmounts = []

  let remainingAmount = amount
  const numAddresses = addressesArray.length

  // Make intial slices of amount to send and keep them small
  while (remainingAmount) {
    const upperLimit = remainingAmount < 5 ? remainingAmount : 5

    const subAmount = Math.floor(Math.random() * (upperLimit) + 1)
    subAmounts.push(subAmount)

    remainingAmount -= subAmount
  }

  // Create enough subAmounts for each recipient, for small transfers
  // to multiple addresses
  if (subAmounts.length < numAddresses) {
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

  return subAmounts
}

exports.createRandomAmounts = createRandomAmounts

const delay = (time) => {
  return new Promise(resolve => setTimeout(resolve, time*1000))
}

const distribute = async (subAmounts, addressesArray) => {
  for (let idx in subAmounts) {
    const subAmount = subAmounts[idx]
    // Create random time anywhere between 1 and 3 seconds for testing expediency
    const randomTimeInterval = Math.floor(Math.random() * 3 + 1)

    let toAddress
    if (idx < addressesArray.length) { // Make sure each addr gets one subAmount
      toAddress = addressesArray[idx]
    } else { // Once every addr has gotten a subAmount, randomly distribute remaining subAmounts
      const randomAddressIdx = Math.floor(Math.random() * addressesArray.length)
      toAddress = addressesArray[randomAddressIdx]
    }

    await delay(randomTimeInterval)

    console.log(`Transferring ${subAmount} coins to address ${toAddress}`)
    makeTx(HOUSE_ADDRESS, toAddress, subAmount)
  }
}

const mixAndDistribute = async (addresses, amount) => {
  const addressesArray = addresses.split(',')

  const subAmounts = createRandomAmounts(amount, addressesArray)

  await distribute(subAmounts, addressesArray)
}

exports.despositMixDistribute = async (originalFromAddr, addresses, amount) => {
  // Get deposit address
  const depositAddress = generateRandomAddress()

  // Send coin amount to deposit address
  await makeTx(originalFromAddr, depositAddress, amount)

  // Get coins from depost address, send to house
  const addressInfo = await getAddressInfo(depositAddress)
  const addressBalance = addressInfo.balance
  await makeTx(depositAddress, HOUSE_ADDRESS, addressBalance)

  // Mix and distribute
  await mixAndDistribute(addresses, addressBalance)
}
