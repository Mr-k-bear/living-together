import { IAnyObject, Model } from "@Model/Model";
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
}

/**
 * 剪辑片段
 */
class Clip {

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

		const frame: IFrame = {
			commands: commands,
			duration: t
		};

		this.frames.push(frame);

		return frame;
	}

	

	public constructor(model: Model) {
		this.model = model;
	}
}

export { Clip };