const mixer = require('../jobcoin/mixer.js')

const givenAmount = 30
const toAddressses = ['a', 'b', 'c', 'd', 'e']

describe('Mixing coins', () => {
  const subAmounts = mixer.createRandomAmounts(givenAmount, toAddressses)

  test('Random amounts sum to given amount', () => {
    let sum = 0
    for (let subAmount of subAmounts) {
      sum += subAmount
    }

    expect(sum).toEqual(givenAmount)
  })

  test('Number of sub amounts >= number of recipients', () => {
    expect(subAmounts.length).toBeGreaterThanOrEqual(toAddressses.length)
  })
})
