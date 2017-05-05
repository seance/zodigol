const fs = require('fs')
const zodigolJson = require('../build/contracts/Zodigol.json')
const zodigolAbi = zodigolJson.abi
const zodigolAddr = zodigolJson.networks["7041602"].address

function runGM() {
  var Zodigol = eth.contract(ZODIGOL_ABI)
  var zodigol = Zodigol.at('ZODIGOL_ADDRESS')
  var filter = eth.filter('latest')
  var stopOnError = function(handler) {
    return function(err, result) {
      if (err) {
        console.error(err)
        console.error('Terminating filter')
        filter.stopWatching()
      } else {
        return handler(result)
      }
    }
  }
  filter.watch(stopOnError(function(blockId) {
    eth.getBlock(blockId, stopOnError(function(block) {
      zodigol.runGameRound({
        from: eth.accounts[0],
        gas: block.gasLimit
      }, stopOnError(function(tx) {
        console.log('Run game round', tx)
      }))
    }))
  }))

  return filter
}

const runGMTemplate = runGM.toString()
const runGMRendered = runGMTemplate
  .replace(/ZODIGOL_ABI/, JSON.stringify(zodigolAbi))
  .replace(/ZODIGOL_ADDRESS/, zodigolAddr)

fs.writeFileSync('gamemaster.js', runGMRendered)
