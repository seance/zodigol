const DefaultBuilder = require('truffle-default-builder');

module.exports = {
  build: new DefaultBuilder({
    'index.html': 'index.html',
    'app.js': [
      'bundle.js'
    ],
    'app.css': [
      'bundle.css'
    ],
    'images/': 'images/'
  }),
  networks: {
    development: {
      host: 'localhost',
      port: 8545,
      network_id: '*' // Match any network id
    },
    zodigol: {
      host: 'localhost',
      port: 9545,
      network_id: '7041602',
      from: '9341c1d580f18e7327fc251adc4abbb30fc1d4ca'
    }
  }
};
