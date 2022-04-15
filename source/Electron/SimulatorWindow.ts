import { contextBridge, ipcRenderer } from "electron";
import { ISimulatorAPI } from "@Electron/SimulatorAPI"

const API: ISimulatorAPI = {

	close() {
		ipcRenderer.send("close");
	},

	maximize(){},
 
	unMaximize(){},
 
	isMaximized(){
		return false
	}
}

contextBridge.exposeInMainWorld("API", API);