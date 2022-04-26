import { app, BrowserWindow, ipcMain, dialog } from "electron";
import { Service } from "@Service/Service";
import { join as pathJoin } from "path";
import { writeFile } from "fs";
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

	public loadingPage?: BrowserWindow;
	public simulatorWindow?: BrowserWindow;

	public async showLoadingPage() {
		return new Promise((r) => {

			this.loadingPage = new BrowserWindow({
				width: 603,
				height: 432,
				fullscreenable: false,
				skipTaskbar: true,
				resizable: false,
				titleBarStyle: 'hidden',
				frame: false,
				show: false
			});

			this.loadingPage.loadFile(ENV.LIVING_TOGETHER_LOADING_PAGE ?? "./LoadingPage.html");

			this.loadingPage.on("ready-to-show", () => {
				this.loadingPage?.show();
				r(undefined);
			});
		});
	}

	public async runMainThread() {

		await app.whenReady();

		await this.showLoadingPage();

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
			webPreferences: { preload },
			show: false,
		});

		this.simulatorWindow.loadURL(this.serviceUrl + (ENV.LIVING_TOGETHER_WEB_PATH ?? "/resources/app.asar/"));

		this.simulatorWindow.on("ready-to-show", () => {
			setTimeout(() => {
				this.loadingPage?.close();
				this.simulatorWindow?.show();
			}, 1220);
		});

		this.handelSimulatorWindowBehavior();
		this.handelFileChange();

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

	private handelFileChange() {

		// 文件保存
		const saveFile = async (path: string, text: string) => {
			return new Promise((r) => {
				writeFile(path ?? "", text, {}, (e) => {
					this.simulatorWindow?.webContents.send(
						"windows.EndFileSave",
						(path.match(/.+(\/|\\)(.+)$/) ?? [])[2],
						path, !e
					);
					r(undefined);
				});
			})
		};

		// 处理文件保存事件
		ipcMain.on("windows.fileSave",
			(_, text: string, name: string, title: string, button: string, url?: string) => {

				// 如果没有路径，询问新的路径
				if (url) {
					saveFile(url, text);
				}

				// 询问保存位置
				else {
					dialog.showSaveDialog(this.simulatorWindow!, {
						title: title,
						buttonLabel: button,
						filters: [
							{ name: name, extensions: ["ltss"] }
						]
					}).then(res => {

						// 用户选择后继续保存
						if (!res.canceled && res.filePath) {
							saveFile(res.filePath, text);
						} else {
							this.simulatorWindow?.webContents.send(
								"windows.EndFileSave",
								undefined, undefined, false
							);
						}
					});
				}
			}
		);
	}
}

new ElectronApp().runMainThread();