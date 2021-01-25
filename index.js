const apiClient = require('./apiClient.js')

const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
})

const askAddresses = () => {
  apiClient.getTxs()
  return
}

askAddresses()
