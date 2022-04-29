import { Localization } from "@Component/Localization/Localization";
import { BackgroundLevel, FontLevel, Theme } from "@Component/Theme/Theme";
import { Icon, Slider } from "@fluentui/react";
import { Component, ReactNode } from "react";
import "./Recorder.scss";

interface IRecorderProps {
	mode?: "P" | "R",
	name?: string;
	fps?: number;
	allFrame?: number;
	currentFrame?: number;
	allTime?: number;
	currentTime?: number;
}

class Recorder extends Component<IRecorderProps> {

	private parseTime(time?: number): string {
		if (time === undefined) {
			return "--:--:--:--";
		}
		const h = Math.floor(time / 3600);
		const m = Math.floor((time % 3600) / 60);
		const s = Math.floor((time % 3600) % 60);
		const ms = Math.floor((time % 1) * 1000);
		return `${h}:${m}:${s}:${ms}`;
	}

	public render(): ReactNode {
		return <Theme
			className="recorder-root"
			backgroundLevel={BackgroundLevel.Level4}
			fontLevel={FontLevel.normal}
		>
			<Slider
				min={0}
				value={this.props.currentFrame}
				max={this.props.allFrame}
				className="recorder-slider"
				showValue={false}
			/>
			<div className="recorder-content">
				<div className="time-view">
					<Localization
						i18nKey="Panel.Info.Behavior.Clip.Time.Formate"
						options={{
							current: this.parseTime(this.props.currentTime),
							all: this.parseTime(this.props.allTime),
							fps: this.props.fps ? this.props.fps.toString() : "--"
						}}
					/>
				</div>
				<div className="ctrl-button">
					<div className="ctrl-action">
						<Icon iconName="Back"/>
					</div>
					<div className="ctrl-action ctrl-action-main">
						<Icon iconName="Play"/>
					</div>
					<div className="ctrl-action">
						<Icon iconName="Forward"/>
					</div>
				</div>
				<div className="speed-view">
					{this.props.name}
				</div>
			</div>
		</Theme>;
	}
}

export { Recorder };