import { IAnyObject, Model } from "@Model/Model";
import { v4 as uuid } from "uuid";
import { Group } from "@Model/Group";
import { Range } from "@Model/Range";

interface IDrawCommand {
	type: "points" | "cube";
	id: string;
	data?: Float32Array;
	position?: number[];
	radius?: number[];
	parameter?: IAnyObject;
}

interface IFrame {
	commands: IDrawCommand[];
	duration: number;
	process: number;
}

/**
 * 剪辑片段
 */
class Clip {

	public id: string;

	/**
	 * 时间
	 */
	public time: number = 0;

	/**
	 * 用户自定义名称
	 */
	public name: string = "";

	/**
	 * 模型
	 */
	public model: Model;

	/**
	 * 全部帧
	 */
	public frames: IFrame[] = [];

	/**
	 * 是否正在录制
	 */
	public isRecording: boolean = false;

	/**
	 * 录制一帧
	 */
	public record(t: number): IFrame {
		const commands: IDrawCommand[] = [];

		for (let i = 0; i < this.model.objectPool.length; i++) {

            let object = this.model.objectPool[i];
            object.renderParameter.color = object.color;

            if (object.display && object instanceof Group) {
				commands.push({
					type: "points",
					id: object.id,
					data: object.exportPositionData(),
					parameter: object.renderParameter
				});
            }


            if (object.display && object instanceof Range) {
				commands.push({
					type: "cube",
					id: object.id,
					position: object.position,
					radius: object.radius,
					parameter: object.renderParameter
				});
            }
        }

		const dt = this.frames.length <= 0 ? 0 : t;
		this.time += dt;
		
		const frame: IFrame = {
			commands: commands,
			duration: dt,
			process: this.time
		};
		
		this.frames.push(frame);
		return frame;
	}

	/**
	 * 播放一帧
	 */
	public play(frame: IFrame) {

		// 清除全部渲染状态
        this.model.renderer.clean();

		// 执行全部渲染指令
		for (let i = 0; i < frame.commands.length; i++) {
			const command: IDrawCommand = frame.commands[i];

			if (command.type === "cube") {
				this.model.renderer.cube(command.id, command.position, command.radius, command.parameter);
			}

			else if (frame.commands[i].type === "points") {
				this.model.renderer.points(command.id, command.data, command.parameter);
			}
		}
	}

	public equal(clip?: Clip) {
		return clip === this || clip?.id === this.id;
	}

	public constructor(model: Model) {
		this.model = model;
		this.id = uuid();
	}
}

export { Clip, IFrame };