import { Component, ReactNode } from "react";
import { Popup } from "@Context/Popups";
import { Localization, I18N } from "@Component/Localization/Localization";
import { SearchBox } from "@Component/SearchBox/SearchBox";
import { ConfirmContent } from "@Component/ConfirmPopup/ConfirmPopup";
import { BehaviorList } from "@Component/BehaviorList/BehaviorList";
import { AllBehaviors } from "@Behavior/Behavior";
import { Message } from "@Component/Message/Message";
import { IRenderBehavior } from "@Model/Behavior";
import { useStatus, IMixinStatusProps } from "@Context/Status";
import { useSettingWithEvent, IMixinSettingProps } from "@Context/Setting";
import { ConfirmPopup } from "@Component/ConfirmPopup/ConfirmPopup";
import "./BehaviorPopup.scss";

interface IBehaviorPopupProps {

}

interface IBehaviorPopupState {
	searchValue: string;
	focusBehavior: Set<IRenderBehavior>;
}

class BehaviorPopup extends Popup<IBehaviorPopupProps> {

	public minWidth: number = 400;
	public minHeight: number = 300;
	public width: number = 600;
	public height: number = 450;
	// public needMask: boolean = false;

	public onRenderHeader(): ReactNode {
		return <Localization i18nKey="Popup.Add.Behavior.Title"/>
	}

	public render(): ReactNode {
		return <BehaviorPopupComponent {...this.props}/>
	}
}

@useStatus
@useSettingWithEvent("language")
class BehaviorPopupComponent extends Component<
	IBehaviorPopupProps & IMixinStatusProps & IMixinSettingProps, IBehaviorPopupState
> {

	state: Readonly<IBehaviorPopupState> = {
		searchValue: "",
		focusBehavior: new Set<IRenderBehavior>()
	};

	private renderHeader = () => {
		return <div className="behavior-popup-search-box">
			<SearchBox
				valueChange={(value) => {
					this.setState({
						searchValue: value
					});
				}}
				value={this.state.searchValue}
			/>
		</div>;
	}

	private showBehaviorInfo = (behavior: IRenderBehavior) => {
		if (this.props.status) {
			const status = this.props.status;
			status.popup.showPopup(ConfirmPopup, {
                renderInfo: () => {
                    return <Message
                        text={behavior.getTerms(behavior.describe, this.props.setting?.language)}
                    />
                },
				titleI18N: "Popup.Behavior.Info.Title",
				titleI18NOption: {
					behavior: behavior.getTerms(behavior.behaviorName, this.props.setting?.language)
				},
				yesI18n: "Popup.Behavior.Info.Confirm",
			})
		}
	}

	private renderActionBar = () => {
		return <Localization
			className="behavior-popup-select-counter"
			i18nKey="Popup.Add.Behavior.Select.Counter"
			options={{
				count: this.state.focusBehavior.size.toString()
			}}
		/>
	}

	public render(): ReactNode {
		return <ConfirmContent
			className="behavior-popup"
			actions={[{
				i18nKey: "Popup.Add.Behavior.Action.Add",
				disable: this.state.focusBehavior.size <= 0
			}]}
			header={this.renderHeader}
			customFooter={this.renderActionBar}
			headerHeight={46}
		>
			<Message i18nKey="ZH_CN" isTitle first/>
			<BehaviorList
				focusBehaviors={Array.from(this.state.focusBehavior)}
				behaviors={AllBehaviors}
				action={this.showBehaviorInfo}
				click={(behavior) => {
					if (this.state.focusBehavior.has(behavior)) {
						this.state.focusBehavior.delete(behavior);
					} else {
						this.state.focusBehavior.add(behavior);
					}
					this.forceUpdate();
				}}
			/>
		</ConfirmContent>
	}
}

export { BehaviorPopup };