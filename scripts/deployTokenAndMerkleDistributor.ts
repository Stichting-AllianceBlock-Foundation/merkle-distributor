import * as fs from 'fs'

require('dotenv').config()
import '@nomiclabs/hardhat-ethers'
import { ethers } from 'hardhat'

const DISTRIBUTOR_INIT_BALANCE = 1000000

interface MerkleData {
  merkleRoot: string
}

export const getLocalMerkleRoot = () => {
  // Read the JSON file
  const data = fs.readFileSync('./outputFiles/merkle.json', 'utf-8')

  // Parse the JSON data
  const jsonData: MerkleData = JSON.parse(data)

  // Extract the merkleRoot and assign it to the constant root
  const root = jsonData.merkleRoot

  // Log the result (or use it in your application)
  console.log('Merkle Root:', root)
  return root
}

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
    process.env.DEPLOY_ROOT === 'local' ? getLocalMerkleRoot() : process.env.DEPLOY_ROOT,
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
