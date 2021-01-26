const {
  verifyOriginalFromAddr,
  verifyAmount
} = require('../jobcoin/utils.js')

const addressNonExisting = { balance: '0', transactions: [] }
const addressNoFunds = {
  balance: '0',
  transactions: [
    {
      timestamp: '2021-01-26T02:22:46.545Z',
      toAddress: 'Sara',
      amount: '50'
    }
  ]
}
const goodAddress = {
  balance: '10',
  transactions: [
    {
      timestamp: '2021-01-26T02:22:46.545Z',
      toAddress: 'Sara',
      amount: '50'
    }
  ]
}

describe('Verifies original fromAddress', () => {
  test('Produces error for non-existing address', () => {
    const originalFromAddrCheck = verifyOriginalFromAddr(addressNonExisting)

    expect(originalFromAddrCheck.successful).toBe(false)
  })

  test('Produces error for address with no funds', () => {
    const originalFromAddrCheck = verifyOriginalFromAddr(addressNoFunds)

    expect(originalFromAddrCheck.successful).toBe(false)
  })

  test('Is successful with good address', () => {
    const originalFromAddrCheck = verifyOriginalFromAddr(goodAddress)

    expect(originalFromAddrCheck.successful).toBe(true)
  })
})

const nonNumber = '4asdf22349'
const insufficientAmt = '15'
const validAmount = '8'

describe('Verifies amount to send', () => {
  test('Produces error for non-number', () => {
    const amountCheck = verifyAmount(nonNumber, goodAddress)

    expect(amountCheck.successful).toBe(false)
  })

  test('Produces error for too high an amount', () => {
    const amountCheck = verifyAmount(insufficientAmt, goodAddress)

    expect(amountCheck.successful).toBe(false)
  })

  test('Is successful for valid amount', () => {
    const amountCheck = verifyAmount(validAmount, goodAddress)

    expect(amountCheck.successful).toBe(true)
  })
})
