import { ethers } from 'ethers';

// Generate a new random private key
export default function genEthAddress(amount: number = 1)
: string[] {
    let addressList: string[] = [];
    while (amount > 0) {
        const randomPrivateKey = ethers.Wallet.createRandom().privateKey;
        const wallet = new ethers.Wallet(randomPrivateKey);
        const address: string = wallet.address.toLowerCase();
        addressList.push(address);
        --amount;
    }
    return addressList;
}

// Test
// console.log(genEthAddress(100));