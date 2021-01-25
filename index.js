const apiClient = require('./apiClient.js')
const utils = require('./utils.js')

const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
})

const mixAndDistribute = (addresses, amount) => {
  // TODO: Restore below
  // const addressesArray = addresses.split(',')
  const addressesArray = ['1', '2', '3', '4', '5']

  const subAmounts = []
  let remainingAmount = amount

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
  if (subAmounts.length < addressesArray.length) {
    console.log('splitting')
    while (subAmounts.length < addressesArray.length) {
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

  console.log('FINAL SUBAMOUNTS')
  console.log(subAmounts)

  for (let idx in subAmounts) {
    const subAmount = subAmounts[idx]
    // Create random time anywhere between 1 and 6 seconds
    const randomTimeInterval = Math.floor(Math.random() * 5 + 1)

    if (idx < addressesArray.length) { // Make sure each addr gets one subAmount
      const toAddress = addressesArray[idx]

      setTimeout(() => {
        apiClient.makeTx('HOUSE', toAddress, subAmount)
      }, randomTimeInterval)
    } else { // Once every addr has gotten a subAmount, randomly distribute
      const randomAddressIdx = Math.floor(Math.random() * addressesArray.length)
      const toAddress = addressesArray[randomAddressIdx]

      setTimeout(() => {
        apiClient.makeTx('HOUSE', toAddress, subAmount)
      }, randomTimeInterval)
    }
  }
}

mixAndDistribute('', 30)

const askCoinAmount = (addresses) => {
  readline.question('How many coins would you like to send? ', async (amount) => {
    // Get deposit address
    const depositAddress = utils.generateDepositAddress()

    // Send coin amount to deposit address
    // await apiClient.makeTx('Robert', depositAddress, amount)

    // Get coins from depost address, send to house (or just mix)
    const addressInfo = await apiClient.getAddressInfo(depositAddress)
    const addressBalance = addressInfo



    // Mix
      // Send coin amount to house
      // await apiClient.makeTx(depositAddress, 'HOUSE', addressBalance)
      //
      // distribute(addresses, addressBalance)


    // apiClient.getTxs()
    readline.close()

  })
}

const askAddresses = () => {
  readline.question('Please enter a comma-separated list of new, unused Jobcoin addresses where your mixed Jobcoins will be sent: ', async (addresses) => {
    // Get coin amount
    askCoinAmount(addresses)

  })

  return
}

// askAddresses()
