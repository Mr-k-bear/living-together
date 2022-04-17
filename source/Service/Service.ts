import { Express } from "express";
import * as express from "express";
import * as detect from "detect-port";

class Service {

	/**
	 * 默认端口
	 */
	public servicePort: number = 12100;

	/**
	 * Express 实例
	 */
	public app!: Express;

	/**
	 * 获取空闲接口
	 */
	private async getFreePort(): Promise<number> {

		let freePort: number = this.servicePort;
		
		try {
			freePort = await detect(this.servicePort);
		} catch (err) {
			console.log(err);
		}

		return freePort;
	}

	public async run(url?: string, port?: number) {

		this.servicePort = port ?? await this.getFreePort();

		this.app = express();

		this.app.use("/", express.static(url ?? "./"));

		this.app.listen(this.servicePort);

		console.log("Service: service run in port " + this.servicePort);

		return "http://127.0.0.1:" + this.servicePort;
	}
}

export { Service };