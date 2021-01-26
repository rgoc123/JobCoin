const {
  verifyOriginalFromAddr
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
