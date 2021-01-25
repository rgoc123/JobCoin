const apiClient = require('./apiClient.js')
const utils = require('./utils.js')

const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
})

const askAddresses = () => {
  readline.question('Please enter a comma-separated list of new, unused Jobcoin addresses where your mixed Jobcoins will be sent: ', async (addresses) => {

    const depositAddress = utils.generateDepositAddress()
    
    // apiClient.getTxs()
    readline.close()
  })
  return
}

askAddresses()
