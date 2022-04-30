import { Localization } from "@Component/Localization/Localization";
import { Theme } from "@Component/Theme/Theme";
import { Icon } from "@fluentui/react";
import { Clip } from "@Model/Clip";
import { Component, ReactNode } from "react";
import "./ClipList.scss";

interface IClipListProps {
	clips: Clip[];
	focus?: Clip;
	disable?: boolean;
	add?: () => any;
	click?: (clip: Clip) => any;
	delete?: (clip: Clip) => any;
}

class ClipList extends Component<IClipListProps> {

	private isInnerClick: boolean = false;

	private resolveCallback(fn?: (p: any) => any, p?: any): any {
		if (this.props.disable) {
			return false;
		}
		if (fn) {
			return fn(p);
		}
	}

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

	private getClipInfo(clip: Clip): string {
		let fps = Math.floor(clip.frames.length / clip.time);
		if (isNaN(fps)) fps = 0;
		return `${this.parseTime(clip.time)} ${fps}fps`;
	}

	private renderClip(clip: Clip) {

		const focus = clip.equal(this.props.focus);
		const disable = this.props.disable;
		const classList = ["clip-item"];

		if (focus) {
			classList.push("focus");
		}

		if (disable) {
			classList.push("disable");
		} else {
			classList.push("able");
		}

		return <div
			key={clip.id}
			className={classList.join(" ")}
			onClick={() => {
				if (this.isInnerClick) {
					this.isInnerClick = false;
				} else {
					this.resolveCallback(this.props.click, clip);
				}
			}}
		>
			<div className="clip-item-hole-view">
				{new Array(4).fill(0).map((_, index) => {
					return <div className="clip-item-hole" key={index}/>
				})}
			</div>
			<div className="clip-icon-view">
				<Icon iconName="MyMoviesTV" className="icon"/>
				<Icon
					iconName="Delete"
					className="delete"
					onClick={() => {
						this.isInnerClick = true;
						this.resolveCallback(this.props.delete, clip);
					}}
				/>
			</div>
			<div className="clip-item-content">
				<div className="title">{clip.name}</div>
				<div className="info">{
					clip.isRecording ?
						<Localization i18nKey="Panel.Info.Behavior.Clip.Uname.Clip"/> :
						this.getClipInfo(clip)
				}</div>
			</div>
		</div>;
	}

	private renderAddButton(): ReactNode {

		const classList = ["clip-item", "add-button"];

		if (this.props.disable) {
			classList.push("disable");
		} else {
			classList.push("able");
		}

		return <div
			key="ADD_BUTTON"
			className={classList.join(" ")}
			onClick={() => this.resolveCallback(this.props.add)}
		>
            <Icon iconName="Add"/>
        </div>
	}

	public render(): ReactNode {
		return <Theme className="clip-list-root">
			{ this.props.clips.map((clip => {
				return this.renderClip(clip);
			})) }
			{ this.renderAddButton() }
		</Theme>;
	}
}

export { ClipList };