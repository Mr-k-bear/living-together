import { app, BrowserWindow, ipcMain } from "electron";
import { Service } from "@Service/Service";
import { join as pathJoin } from "path";
const ENV = process.env ?? {};

class ElectronApp {

	public service: Service;

	public serviceUrl: string = "http://127.0.0.1";

	public constructor() {
		this.service = new Service();
	}

	public async runService() {

		if (ENV.LIVING_TOGETHER_SERVICE) {
			this.serviceUrl = ENV.LIVING_TOGETHER_SERVICE;
			return;
		}

		let defaultPort: number | undefined = parseInt(ENV.LIVING_TOGETHER_DEFAULT_PORT ?? "");
		if (isNaN(defaultPort)) defaultPort = undefined;

		this.serviceUrl = await this.service.run(
			ENV.LIVING_TOGETHER_BASE_PATH, defaultPort
		);
	}

	public simulatorWindow?: BrowserWindow;

	public async runMainThread() {

		await app.whenReady();

		await this.runService();

		let preload = pathJoin(__dirname, "./SimulatorWindow.js");

		// if (ENV.LIVING_TOGETHER_BASE_PATH) {
		// 	preload = pathJoin(__dirname, ENV.LIVING_TOGETHER_BASE_PATH, "./SimulatorWindow.js");
		// }

		this.simulatorWindow = new BrowserWindow({
			width: 800,
			height: 600,
			titleBarStyle: 'hidden',
			frame: false,
			minWidth: 460,
			minHeight: 300,
			webPreferences: { preload }
		});

		this.simulatorWindow.loadURL(this.serviceUrl + (ENV.LIVING_TOGETHER_WEB_PATH ?? "/resources/app/"));

		this.handelSimulatorWindowBehavior();

		app.on('window-all-closed', function () {
			if (process.platform !== 'darwin') app.quit()
		});
	}

	private handelSimulatorWindowBehavior() {

		ipcMain.on("windows.close", () => {
			this.simulatorWindow?.close();
		});

		ipcMain.on("windows.maximize", () => {
			this.simulatorWindow?.maximize();
		});

		ipcMain.on("windows.unMaximize", () => {
			this.simulatorWindow?.unmaximize();
		});

		ipcMain.on("windows.isMaximized", (event) => {
			event.returnValue = this.simulatorWindow?.isMaximized();
		});

		ipcMain.on("windows.minimize", (event) => {
			this.simulatorWindow?.minimize();
		});

		const sendWindowsChangeMessage = () => {
			this.simulatorWindow?.webContents.send("windows.windowsSizeStateChange");
		}

		this.simulatorWindow?.on("maximize", sendWindowsChangeMessage);
		this.simulatorWindow?.on("unmaximize", sendWindowsChangeMessage);
	}
}

new ElectronApp().runMainThread();