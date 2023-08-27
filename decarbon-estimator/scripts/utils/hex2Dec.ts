function hex2Dec(hexString: string) {
	// Remove the "0x" prefix if it exists
	if (hexString.startsWith("0x")) {
		hexString = hexString.slice(2);
	}

	// Convert the hexadecimal string to a decimal number
	const decimalNumber = parseInt(hexString, 16);

	return decimalNumber;
}

// test
//   const hexValue = "0x2540be400";
//   const decimalValue = hexToDecimal(hexValue);
//   console.log(decimalValue); // Output: 703252

export default hex2Dec;