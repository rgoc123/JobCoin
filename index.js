const apiClient = require('./jobcoin/apiClient.js')
const mixer = require('./jobcoin/mixer.js')

const {
  generateDepositAddress,
  verifyOriginalFromAddr,
  verifyToAddrsNewUnused,
  verifyAmount
} = require('./jobcoin/utils.js')

const { HOUSE_ADDRESS } = require('./jobcoin/config.js')

const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
})

const askCoinAmount = (addresses, originalFromAddr, addressInfo) => {
  readline.question('How many coins would you like to send? ', async (amount) => {

    const amountCheck = verifyAmount(amount, addressInfo)
    if (amountCheck.successful) {
      // Get deposit address
      const depositAddress = generateDepositAddress()

      // Send coin amount to deposit address
      await apiClient.makeTx(originalFromAddr, depositAddress, amount)

      // Get coins from depost address, send to house
      const addressInfo = await apiClient.getAddressInfo(depositAddress)
      const addressBalance = addressInfo.balance


      await apiClient.makeTx(depositAddress, HOUSE_ADDRESS, addressBalance)

      // Mix and distribute
      await mixer.mixAndDistribute(addresses, addressBalance)

      // Finish transaction
      console.log('Transfer complete')
      readline.close()
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
    const addressInfo = await apiClient.getAddressInfo(originalFromAddr)
    console.log(addressInfo)

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
