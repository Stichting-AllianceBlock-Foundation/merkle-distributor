require('dotenv').config()
require('@nomiclabs/hardhat-ethers')
const { ethers } = require('hardhat')

const DISTRIBUTOR_INIT_BALANCE = 1000000

async function main() {
  // Deploy example token
  const tokenFactory = await ethers.getContractFactory('TestERC20')
  const token = await tokenFactory.deploy('AidropToken', 'ATKN', 0)
  console.log(`Example token deployed at ${token.address}`)

  // Deploy Merkle Distributor
  console.log('inputs for merkleDistributor: ', token.address, process.env.DEPLOY_ROOT, process.env.TX_SIGNER_ADDRESS)
  const MerkleDistributor = await ethers.getContractFactory('MerkleDistributor')
  const merkleDistributor = await MerkleDistributor.deploy(
    token.address,
    process.env.DEPLOY_ROOT,
    process.env.TX_SIGNER_ADDRESS
  )
  await merkleDistributor.deployed()
  console.log(`merkleDistributor deployed at ${merkleDistributor.address}`)

  // set Balance for distributor to a million
  await token.setBalance(merkleDistributor.address, DISTRIBUTOR_INIT_BALANCE)
  console.log(`Set Distributor balance to ${DISTRIBUTOR_INIT_BALANCE}`)
}

main()
  // eslint-disable-next-line no-process-exit
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    // eslint-disable-next-line no-process-exit
    process.exit(1)
  })
