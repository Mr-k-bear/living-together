import { contextBridge, ipcRenderer } from "electron";
import { ISimulatorAPI } from "@Electron/SimulatorAPI"

const emitterMap: Array<[key: string, value: Function[]]> = [];
const queryEmitter = (key: string) => {
	let res: (typeof emitterMap)[0] | undefined;
	emitterMap.forEach((item) => {
		if (item[0] === key) res = item;
	});

	if (res) {
		if (Array.isArray(res[1])) return res[1];
		res[1] = [];
		return res[1];
	}

	else {
		res = [key, []];
		emitterMap.push(res);
		return res[1];
	}
}

const API: ISimulatorAPI = {
	
	close() {
		ipcRenderer.send("windows.close");
	},

	maximize() {
		ipcRenderer.send("windows.maximize");
	},

	unMaximize() {
		ipcRenderer.send("windows.unMaximize");
	},

	isMaximized() {
		return ipcRenderer.sendSync("windows.isMaximized");
	},

	minimize() {
		ipcRenderer.send("windows.minimize");
	},

	all: new Map() as any,

	resetAll: () => emitterMap.splice(0),
	reset: (type) => queryEmitter(type).splice(0),
	on: (type, handler) => queryEmitter(type).push(handler),
	off: (type, handler) => {
		const handlers = queryEmitter(type);
		handlers.splice(handlers.indexOf(handler!) >>> 0, 1);
	},
	emit: ((type: string, evt: any) => {
		queryEmitter(type).slice().map((handler: any) => { handler(evt) });
	}) as any,
}

ipcRenderer.on("windows.windowsSizeStateChange", () => {
	API.emit("windowsSizeStateChange");
});

contextBridge.exposeInMainWorld("API", API);