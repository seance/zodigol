# Zodigol

Zodiac Game of Life on Ethereum. A study of Ethereum and developing Đapps for the blockchain.

Zodigol is a real-time-ish, interactive multiplayer Game of Life running on a private Ethereum testnet. The game implements a multicolored version of the Game of Life `B3/S23` ruleset with the exception that the differently colored factions do not "cross-breed" i.e. do not contribute to the `B3` rule cross-faction.

The different colors are represented by the twelve animals of the Chinese Zodiac &mdash; Rat, Ox, Tiger, Rabbit, Dragon, Snake, Horse, Goat, Monkey, Rooster, Dog and Pig.

## Running

Before starting, make sure you meet the following prerequisites.

**Prerequisites**

* Install [NodeJS](https://nodejs.org)
* Install [Docker](https://docs.docker.com/engine/installation/)
* Install [Docker Compose](https://docs.docker.com/compose/install/)
* Ensure your local port 8545 is available (for Geth)
* Ensure your local port 8080 is available (for Caddy)

**Running**

* Run `npm install`
* Run `npm start`

Once the images have been built and the containers created and started, go to http://localhost:8080.

**Note!** Geth is sensitive to clock skew which may occur at least on Mac with Docker. If your node warns about time difference, restart your Docker engine. It's also recommendable to tear down the containers with `docker-compose down` when finished.

Note also that the private blockchain has a block time of 10 seconds and this means that operations that create transactions can take a while to process!

The Web user interface is a bit light on the UX, especially on feedback while transactions are pending for the moment. Be patient :)
