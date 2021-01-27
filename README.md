# JobCoin
###### by Rob O'Connor

## Overview
This is an example of a cryptocurrency coin mixer built with Node. The goal is to provide users the ability to anonymously transfer coins to accounts they can then withdraw from. The gist of this solution is that adding randomness creates anonymity. It implements a random order to transfers by creating small, randomly-sized (aka discrete) sub-amounts and then distributing them at random intervals for several layers of randomization.


## Install and Run
### Install and setup
1. Clone the repo from [here](https://github.com/rgoc123/JobCoin), and navigate into the root directory
2. Run `npm install` to install the node modules

### Run program
1. First go to the [frontend environment](https://jobcoin.gemini.com/jester-bless) and create 50 New jobcoins for three addresses. The first will be yours, and the second and third will be "dummy" addresses that will act as transactions already in the mixer pool.
2. When that's done, in terminal start the program with `node index.js`
3. Follow the prompts, making sure addresses you enter are separated by a comma, e.g. `'ro1,ro2,ro3'`

Note: For the purposes of this exercise, you can enter what ever toAddresses you'd like. If you're not generating your own random 16-digit toAddresses for your transaction, someone would likely be able to tell which transactions were tied to your account. But since this is an exercise, using shorter, identifiable addresses will make it easier to see how the order randomly appears on the frontend. If you were generating your own random 16-digit number it would be much more difficult to make connections between recipients and senders.

### Run tests
If you'd like to run the tests, simply make sure the program isn't running and then `npm run test`


## Functionality and Rationale
The main steps for a coin mixer are:
1. A user provides a list of **new, unused** addresses, and an amount to send to them
2. The mixer provides a random address to temporarily hold the coins
3. The mixer then adds the coins to a common pool (aka 'house account') for mixing
4. The mixer then makes discrete payments to the addresses the user provides

It's obviously important to mix and provide anonymity, but so is getting valid inputs from the prompts.

### Prompts
The main program runs from `index.js`. It prompts the user, verifies the inputs, and then runs the mixing and distribution. The prompts ask the user for the fromAddress, recipients, and amount to send in that order. The fromAddress, recipients, and amount are checked for validity, and those checks will continue the program or let the user know if there is an error.

### Core Mixing Functionality
The core functionality is in `mixer.js`. It starts by creating randomly-sized pieces (subAmounts) from the total amount. By first creating initial random subAmounts and then again randomly slicing while creating enough subAmounts for each recipient, more randomization is provided. This provides greater anonymity because random subAmounts make it more difficult to determine what original amount it was a piece of.

Once the random subAmounts establish one layer of anonymity, a second layer of anonymity is provided by randomly timing when each distribution is made.

### Overall Rationale
This overall approach is based on the assumption that a real world app will have many transactions happening at any given time and a longer actual delay in transactions. By triggering a mix on every transaction instead of regularly polling the network, the many instances of the mixAndDistribute function effectively add randomly-firing transactions automatically, so the program doesn't need to do extra work to build the House pool. Polling at random intervals could work well, but it would require the program to be constantly listening/doing work. And even if there weren't many transactions happening at a given time, a polling approach would provide about the same random timing to those few transactions as the trigger approach.

### Specific Rationale

#### Randomly-Sized Sub-Amounts
I chose to create small, randomly sized subAmounts because the closer a received amount is to a previous transfer, especially large ones, the easier it is to identify possible connections between subAmounts and possible originators. If all transactions share this trait, then it further obscures the origin. This also allows for one transaction to make multiple deposits to each of its recipients, which makes tracking even more confusing because it creates the appearance that multiple people are sending to a given address.

#### Random Timing
I then chose to create random timing to further remove a deposit from its originator. If other transactions are happening in between it makes it more difficult to tie deposits to an originator based on succession and close timing.



## Future Improvements
* Add fee collection
* Ability for users to generate random toAddresses
* Add the ability for users to choose a level of anonymity/risk: by asking for slow transactions they may lose speed but gain anonymity, and vice-versa.
* Add the ability for the user to run multiple transactions (to further increase the number of coins and transactions in the common pool, thus increasing randomness and providing more anonymity).
* Increased test coverage
