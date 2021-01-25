const apiClient = require('./apiClient.js')
const utils = require('./utils.js')

const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
})

const askCoinAmount = () => {
  readline.question('How many coins would you like to send? ', async (amount) => {
    // Get deposit address
    const depositAddress = utils.generateDepositAddress()

    // Send coin amount to deposit address
    await apiClient.makeTx('Robert', depositAddress, amount)

    // Get coins from depost address, send to house (or just mix)
    const addressInfo = await apiClient.getAddressInfo('1ead4798')


    // Mix

    // apiClient.getTxs()
    readline.close()

  })
}

const askAddresses = () => {
  readline.question('Please enter a comma-separated list of new, unused Jobcoin addresses where your mixed Jobcoins will be sent: ', async (addresses) => {
    // Get coin amount
    askCoinAmount()

  })

  return
}

askAddresses()
