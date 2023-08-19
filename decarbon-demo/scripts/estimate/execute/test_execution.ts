import { main } from "./";
import { genEthAddress } from "../../utils";

const mocks: string[] = [
    // These are transaction senders
	"0x28c6c06298d514db089934071355e5743bf21d60",
	"0x56eddb7aa87536c09ccc2793473599fd21a8b17f",
	"0xae2fc483527b8ef99eb5d9b44875f005ba1fae13",
	"0x21a31ee1afc51d94c2efccaa2092ad1028285549",
	"0xe0deeccda3befa93aea667c2c13195ffdead01ab",
	"0x327fe6f58fd07672e2b53be25598a0e43f23dd1c",
	"0x276e6c50ddc7aa6e19e106b4f90bc8c99bddad73",
	"0x5f06750bbf23b655016b0ec2fb2d82a33ae714ae",
	"0x2f9a399c0d6234a3228e31483c61c4b509ef1cd3",
	"0x8b89d0f0db08d938e58f134c7776eb108be5ba15",
	"0x46340b20830761efd32832a74d7169b29feb9758",
	"0x046961948080b224a2ab6a9d52b25937e75bb9ea",
	"0x8ec8a01de404327923db6335a8e4b422524b6c92",
	"0x3570b3604ff4b48296a357bdad8e986c373c560f",
	"0xf06ebe3dc1ce76b7a320fcf402965d3eecd362a9",
	"0x4c5132a45ac21d9a6a31bd4bd68fdaf4eefe9291",
	"0xe6b7c477383428156f4e1afaaff72569ea04f5d6",
	"0x974caa59e49682cda0ad2bbe82983419a2ecc400",
	"0xea1c9b9799cf4ff42738f62a226da590354a3f1e",
	"0x8328b7cb149e949969ea8e4e65c1e71dc2e4e8b3",
	"0xb6f5160f76ad081c68ead03f2e59f007f42a7e78",

	// These are transaction receivers
	"0x7a250d5630b4cf539739df2c5dacb4c659f2488d",
	"0xdf401bbc478093d6dc1688c949ec08f9356851c3",
	"0xb31c1fff14cbd7cfa3836b1663d2bb82727e6606",
	"0x8ab9cced71a92cd5ee11feac8d9f67017372c5ea",
	"0xae7ab96520de3a18e5e111b5eaab095312d7fe84",
	"0x188a99ea8764aa1838ab11dc5ababd7706ddfdd0"
];
async function test_execution() {
	while (true) {
        // mocks = genEthAddress(250);
		await main(mocks).catch((err: unknown) => {
			throw err;
		});
	}
}

test_execution().catch(err => console.log(err));