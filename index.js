import {ethers} from './ethers-5.6.esm.min.js'
import {contractAddress, abi} from './constants.js'

const elBtnConnect = document.querySelector('#connect button')
const elTextConnect = document.querySelector('#connect span')
const elBtnFund = document.querySelector('#fund button')
const elTextFund = document.querySelector('#fund code')
const elBtnWithdraw = document.querySelector('#withdraw button')
const elTextWithdraw = document.querySelector('#withdraw code')
const elBtnBalance = document.querySelector('#balance button')
const elTextBalance = document.querySelector('#balance span')
const elEthAmount = document.querySelector('#ethAmount')

elBtnConnect.addEventListener('click', handleBtnConnect)
elBtnFund.addEventListener('click', handleBtnFund)
elBtnWithdraw.addEventListener('click', handleBtnWithdraw)
elBtnBalance.addEventListener('click', handleBtnBalance)

async function handleBtnConnect() {
  if (typeof window.ethereum !== undefined) {
    await ethereum.request({method: 'eth_requestAccounts'}).catch(error => console.log(error))
    elTextConnect.textContent = 'Connected'

    const accounts = await ethereum.request({method: 'eth_accounts'}).catch(error => console.log(error))
    console.log('accounts:', accounts)
  } else {
    elTextConnect.textContent = 'Please install MetaMask'
  }
}

async function handleBtnFund() {
  if (typeof window.ethereum !== undefined) {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(contractAddress, abi, signer)

    try {
      const txResponse = await contract.fund({value: ethers.utils.parseEther(elEthAmount.value)})
      elTextFund.textContent += '\nMining...'
      const message = await listenForTransactionMine(txResponse, provider)
      elTextFund.textContent += `\n ${message} \nFunded ${elEthAmount.value}ETH \n_________________\n`

    } catch (error) {
      console.log('error:', error)
    }
  } else {
    elTextFund.textContent = 'Please install MetaMask'
  }
}

async function handleBtnWithdraw() {
  if (typeof window.ethereum !== undefined) {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(contractAddress, abi, signer)

    try {
      const txResponse = await contract.withdraw()
      elTextWithdraw.textContent += '\nMining...'
      const message = await listenForTransactionMine(txResponse, provider)
      elTextWithdraw.textContent += `\n ${message} \nWithdraw completed\n_________________\n`

    } catch (error) {
      console.log('error:', error)
    }
  } else {
    elTextFund.textContent = 'Please install MetaMask'
  }
}

async function handleBtnBalance() {
  if (typeof window.ethereum !== undefined) {
    const provider = new ethers.providers.Web3Provider(window.ethereum)

    try {
      const balance = await provider.getBalance(contractAddress)
      elTextBalance.textContent = `${ethers.utils.formatEther(balance)} ETH`

    } catch (error) {
      console.log('error:', error)
    }
  } else {
    elTextFund.textContent = 'Please install MetaMask'
  }
}

function listenForTransactionMine(txResponse, provider) {
  return new Promise(((resolve, reject) => {
    provider.once(txResponse.hash, txReceipt => {
      resolve(`Completed with ${txReceipt.confirmations} confirmation(s)`)
    })
  }))
}
