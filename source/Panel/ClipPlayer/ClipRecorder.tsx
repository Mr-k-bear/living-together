import { Component, ReactNode } from "react";
import { useStatusWithEvent, IMixinStatusProps } from "@Context/Status";
import { Recorder } from "@Component/Recorder/Recorder";
import { ActuatorModel } from "@Model/Actuator";

@useStatusWithEvent("actuatorStartChange", "focusClipChange", "recordLoop")
class ClipRecorder extends Component<IMixinStatusProps> {
	public render(): ReactNode {

		let mod: "P" | "R" = this.props.status?.focusClip ? "P" : "R";
		let runner: boolean = false;
		let currentTime: number | undefined = 0;
		let allTime: number | undefined = 0;
		let name: string | undefined;
		let currentFrame: number | undefined = 0;
		let allFrame: number | undefined = 0;
		let fps: number | undefined = 0;

		// 是否开始录制
		if (mod === "R") {

			// 是否正在录制
			runner = this.props.status?.actuator.mod === ActuatorModel.Record ||
			this.props.status?.actuator.mod === ActuatorModel.Offline;

			currentTime = this.props.status?.actuator.recordClip?.time ?? 0;

			name = this.props.status?.actuator.recordClip?.name;
		}

		else if (mod === "P") {

			// 是否正在播放
			runner = this.props.status?.actuator.mod === ActuatorModel.Play;
			name = this.props.status?.focusClip?.name;
			allTime = this.props.status?.focusClip?.time;
			allFrame = this.props.status?.focusClip?.frames.length;
			currentFrame = this.props.status?.actuator.playFrameId;
			currentTime = this.props.status?.actuator.playFrame?.process;

			if (allFrame !== undefined) {
				allFrame --;
			}

			if (allTime !== undefined && allFrame !== undefined) {
				fps = Math.round(allFrame / allTime);
			}
		}

		return <Recorder
			name={name}
			currentTime={currentTime}
			allTime={allTime}
			currentFrame={currentFrame}
			allFrame={allFrame}
			mode={mod}
			running={runner}
			fps={fps}
			action={() => {

				// 开启录制
				if (mod === "R" && !runner) {

					// 获取新实例
					let newClip = this.props.status?.newClip();
					
					// 开启录制时钟
					this.props.status?.actuator.startRecord(newClip!);
					console.log("ClipRecorder: Rec start...");
				}

				// 暂停录制
				if (mod === "R" && runner) {

					// 暂停录制时钟
					this.props.status?.actuator.endRecord();
					console.log("ClipRecorder: Rec end...");
				}

				// 开始播放
				if (mod === "P" && !runner) {

					// 启动播放时钟
					this.props.status?.actuator.playing();
					console.log("ClipRecorder: Play start...");
				}

				// 暂停播放
				if (mod === "P" && runner) {

					// 启动播放时钟
					this.props.status?.actuator.pausePlay();
					console.log("ClipRecorder: Pause start...");
				}
			}}
		/>
	}
}

export { ClipRecorder };