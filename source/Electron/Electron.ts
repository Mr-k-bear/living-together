import { app, BrowserWindow } from "electron";
import { Service } from "@Service/Service";
const ENV = process.env ?? {};

class ElectronApp {

	public service: Service;

	public serviceUrl: string = "http://127.0.0.1";

	public constructor() {
		this.service = new Service();
	}

	public async runService() {

		let defaultPort: number | undefined = parseInt(ENV.LIVING_TOGETHER_DEFAULT_PORT ?? "");
		if (isNaN(defaultPort)) defaultPort = undefined;

		this.serviceUrl = await this.service.run(
			ENV.LIVING_TOGETHER_BASE_PATH, defaultPort
		);
	}

	public mainWindows?: BrowserWindow;

	public async runMainThread() {

		await app.whenReady();

		await this.runService();

		this.mainWindows = new BrowserWindow({
			width: 800,
			height: 600,
			titleBarStyle: 'hidden',
			frame: false,
		});

		this.mainWindows.loadURL(this.serviceUrl);
	}
}

new ElectronApp().runMainThread();