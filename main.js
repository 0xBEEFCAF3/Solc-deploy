const {Web3} = require('web3');
const fs = require('fs');

const web3 = new Web3('http://localhost:8545'); // Update with your Ethereum node URL
// Create an account object using a private key (for signing transactions)
const privateKey = '0x52947524bbc14bd90cc86c32b9b7564da2f7f8de343825fed68cd04da4925d29'; // Replace with your private key
const account = web3.eth.accounts.privateKeyToAccount(privateKey);

// Read the compiled contract data
const abi = JSON.parse(fs.readFileSync('output_folder/storage_sol_Storage.abi', 'utf8'));
const bytecode = '0x' + fs.readFileSync('output_folder/storage_sol_Storage.bin', 'utf8');


// Set the default account (used for deploying the contract)
web3.eth.accounts.wallet.add(account);
web3.eth.defaultAccount = account.address;
// Create a contract object
const contract = new web3.eth.Contract(abi);

// Deploy the contract
contract.deploy({
    data: bytecode,
    arguments: [/* constructor arguments if any */]
})
.send({
    from: account.address,
    gas: 1500000, // Gas limit
    gasPrice: '3000000000000' // Gas price in wei (e.g., 30 Gwei)
})
.then((newContractInstance) => {
    console.log('Contract deployed at address:', newContractInstance.options.address);
})
.catch((error) => {
        console.error(JSON.stringify(error))
    console.error('Error deploying contract:', error);
});
