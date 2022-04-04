import { Theme } from "@Component/Theme/Theme";
import { Component, ReactNode } from "react";
import { IRenderBehavior, Behavior, BehaviorRecorder } from "@Model/Behavior";
import { useSettingWithEvent, IMixinSettingProps } from "@Context/Setting";
import { useStatus, IMixinStatusProps } from "@Context/Status";
import { Icon } from "@fluentui/react";
import { ConfirmPopup } from "@Component/ConfirmPopup/ConfirmPopup";
import { Message } from "@Component/Message/Message";
import "./BehaviorList.scss";

interface IBehaviorListProps {
	behaviors: IRenderBehavior[];
	focusBehaviors?: IRenderBehavior[];
	click?: (behavior: IRenderBehavior) => void;
    delete?: (behavior: IRenderBehavior) => void;
    onAdd?: () => void;
}

@useStatus
@useSettingWithEvent("language")
class BehaviorList extends Component<IBehaviorListProps & IMixinSettingProps & IMixinStatusProps> {

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

	private renderActionButton(behavior: IRenderBehavior, actionType: "info" | "delete") {

		const classList: string[] = ["info-button", "behavior-action-button"];
		let iconName = "Info";
        let action: () => void = () => {};

		switch (actionType) {
			case "delete":
				classList.push("hover-red");
				iconName = "Delete";
                action = () => {
                    this.isActionClick = true;
                    if (this.props.delete) {
                        this.props.delete(behavior)
                    }
                }
				break;

			case "info":
				classList.push("hover-blue");
				iconName = "Info";
                action = () => {
                    this.isActionClick = true;
                    if (!this.props.status) {
                        return;
                    }
                    const status = this.props.status;
                    status.popup.showPopup(ConfirmPopup, {
                        renderInfo: () => {
                            return <Message
                                text={behavior.getTerms(behavior.describe, this.props.setting?.language)}
                            />
                        },
                        titleI18N: "Popup.Behavior.Info.Title",
                        yesI18n: "Popup.Behavior.Info.Confirm",
                        titleI18NOption: {
                            behavior: behavior.getTerms(behavior.behaviorName, this.props.setting?.language)
                        }
                    })
                }
				break;

			default:
				classList.push("hover-blue");
		}

		return <div
			className={classList.join(" ")}
			onClick={action}
		>
			<Icon iconName={iconName}/>
		</div>
	}

	private renderTerm(behavior: IRenderBehavior, key: string, className: string, needLocal: boolean) {
		if (needLocal) {
			return <div className={className}>
				{behavior.getTerms(key, this.props.setting?.language)}
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
			color = `rgb(${behavior.color.join(",")})`;
			needLocal = false;
            info = behavior.behaviorName;
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
            <div className="behavior-color-view">
                <div style={{ borderLeft: `12px solid ${color}` }}/>
            </div>
            <div className="behavior-item-root">
                <div className="behavior-popup-menu">
                    <div className="behavior-popup-layout">
                        <div className="behavior-popup-action-view">
                            {this.props.delete ? this.renderActionButton(behavior, "delete") : null}
                            {this.renderActionButton(behavior, "info")}
                        </div>
                    </div>
                </div>
                <div className="behavior-icon-view">
                    <Icon iconName={icon}/>
                </div>
                <div className="behavior-content-view">
                    {this.renderTerm(behavior, name, "title-view", needLocal)}
                    {this.renderTerm(behavior, info, "info-view", true)}
                </div>
            </div>
		</div>
	}

    private renderAddButton(add: () => void) {
        return <div className="behavior-item add-button" onClick={add}>
            <Icon iconName="Add"/>
        </div>
    }

	public render(): ReactNode {
		return <Theme className="behavior-list">
			{this.props.behaviors.map((behavior) => {
				return this.renderBehavior(behavior);
			})}
            {this.props.onAdd ? this.renderAddButton(this.props.onAdd) : null}
		</Theme>
	}
}

export { BehaviorList };