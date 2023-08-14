import { ethers, JsonRpcProvider } from "ethers";
import { Epoch, exampleEpoch, IndividualEnergyStats } from "../../interfaces";
import { Filter } from "ethers";
import { Log } from "ethers";
import { apiKey, url } from "./";
import fs from "fs";
import { hex2Dec } from "../../utils";
import axios, { AxiosResponse, AxiosError } from "axios";

async function get_network_energy_consumption_in_24h()
// : Promise<bigint> 
{
    try {
        const response: AxiosResponse = await axios.get(`${url}/electricity-consumption/network?key=${apiKey}`);
        console.log(response.data);
    } catch (err: any) {
        throw new Error(`get_network_energy_consumption()^ Error: ${err}`);
    }
}

get_network_energy_consumption_in_24h().catch((err: any) => {
    console.log(err);
})

export default get_network_energy_consumption_in_24h;