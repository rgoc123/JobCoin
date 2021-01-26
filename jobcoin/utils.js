#!/usr/bin/env node
"use strict";
const crypto = require("crypto");

const { getAddressInfo } = require('./apiClient.js')

exports.generateDepositAddress = () => {
  const hash = crypto.createHash("sha256");
  return hash
    .update(`${Date.now()}`)
    .digest("hex")
    .substring(0, 8);
}

exports.verifyOriginalFromAddr = (addressInfo) => {
  if (addressInfo && addressInfo.transactions.length === 0) {
    return { successful: false, message: 'The address you provided isn\'t valid' }
  } else if (addressInfo && addressInfo.balance === '0') {
    return { successful: false, message: 'The address you want to send from has 0 coins' }
  } else {
    return { successful: true }
  }
}

const findBadAddresses = async (addressesArray) => {
  const badAddresses = []

  for (let i = 0; i < addressesArray.length; i++) {
    const addr = addressesArray[i]
    const addressInfo = await getAddressInfo(addr)

    if (!(addressInfo.balance === '0') || !(addressInfo.transactions.length === 0)) {
      badAddresses.push(addr)
    }
  }

  return badAddresses
}

exports.verifyToAddrsNewUnused = async (addresses) => {
  const addressesArray = addresses.split(',')

  const badAddresses = await findBadAddresses(addressesArray)
  if (badAddresses.length > 0) {
    return { successful: false, data: badAddresses, message: 'The following addresses are not new and unused. Please select different addresses.' }
  } else {
    return { successful: true }
  }
}

exports.verifyAmount = (amount, addressInfo) => {
  const parsedAmt = parseFloat(amount)
  const revertParsedCheck = parsedAmt.toString().length === amount.length

  if (!revertParsedCheck || isNaN(parsedAmt)) {
    return { successful: false, message: 'The amount you entered is not a valid number' }
  } else if (parseFloat(addressInfo.balance) < parseFloat(amount)) {
    return { successful: false, message: 'You don\'t have enough funds to transfer that amount' }
  } else {
    return { successful: true }
  }
}
