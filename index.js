const { makeTx, getAddressInfo } = require('./jobcoin/apiClient.js')
const { despositMixDistribute } = require('./jobcoin/mixer.js')

const {
  verifyOriginalFromAddr,
  verifyToAddrsNewUnused,
  verifyAmount,
  createDummyTxs
} = require('./jobcoin/utils.js')

const { HOUSE_ADDRESS } = require('./jobcoin/config.js')

const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
})

const askDummyNames = (originalFromAddr, addresses, amount) => {
  readline.question('Enter your two dummy names separated by a comma: ', async (dummyNames) => {
    console.log('Transferring...')

    createDummyTxs(dummyNames)

    await despositMixDistribute(originalFromAddr, addresses, amount)

    // Finish transaction
    readline.close()
  })
}

const askCoinAmount = (addresses, originalFromAddr, addressInfo) => {
  readline.question('How many coins would you like to send? ', async (amount) => {

    const amountCheck = verifyAmount(amount, addressInfo)
    if (amountCheck.successful) {
      askDummyNames(originalFromAddr, addresses, amount)
    } else {
      console.log(`${amountCheck.message}. Please try another amount.`)
      askCoinAmount(addresses, originalFromAddr, addressInfo)
    }
  })
}

const askAddresses = async (originalFromAddr, addressInfo) => {
  readline.question('Please enter a comma-separated list of new, unused Jobcoin addresses where your mixed Jobcoins will be sent: ', async (addresses) => {

    const toAddrsNewUnusedCheck = await verifyToAddrsNewUnused(addresses)
    if (toAddrsNewUnusedCheck.successful) {
      askCoinAmount(addresses, originalFromAddr, addressInfo)
    } else {
      console.log(toAddrsNewUnusedCheck.message)
      console.log(toAddrsNewUnusedCheck.data)
      askAddresses(originalFromAddr, addressInfo)
    }
  })
}

const askFromAddress = () => {
  readline.question('Which account are you sending from? ', async originalFromAddr => {
    const addressInfo = await getAddressInfo(originalFromAddr)

    const originalFromAddrCheck = verifyOriginalFromAddr(addressInfo)
    if (originalFromAddrCheck.successful) {
      askAddresses(originalFromAddr, addressInfo)
    } else {
      console.log(`${originalFromAddrCheck.message}. Please try another address to send from.`)
      askFromAddress()
    }
  })
}

const run = () => {
  askFromAddress()
}

run()
