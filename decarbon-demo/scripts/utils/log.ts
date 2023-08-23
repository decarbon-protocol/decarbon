import fs from "fs";

export function log(content: string | any, path: string = "data/logs/unknown.log") {
	fs.appendFileSync(path, content.toString() + '\n', 'utf-8');
}

export function clearLog(path: string) {
    fs.writeFileSync(path, '', 'utf-8');
}