import { Theme } from "@Component/Theme/Theme";
import { Icon } from "@fluentui/react";
import { Clip } from "@Model/Clip";
import { Component, ReactNode } from "react";
import "./ClipList.scss";

interface IClipListProps {
	clips: Clip[];
	add?: () => any;
	delete?: (clip: Clip) => any;
}

class ClipList extends Component<IClipListProps> {

	private renderClip(clip: Clip) {
		return <div
			key={clip.id}
			className="clip-item"
		>
			<div className="clip-item-hole-view">
				{new Array(4).fill(0).map(() => {
					return <div className="clip-item-hole"/>
				})}
			</div>
			<div className="clip-icon-view">
				<Icon iconName="MyMoviesTV" className="icon"/>
				<Icon
					iconName="Delete"
					className="delete"
					onClick={() => {
						this.props.delete && this.props.delete(clip);
					}}
				/>
			</div>
			<div className="clip-item-content">
				<div className="title">{clip.name}</div>
				<div className="info">{clip.frames.length}</div>
			</div>
		</div>;
	}

	private renderAddButton(): ReactNode {
		return <div
			className="clip-item add-button"
			onClick={this.props.add}
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