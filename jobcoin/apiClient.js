#!/usr/bin/env node
"use strict";
const axios = require("axios");
// const fetch = require('node-fetch')

/* Urls */
const API_BASE_URL = "http://jobcoin.gemini.com/jester-bless/api";
const API_ADDRESS_URL = `${API_BASE_URL}/addresses`;
const API_TRANSACTIONS_URL = `${API_BASE_URL}/transactions`;

exports.getTxs = async () => {
  try {
    const addressesRes = await axios.get(API_TRANSACTIONS_URL)
    console.log('RES DATA')
    console.log(addressesRes.data)
    return
  } catch (err) {
    console.log('ERROR')
    console.log(err)
  }
}

exports.makeTx  = async (fromAddress, toAddress, amount) => {
  try {
    const tx = await axios.post(API_TRANSACTIONS_URL, {
      fromAddress,
      toAddress,
      amount
    })

    return
  } catch (err) {
    console.log('ERROR')
    console.log(err)
  }
}

exports.getAddressInfo = async (address) => {
  try {
    const addressInfo = await axios.get(`${API_ADDRESS_URL}/${address}`)
    return addressInfo.data
  } catch (err) {
    console.log('ERROR')
    console.log(err)
  }
}
