import { Model } from "@Model/Model";
import { Emitter } from "@Model/Emitter";

interface IActuatorEvent {
	startChange: boolean;
	loop: number;
}

/**
 * 模型执行器
 */
class Actuator extends Emitter<IActuatorEvent> {

	/**
	 * 速度系数
	 */
	public speed: number = 1;

	/**
	 * 模拟帧率
	 */
	public fps: number = 36;

	/**
	 * 仿真是否进行
	 */
	private startFlag: boolean = false;

	/**
	 * 主时钟状态控制
	 */
	public start(start?: boolean): boolean {
		if (start === undefined) {
			return this.startFlag;
		} else {
			this.startFlag = start;
			this.lastTime = 0;
			this.alignTimer = 0;
			this.emit("startChange", start);
			return start;
		}
	}

	/**
	 * 绑定模型
	 */
	public model: Model;

	/**
	 * 上一帧的时间
	 */
	private lastTime: number = 0;

	/**
	 * 对其计时器
	 */
	private alignTimer: number = 0;

	public tickerType: 1 | 2 = 2;

	private ticker(t: number) {
		if (this.startFlag && t !== 0) {
			if (this.lastTime === 0) {
				this.lastTime = t;
			} else {
				let durTime = (t - this.lastTime) / 1000;
				this.lastTime = t;

				// 丢帧判定
				if (durTime > 0.1) {
					console.log("Actuator: Ticker dur time error. dropping...")
				} else {
					this.alignTimer += durTime;
					if (this.alignTimer > (1 / this.fps)) {
						this.model.update(this.alignTimer * this.speed);
						this.emit("loop", this.alignTimer);
						this.alignTimer = 0;
					}
				}
			}
		} else {
			this.emit("loop", Infinity);
		}
	}

	/**
	 * 帧率对其时钟
	 * 1、使用 requestAnimationFrame 保证最高的性能
	 * 2、最大模拟帧率只能小于 60
	 * 3、可能出现帧率对其问题
	 */
	private tickerAlign = (t: number) => {
		this.ticker(t);
		requestAnimationFrame(this.tickerAlign);
	}

	/**
	 * 精确时钟
	 */
	private tickerExp = () => {
		this.ticker(window.performance.now());
		setTimeout(this.tickerExp, (1 / this.fps) * 1000);
	}

	/**
	 * 执行器
	 */
	private runTicker = (t: number) => {
		if (this.tickerType === 1) {
			this.ticker(t);
			requestAnimationFrame(this.runTicker);
		} else {
			this.ticker(window.performance.now());
			setTimeout(this.runTicker, (1 / this.fps) * 1000);
		}
	}

	public constructor(model: Model) {
		super();
		this.model = model;
		this.runTicker(0);
	}
}

export { Actuator }