import axios from "axios";
import { url } from ".";

export default async function get_account_info(_account_id: string)
    : Promise<bigint> {
    const data = {
        jsonrpc: '2.0',
        id: 'dontcare',
        method: 'query',
        params: {
            request_type: 'view_account',
            finality: 'final',
            account_id: _account_id
        }
    };

    try {
        const response = await axios.post(url, data);
        return response.data.result;
    } catch (error) {
        console.error('Error fetching account info:', error);
        throw error;
    }
}


// Testing
const account_id: string = "ruhan001.near";
// get_account_info(account_id)
//     .then(accountInfo => {
//         console.log('Account Info:', accountInfo);
//     })
//     .catch(error => {
//         console.error('Error:', error);
//     });

