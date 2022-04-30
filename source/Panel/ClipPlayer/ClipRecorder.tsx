import { Component, ReactNode } from "react";
import { useStatusWithEvent, IMixinStatusProps } from "@Context/Status";
import { Recorder } from "@Component/Recorder/Recorder";
import { ActuatorModel } from "@Model/Actuator";

@useStatusWithEvent("actuatorStartChange", "focusClipChange", "recordLoop")
class ClipRecorder extends Component<IMixinStatusProps> {
	public render(): ReactNode {

		let mod: "P" | "R" = this.props.status?.focusClip ? "P" : "R";
		let runner: boolean = false;
		let currentTime: number = 0;
		let name: string | undefined;

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
		}

		return <Recorder
			name={name}
			currentTime={currentTime}
			mode={mod}
			running={runner}
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
			}}
		/>
	}
}

export { ClipRecorder };