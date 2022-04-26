import { contextBridge, ipcRenderer } from "electron";
import { ISimulatorAPI } from "@Electron/SimulatorAPI";

const emitterMap: { fn?: Function } = { fn: undefined };

const emit = (type: string, evt?: any) => {
	if (emitterMap.fn) {
		emitterMap.fn(type, evt);
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

	fileSave(text: string, name: string, title: string, button: string, url?: string) {
		ipcRenderer.send("windows.fileSave", text, name, title, button, url);
	},

	mapEmit: (fn: Function) => { emitterMap.fn = fn },
} as any;

ipcRenderer.on("windows.windowsSizeStateChange", () => {
	emit("windowsSizeStateChange");
});

ipcRenderer.on("windows.EndFileSave", (_, name: string, url: string, success: boolean) => {
	emit("fileSave", {name, url, success});
});

contextBridge.exposeInMainWorld("API", API);