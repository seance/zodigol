const TestRPC = require("ethereumjs-testrpc")

const blacklistLog = [
    /eth_getFilterChanges/,
    /eth_getTransactionReceipt/,
    /eth_call/,
]

const server = TestRPC.server({
    blocktime: 5,
    logger: {
        log: m => {
            if (!blacklistLog.find(re => re.test(m))) {
                console.log(m)
            }
        }
    }
})

server.listen(8545, function(err, blockchain) {
    const { address, port } = server.address()
    console.log(`TestRPC listening at ${address}:${port}`)
})
