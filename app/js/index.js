Promise.config({
    // Enables all warnings except forgotten return statements.
    warnings: {
        wForgottenReturn: false
    }
});

// TestRPC doesn't implement unlockAccount
const unlockAccount = account =>
  window.version.getNetworkAsync().then(networkId => {
    if (networkId === '7041602') {
      return window.personal.unlockAccountAsync(account, 'diddlydoo')
    } else {
      return Promise.resolve()
    }
  })

window.addEventListener('load', () => {
  window.eth = Promise.promisifyAll(web3.eth)
  window.personal = Promise.promisifyAll(web3.personal)
  window.version = Promise.promisifyAll(web3.version)
  window.eth.getAccountsAsync().then(accounts => {
    window.account = accounts[0]
    unlockAccount(window.account).then(() => {
      Zodigol.deployed().then(zodigol => {
        window.zodigol = zodigol
        require('./app.jsx')
      })
    })
  })
})
