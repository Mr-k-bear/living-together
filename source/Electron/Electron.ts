import { app, BrowserWindow } from "electron";

async function main() {

	await app.whenReady();

	const win = new BrowserWindow({
		width: 800,
		height: 600
	});

	win.loadURL("https://www.baidu.com");

}

main();