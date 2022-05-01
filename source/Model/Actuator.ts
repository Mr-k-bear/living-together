import { Model } from "@Model/Model";
import { Emitter } from "@Model/Emitter";
import { Clip, IFrame } from "@Model/Clip";

enum ActuatorModel {
	Play = 1,
	Record = 2,
	View = 3,
	Offline = 4
}

interface IActuatorEvent {
	startChange: boolean;
	record: number;
	loop: number;
	offline: number;
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
	 * 模式
	 */
	public mod: ActuatorModel = ActuatorModel.View;

	/**
	 * 录制剪辑
	 */
	public recordClip?: Clip;

	/**
	 * 播放剪辑
	 */
	public playClip?: Clip;

	/**
	 * 播放帧
	 */
	public playFrame?: IFrame;

	/**
	 * 播放帧数
	 */
	 public playFrameId: number = 0;

	/**
	 * 开始录制
	 */
	public startRecord(clip: Clip) {

		// 记录录制片段
		this.recordClip = clip;
		clip.isRecording = true;

		// 如果仿真未开启，开启仿真
		if (!this.start()) this.start(true);

		// 设置状态
		this.mod = ActuatorModel.Record;
	}

	/**
	 * 结束录制
	 */
	public endRecord() {

		this.recordClip && (this.recordClip.isRecording = false);
		this.recordClip = undefined;

		// 如果仿真未停止，停止仿真
		if (this.start()) this.start(false);

		// 设置状态
		this.mod = ActuatorModel.View;
	}

	public startPlay(clip: Clip) {

		// 如果仿真正在进行，停止仿真
		if (this.start()) this.start(false);

		// 如果正在录制，阻止播放
		if (this.mod === ActuatorModel.Record) {
			return;
		}

		// 如果正在播放，暂停播放
		if (this.mod === ActuatorModel.Play) {
			this.pausePlay();
		}

		// 设置播放对象
		this.playClip = clip;

		// 设置播放帧数
		this.playFrameId = 0;
		this.playFrame = clip.frames[this.playFrameId];

		// 播放第一帧
		clip.play(this.playFrame);

		// 激发时钟状态事件
		this.emit("startChange", true);
	}

	public endPlay() {

		// 如果正在播放，暂停播放
		if (this.mod === ActuatorModel.Play) {
			this.pausePlay();
		}

		// 更新模式
		this.mod = ActuatorModel.View;

		// 清除状态
		this.playClip = undefined;
		this.playFrameId = 0;
		this.playFrame = undefined;

		// 渲染模型
		this.model.draw();

		// 激发时钟状态事件
		this.emit("startChange", false);
	}

	/**
	 * 是否播放完毕
	 */
	public isPlayEnd() {
		if (this.playClip && this.playFrame) {
			if (this.playFrameId >= (this.playClip.frames.length - 1)) {
				return true;
			} else {
				return false;
			}
		} else {
			return true;
		}
	}

	public playing() {

		// 如果播放完毕了，从头开始播放
		if (this.isPlayEnd() && this.playClip) {
			this.startPlay(this.playClip);
		}

		// 更新模式
		this.mod = ActuatorModel.Play;

		// 启动播放时钟
		this.playTicker();

		// 激发时钟状态事件
		this.emit("startChange", false);
	}

	public pausePlay() {

		// 更新模式
		this.mod = ActuatorModel.View;

		// 激发时钟状态事件
		this.emit("startChange", false);
	}

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

	private playTickerTimer?: number;

	/**
	 * 设置播放进度
	 */
	public setPlayProcess(id: number) {
		if (this.playClip && id >= 0 && id < this.playClip.frames.length) {
		
			// 跳转值这帧
			this.playFrameId = id;
			this.playFrame = this.playClip.frames[this.playFrameId];
			this.emit("record", this.playFrame.duration);

			if (this.mod !== ActuatorModel.Play) {
				this.playClip.play(this.playFrame);
			}
		}
	}

	/**
	 * 离线渲染参数
	 */
	public offlineAllFrame: number = 0;
	public offlineCurrentFrame: number = 0;
	private offlineRenderTickTimer?: number;

	/**
	 * 关闭离线渲染
	 */
	public endOfflineRender() {

		// 清除 timer
		clearTimeout(this.offlineRenderTickTimer);

		this.recordClip && (this.recordClip.isRecording = false);
		this.recordClip = undefined;
		
		// 设置状态
		this.mod = ActuatorModel.View;

		// 激发结束事件
		this.start(false);
		this.emit("record", 0);
	}

	/**
	 * 离线渲染 tick
	 */
	private offlineRenderTick(dt: number) {

		if (this.mod !== ActuatorModel.Offline) {
			return;
		}

		if (this.offlineCurrentFrame >= this.offlineAllFrame) {
			return this.endOfflineRender();
		}
		
		// 更新模型
		this.model.update(dt);

		// 录制
		this.recordClip?.record(dt);

		// 限制更新频率
		if (this.offlineCurrentFrame % 10 === 0) {
			this.emit("offline", dt);
		}

		this.offlineCurrentFrame++

		if (this.offlineCurrentFrame <= this.offlineAllFrame) {
			
			// 下一个 tick
			this.offlineRenderTickTimer = setTimeout(() => this.offlineRenderTick(dt)) as any;

		} else {
			this.endOfflineRender();
		}
	}

	/**
	 * 离线渲染
	 */
	public offlineRender(clip: Clip, time: number, fps: number) {
		
		// 记录录制片段
		this.recordClip = clip;
		clip.isRecording = true;

		// 如果仿真正在进行，停止仿真
		if (this.start()) this.start(false);

		// 如果正在录制，阻止
		if (this.mod === ActuatorModel.Record || this.mod === ActuatorModel.Offline) {
			return;
		}

		// 如果正在播放，暂停播放
		if (this.mod === ActuatorModel.Play) {
			this.pausePlay();
		}

		// 设置状态
		this.mod = ActuatorModel.Offline;

		// 计算帧数
		this.offlineCurrentFrame = 0;
		this.offlineAllFrame = Math.round(time * fps) - 1;
		let dt = time / this.offlineAllFrame;

		// 第一帧渲染
		clip.record(0);

		// 开启时钟
		this.offlineRenderTick(dt);

		this.emit("record", dt);
	}

	/**
	 * 播放时钟
	 */
	private playTicker() {

		if (this.playClip && this.playFrame && this.mod === ActuatorModel.Play) {

			// 播放当前帧
			this.playClip.play(this.playFrame);

			// 没有完成播放，继续播放
			if (!this.isPlayEnd()) {

				// 跳转值下一帧
				this.playFrameId ++;
				this.playFrame = this.playClip.frames[this.playFrameId];
				this.emit("record", this.playFrame.duration);

				// 清除计时器，保证时钟唯一性
				clearTimeout(this.playTickerTimer);

				// 延时
				this.playTickerTimer = setTimeout(() => {
					this.playTicker();
				}, this.playFrame.duration * 1000) as any;

			} else {
				this.pausePlay();
			}
		} else {
			this.pausePlay();
		}
	}

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

						// 更新模型
						this.model.update(this.alignTimer * this.speed);

						// 绘制模型
						this.model.draw();

						// 录制模型
						if (
							this.mod === ActuatorModel.Record ||
							this.mod === ActuatorModel.Offline
						) {
							this.recordClip?.record(this.alignTimer * this.speed);
							this.emit("record", this.alignTimer);
						}

						this.emit("loop", this.alignTimer);
						this.alignTimer = 0;
					}
				}
			}
		}
		
		else {
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

export { Actuator, ActuatorModel }