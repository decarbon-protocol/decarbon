function dec2hex(s: number) {
	let hexString = s.toString(16);
	if (hexString.length % 2 !== 0) {
		hexString = "0" + hexString;
	}
	return "0x" + hexString;
}

export default dec2hex;