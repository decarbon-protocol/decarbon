import fs from "fs";

async function log(content: string | any, path: string = "data/logs/unknown.log") {
	fs.appendFileSync(path, content);
	fs.appendFileSync(path, "\n");
}

export default log;