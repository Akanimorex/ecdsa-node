import secp from "ethereum-cryptography/secp256k1";
import { keccak256 } from "ethereum-cryptography/keccak";


function getAddress(publicKey){
    let keySlice = publicKey.slice(1);
    let hashKey = keccak256(keySlice);
    return hashKey.slice(-20);

};

export default getAddress;

