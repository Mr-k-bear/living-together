import { IAnyObject, Model } from "@Model/Model";
import { v4 as uuid } from "uuid";
import { Group } from "@Model/Group";
import { Range } from "@Model/Range";
import { archiveObject2Parameter, IArchiveParseFn, parameter2ArchiveObject } from "@Model/Parameter";

interface IDrawCommand {
	type: "points" | "cube";
	id: string;
	data?: Float32Array;
	mapId?: number[];
	position?: number[];
	radius?: number[];
	parameter?: IAnyObject;
}

interface IFrame {
	commands: IDrawCommand[];
	duration: number;
	process: number;
}

interface IArchiveClip {
	id: string;
	time: number;
	name: string;
	frames: IFrame[];
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
	 * 判断两个 RenderParameter 是否相同
	 */
	public isRenderParameterEqual(p1?: IAnyObject, p2?: IAnyObject, r: boolean = true): boolean {

		if ((p1 && !p2) || (!p1 && p2)) {
			return false;
		}

		if (!p1 && !p2) {
			return true;
		}

		for (let key in p1!) {

			// 对象递归校验
			if (typeof p1[key] === "object" && !Array.isArray(p1[key])) {

				if (!(typeof (p2 as any)[key] === "object" && !Array.isArray((p2 as any)[key]))) {
					return false;
				}

				// 递归校验
				if (r) {
					if (!this.isRenderParameterEqual(p1[key], (p2 as any)[key], false)) {
						return false;
					}
				}
				
				// 浅校验
				else {
					if (p1[key] !== (p2 as any)[key]) {
						return false;
					}
				}
			}

			// 数组遍历校验
			else if (Array.isArray(p1[key])) {

				if (!Array.isArray((p2 as any)[key])) {
					return false;
				}

				for (let j = 0; j < p1[key].length; j++) {
					if (p1[key][j] !== (p2 as any)[key][j]) {
						return false;
					}
				}
			}

			// 数值直接校验
			else if (p1[key] !== (p2 as any)[key]) {
				return false;
			}
		}

		return true;
	}

	public cloneRenderParameter(p?: IAnyObject, res: IAnyObject = {}, r: boolean = true): IAnyObject | undefined {

		if (!p) return undefined;

		for (let key in p) {

			// 对象递归克隆
			if (typeof p[key] === "object" && !Array.isArray(p[key]) && r) {
				this.cloneRenderParameter(p[key], res, false);
			}

			// 数组克隆
			else if (Array.isArray(p[key])) {
				(res as any)[key] = p[key].concat([]);
			}

			// 数值克隆
			else {
				(res as any)[key] = p[key];
			}
		}

		return res;
	}

	public isArrayEqual(a1?: Array<number | string>, a2?: Array<number | string>): boolean {

		if ((a1 && !a2) || (!a1 && a2)) {
			return false;
		}

		if (!a1 && !a2) {
			return true;
		}

		for (let i = 0; i < a1!.length; i++) {
			if (a1![i] !== a2![i]) {
				return false;
			}
		}

		return true;
	}

	/**
	 * 从上一帧获取指令数据
	 */
	public getCommandFromLastFrame(type: IDrawCommand["type"], id: string, frame?: IFrame): IDrawCommand | undefined {
		let lastCommand: IDrawCommand[] = (frame ?? this.frames[this.frames.length - 1])?.commands;

		if (lastCommand) {
			for (let i = 0; i < lastCommand.length; i++) {
				if (type === lastCommand[i].type && id === lastCommand[i].id) {
					return lastCommand[i];
				}
			}
		}

		return undefined;
	}

	/**
	 * ID 映射
	 */
	private sorterIdMapper: Map<string, number> = new Map();
	private sorterIdMapperNextId: number = 1;

	/**
	 * 获取映射ID
	 */
	private getMapperId = (id: string): number => {
		let mapperId = this.sorterIdMapper.get(id);
		if (mapperId === undefined) {
			mapperId = this.sorterIdMapperNextId ++;
			this.sorterIdMapper.set(id, mapperId);
			return mapperId;
		} else {
			return mapperId;
		}
	}

	/**
	 * 录制一帧
	 */
	public record(t: number): IFrame {
		const commands: IDrawCommand[] = [];

		for (let i = 0; i < this.model.objectPool.length; i++) {

            let object = this.model.objectPool[i];
            object.renderParameter.color = object.color;

            if (object.display && object instanceof Group) {

				// 获取上一帧指令
				const lastCommand = this.getCommandFromLastFrame("points", object.id);

				// 记录
				const dataBuffer = object.exportPositionId(this.getMapperId);
				const recodeData: IDrawCommand = {
					type: "points",
					id: object.id,
					data: dataBuffer[0]
				}

				// 对比校验
				if (this.isRenderParameterEqual(object.renderParameter, lastCommand?.parameter)) {
					recodeData.parameter = lastCommand?.parameter;
				} else {
					recodeData.parameter = this.cloneRenderParameter(object.renderParameter);
				}

				if (this.isArrayEqual(dataBuffer[1], lastCommand?.mapId)) {
					recodeData.mapId = lastCommand?.mapId;
				} else {
					recodeData.mapId = dataBuffer[1];
				}

				commands.push(recodeData);
            }


            if (object.display && object instanceof Range) {

				// 获取上一帧指令
				const lastCommand = this.getCommandFromLastFrame("cube", object.id);

				// 记录
				const recodeData: IDrawCommand = {
					type: "cube",
					id: object.id
				}

				// 释放上一帧的内存
				if (this.isArrayEqual(object.position, lastCommand?.position)) {
					recodeData.position = lastCommand?.position;
				} else {
					recodeData.position = object.position.concat([]);
				}

				if (this.isArrayEqual(object.radius, lastCommand?.radius)) {
					recodeData.radius = lastCommand?.radius;
				} else {
					recodeData.radius = object.radius.concat([]);
				}

				if (this.isRenderParameterEqual(object.renderParameter, lastCommand?.parameter)) {
					recodeData.parameter = lastCommand?.parameter;
				} else {
					recodeData.parameter = this.cloneRenderParameter(object.renderParameter);
				}

				commands.push(recodeData);
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

	public readonly LastFrameData: "@L" = "@L";

	/**
	 * 压缩帧数据
	 */
	public compressed(): IFrame[] {
		const resFrame: IFrame[] = [];

		for (let i = 0; i < this.frames.length; i++) {
			const commands = this.frames[i].commands;
			const res: IDrawCommand[] = [];

			// 处理指令
			for (let j = 0; j < commands.length; j++) {
				
				// 压缩指令
				const command: IDrawCommand = {
					id: commands[j].id,
					type: commands[j].type
				};

				// 搜索上一帧相同指令
				const lastCommand = this.frames[i - 1] ?
					this.getCommandFromLastFrame(command.type, command.id, this.frames[i - 1]) :
					undefined;

				// 记录
				command.data = (lastCommand?.data === commands[j].data) ?
					this.LastFrameData as any : Array.from(commands[j].data ?? []);

				command.mapId = (lastCommand?.mapId === commands[j].mapId) ?
					this.LastFrameData as any : commands[j].mapId;

				command.position = (lastCommand?.position === commands[j].position) ?
					this.LastFrameData as any : commands[j].position?.concat([]);

				command.radius = (lastCommand?.radius === commands[j].radius) ?
					this.LastFrameData as any : commands[j].radius?.concat([]);

				command.parameter = (lastCommand?.parameter === commands[j].parameter) ?
					this.LastFrameData as any : parameter2ArchiveObject(commands[j].parameter as any);

				res.push(command);
			}

			resFrame.push({
				duration: this.frames[i].duration,
				process: this.frames[i].process,
				commands: res
			})
		}

		return resFrame;
	};

	/**
	 * 加载压缩帧数据
	 */
	public uncompressed(frames: IFrame[], paster: IArchiveParseFn): IFrame[] {
		const resFrame: IFrame[] = [];

		for (let i = 0; i < frames.length; i++) {
			const commands = frames[i].commands;
			const res: IDrawCommand[] = [];

			// 处理指令
			for (let j = 0; j < commands.length; j++) {
				
				// 压缩指令
				const command: IDrawCommand = {
					id: commands[j].id,
					type: commands[j].type
				};

				// 搜索上一帧相同指令
				const lastCommand = resFrame[resFrame.length - 1] ?
					this.getCommandFromLastFrame(command.type, command.id, resFrame[resFrame.length - 1]) :
					undefined;

				// 记录
				command.data = (this.LastFrameData as any === commands[j].data) ?
					lastCommand?.data : new Float32Array(commands[j].data ?? []);

				command.mapId = (this.LastFrameData as any === commands[j].mapId) ?
					lastCommand?.mapId : commands[j].mapId;

				command.position = (this.LastFrameData as any === commands[j].position) ?
					lastCommand?.position : commands[j].position;

				command.radius = (this.LastFrameData as any === commands[j].radius) ?
					lastCommand?.radius : commands[j].radius;

				command.parameter = (this.LastFrameData as any === commands[j].parameter) ?
					lastCommand?.parameter : archiveObject2Parameter(commands[j].parameter as any, paster);

				res.push(command);
			}

			resFrame.push({
				duration: frames[i].duration,
				process: frames[i].process,
				commands: res
			})
		}

		return resFrame;
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

	public toArchive(): IArchiveClip {
        return {
            id: this.id,
			time: this.time,
			name: this.name,
			frames: this.compressed()
        };
    }

    public fromArchive(archive: IArchiveClip, paster: IArchiveParseFn): void {
        this.id = archive.id,
		this.time = archive.time,
		this.name = archive.name,
		this.frames = this.uncompressed(archive.frames, paster);
    }
}

export { Clip, IFrame, IArchiveClip };