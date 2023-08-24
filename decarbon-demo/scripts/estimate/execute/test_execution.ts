// import { Epoch, Account, Transaction, exampleEpoch, exampleAccount } from "../../interfaces";
// import { Queue } from "../../classes";
// import axios, { AxiosResponse } from "axios";
// import { url } from "../../aggregate/use_beaconchain_apis";
// import main from "./main_thread";

// /**
//  * Quick test for estimator without waiting
//  */
// async function test_execution() {
//     try {

//         const queue: Queue<Epoch> = new Queue<Epoch>();
//         const worker: Worker = new Worker("./build/estimate/execute/worker_thread.js");
//         let addressToAccount: Map<string, Account> = new Map<string, Account>();
//         let transactionList: Transaction[] = [];

//         const url = "https://beaconcha.in/api/v1/epoch/finalized";
//         const epochResponse = await axios.get(url);
//         const finalizedEpoch: Record<string, any> = epochResponse.data.data;
//         main.push()
//     } catch (err) {
//         console.log(err);
//     }
// }