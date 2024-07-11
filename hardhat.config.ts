/**
 * @type import('hardhat/config').HardhatUserConfig
 */
require('dotenv').config()
import { NEXERA_CHAINS } from '@nexeraprotocol/nexera-id-sig-gating-contracts-sdk/lib'
import '@nomiclabs/hardhat-ethers'
import '@nomiclabs/hardhat-waffle'

module.exports = {
  solidity: {
    compilers: [
      {
        version: '0.8.20',
        settings: {
          optimizer: {
            enabled: true,
            runs: 5000,
          },
        },
      },
    ],
  },
  networks: {
    hardhat: {
      settings: {
        debug: {
          revertStrings: 'debug',
        },
      },
    },
    tenderly: {
      chainId: 1,
      url: `https://rpc.tenderly.co/fork/${process.env.TENDERLY_FORK_ID}`,
      accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    mainnet: {
      url: `https://mainnet.infura.io/v3/${process.env.INFURA_KEY}`, // or any other JSON-RPC provider
      accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    //testnets
    polygonAmoy: {
      chainId: Number(NEXERA_CHAINS.POLYGON_AMOY),
      url: `${process.env.AMOY_PROVIDER_URL}`,
      accounts: { mnemonic: process.env.TEST_MNEMONIC },
    },
    sepolia: {
      chainId: Number(NEXERA_CHAINS.SEPOLIA),
      url: process.env.SEPOLIA_PROVIDER_URL,
      accounts: { mnemonic: process.env.TEST_MNEMONIC },
    },
  },
}
