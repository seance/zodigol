// Use gas/usedGas hack to guesstimate tx failure
export const confirmTx = txPromise => txPromise.then(sentTx =>
  eth.getTransactionAsync(sentTx.tx).then(blockTx =>
    sentTx.receipt.gasUsed >= blockTx.gas && !sentTx.logs.length
      ? Promise.reject(new Error(sentTx))
      : Promise.resolve(sentTx)
  ))
