import { Theme } from "@Component/Theme/Theme";
import { Component, ReactNode } from "react";
import { IRenderBehavior, Behavior, BehaviorRecorder } from "@Model/Behavior";
import { Icon } from "@fluentui/react";
import { Localization } from "@Component/Localization/Localization";
import "./BehaviorList.scss";

interface IBehaviorListProps {
	behaviors: IRenderBehavior[];
	focusBehaviors?: IRenderBehavior[];
	click?: (behavior: IRenderBehavior) => void;
	action?: (behavior: IRenderBehavior) => void;
	actionType?: "info" | "delete";
}

class BehaviorList extends Component<IBehaviorListProps> {

	private isFocus(behavior: IRenderBehavior): boolean {
		if (this.props.focusBehaviors) {
			for (let i = 0; i < this.props.focusBehaviors.length; i++) {
				if (this.props.focusBehaviors[i] === behavior) {
					return true;
				}
			}
		}
		return false;
	}

	private renderActionButton(behavior: IRenderBehavior) {

		const classList: string[] = ["info-button", "behavior-action-button"];
		let iconName = "Info";

		switch (this.props.actionType) {
			case "delete":
				classList.push("hover-red");
				iconName = "Delete";
				break;
			case "info":
				classList.push("hover-blue");
				iconName = "Info";
				break;
			default:
				classList.push("hover-blue");
		}

		return <div
			className={classList.join(" ")}
			onClick={() => {
				this.isActionClick = true;
				if (this.props.action) {
					this.props.action(behavior)
				}
			}}
		>
			<Icon iconName={iconName}/>
		</div>
	}

	private renderTerm(key: string, className: string, needLocal: boolean) {
		if (needLocal) {
			return <div className={className}>
				<Localization i18nKey={key as any}/>
			</div>;
		} else {
			return <div className={className}>
				{key}
			</div>;
		}
	}

	private isActionClick: boolean = false;

	private renderBehavior(behavior: IRenderBehavior) {

		let id: string = behavior.behaviorId;
		let name: string = behavior.behaviorName;
		let icon: string = behavior.iconName;
		let info: string = behavior.describe;
		let color: string = "";
		let needLocal: boolean = true;
		let focus = this.isFocus(behavior);
		
		if (behavior instanceof Behavior) {
			id = behavior.id;
			name = behavior.name;
			color = behavior.color;
			needLocal = false;
		}

		if (behavior instanceof BehaviorRecorder) {
			needLocal = true;
			if (focus) {
				color = "rgb(81, 79, 235)";
			}
		}

		if (!color) {
			color = "transparent";
		}

		return <div
			key={id}
			className={"behavior-item" + (focus ? " focus" : "")}
			onClick={() => {
				if (this.props.click && !this.isActionClick) {
					this.props.click(behavior);
				}
				this.isActionClick = false;
			}}
		>
			<div
				className="behavior-color-view"
				style={{ backgroundColor: color }}
			/>
			<div className="behavior-icon-view">
				<Icon iconName={icon}/>
			</div>
			<div className="behavior-content-view">
				{this.renderTerm(name, "title-view", needLocal)}
				{this.renderTerm(info, "info-view", needLocal)}
			</div>
			<div className="behavior-action-view">
				{this.renderActionButton(behavior)}
			</div>
		</div>
	}

	public render(): ReactNode {
		return <Theme className="behavior-list">
			{this.props.behaviors.map((behavior) => {
				return this.renderBehavior(behavior);
			})}
		</Theme>
	}
}

export { BehaviorList };