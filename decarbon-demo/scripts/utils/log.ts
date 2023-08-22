import fs from "fs";

export function log(content: string | any, path: string = "data/logs/unknown.log") {
	fs.appendFileSync(path, content.toString());
	fs.appendFileSync(path, "\n");
}

export function clearLog(path: string) {
    fs.writeFileSync(path, '');
}