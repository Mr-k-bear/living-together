import { Localization } from "@Component/Localization/Localization";
import { BackgroundLevel, FontLevel, Theme } from "@Component/Theme/Theme";
import { Icon, Slider } from "@fluentui/react";
import { Component, ReactNode } from "react";
import "./Recorder.scss";

interface IRecorderProps {
	mode: "P" | "R",
	running?: boolean,
	name?: string;
	fps?: number;
	allFrame?: number;
	currentFrame?: number;
	allTime?: number;
	currentTime?: number;
	action?: () => void;
	valueChange?: (value: number) => any;
}

class Recorder extends Component<IRecorderProps> {

	private parseTime(time?: number): string {
		if (time === undefined) {
			return "0:0:0:0";
		}
		const h = Math.floor(time / 3600);
		const m = Math.floor((time % 3600) / 60);
		const s = Math.floor((time % 3600) % 60);
		const ms = Math.floor((time % 1) * 1000);
		return `${h}:${m}:${s}:${ms}`;
	}

	private getRecordInfo(): ReactNode {
		if (this.props.mode === "P") {
			return <Localization
				i18nKey="Panel.Info.Behavior.Clip.Time.Formate"
				options={{
					current: this.parseTime(this.props.currentTime),
					all: this.parseTime(this.props.allTime),
					fps: this.props.fps ? this.props.fps.toString() : "0"
				}}
			/>;
		}
		else if (this.props.mode === "R") {
			return <Localization
				i18nKey="Panel.Info.Behavior.Clip.Record.Formate"
				options={{
					time: this.parseTime(this.props.currentTime),
				}}
			/>;
		}
	}

	private getActionIcon(): string {
		if (this.props.mode === "P") {
			if (this.props.running) {
				return "Pause";
			} else {
				return "Play";
			}
		}
		else if (this.props.mode === "R") {
			if (this.props.running) {
				return "Stop";
			} else {
				return "StatusCircleRing";
			}
		}
		return "Play";
	}

	public render(): ReactNode {

		const isSliderDisable = this.props.mode === "R";
		const isJumpDisable = this.props.mode === "R";

		return <Theme
			className="recorder-root"
			backgroundLevel={BackgroundLevel.Level4}
			fontLevel={FontLevel.normal}
		>
			<Slider
				min={0}
				disabled={isSliderDisable}
				value={this.props.currentFrame}
				max={this.props.allFrame}
				className={"recorder-slider" + (isSliderDisable ? " disable" : "")}
				showValue={false}
				onChange={(value) => {
					if (this.props.valueChange && !isSliderDisable) {
						this.props.valueChange(value);
					}
				}}
			/>
			<div className="recorder-content">
				<div className="time-view">
					{this.getRecordInfo()}
				</div>
				<div className="ctrl-button">
					<div
						className={"ctrl-action" + (isJumpDisable ? " disable" : "")}
						onClick={() => {
							if (this.props.valueChange && !isJumpDisable && this.props.currentFrame !== undefined) {
								this.props.valueChange(this.props.currentFrame - 1);
							}
						}}
					>
						<Icon iconName="Back"/>
					</div>
					<div className="ctrl-action ctrl-action-main" onClick={this.props.action}>
						<Icon iconName={this.getActionIcon()}/>
					</div>
					<div
						className={"ctrl-action" + (isJumpDisable ? " disable" : "")}
						onClick={() => {
							if (this.props.valueChange && !isJumpDisable && this.props.currentFrame !== undefined) {
								this.props.valueChange(this.props.currentFrame + 1);
							}
						}}
					>
						<Icon iconName="Forward"/>
					</div>
				</div>
				<div className="speed-view">
					{
						this.props.name ?
							<span>{this.props.name}</span> :
							<Localization i18nKey="Panel.Info.Behavior.Clip.Uname.Clip"/>
					}
				</div>
			</div>
		</Theme>;
	}
}

export { Recorder };