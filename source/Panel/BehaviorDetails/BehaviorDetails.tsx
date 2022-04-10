import { Component, ReactNode} from "react";
import { useSettingWithEvent, IMixinSettingProps } from "@Context/Setting";
import { useStatusWithEvent, IMixinStatusProps } from "@Context/Status";
import { getDefaultValue } from "@Model/Parameter";
import { IAnyBehavior } from "@Model/Behavior";
import { Message } from "@Input/Message/Message";
import { AttrInput } from "@Input/AttrInput/AttrInput";
import { ColorInput } from "@Input/ColorInput/ColorInput";
import { TogglesInput } from "@Input/TogglesInput/TogglesInput";
import { ConfirmPopup } from "@Component/ConfirmPopup/ConfirmPopup";
import { Parameter } from "@Input/Parameter/Parameter";
import "./BehaviorDetails.scss";

interface IBehaviorDetailsProps {}

interface IBehaviorDetailsState {
    updateId: number;
}

@useSettingWithEvent("language")
@useStatusWithEvent("focusBehaviorChange", "behaviorAttrChange")
class BehaviorDetails extends Component<IBehaviorDetailsProps & IMixinStatusProps & IMixinSettingProps, IBehaviorDetailsState> {

    public state: Readonly<IBehaviorDetailsState> = {
        updateId: 1
    };

    private handelDeleteBehavior = (behavior: IAnyBehavior) => {
        if (this.props.status) {
            const status = this.props.status;
            status.popup.showPopup(ConfirmPopup, {
                infoI18n: "Popup.Delete.Behavior.Confirm",
                titleI18N: "Popup.Action.Objects.Confirm.Title",
                yesI18n: "Popup.Action.Objects.Confirm.Delete",
                red: "yes",
                yes: () => {
                    status.model.deleteBehavior(behavior);
                    status.setBehaviorObject();
                }
            })
        }
    }

    private handelRestoreBehavior = (behavior: IAnyBehavior) => {
        if (this.props.status) {
            const status = this.props.status;
            status.popup.showPopup(ConfirmPopup, {
                infoI18n: "Popup.Restore.Behavior.Confirm",
                titleI18N: "Popup.Action.Objects.Confirm.Restore.Title",
                yesI18n: "Popup.Action.Objects.Confirm.Restore",
                red: "yes",
                yes: () => {
                    status.changeBehaviorAttrib(
                        behavior.id, "parameter",
                        getDefaultValue(behavior.parameterOption) as any,
                        true
                    );
                    this.setState({
                        updateId: this.state.updateId + 1
                    });
                }
            })
        }
    }

	private renderFrom(behavior: IAnyBehavior): ReactNode {
        
		return <>
        
            <Message i18nKey="Common.Attr.Title.Basic" isTitle first/>

            <AttrInput
                id={behavior.id} keyI18n="Common.Attr.Key.Display.Name" value={behavior.name}
                valueChange={(val) => {
                    this.props.status?.changeBehaviorAttrib(behavior.id, "name", val, true);
                }}
            />

            <ColorInput
                keyI18n="Common.Attr.Key.Color"
                value={behavior.color}
                valueChange={(color) => {
                    this.props.status?.changeBehaviorAttrib(behavior.id, "color", color, true);
                }}
            />

            <TogglesInput
				keyI18n="Common.Attr.Key.Delete" red
				onIconName="delete" offIconName="delete"
				valueChange={() => {
					this.handelDeleteBehavior(behavior)
				}}
			/>

            <TogglesInput
				keyI18n="Common.Attr.Key.Behavior.Restore" red
				onIconName="ReplyAll" offIconName="ReplyAll"
				valueChange={() => {
					this.handelRestoreBehavior(behavior)
				}}
			/>
            
            <Parameter
                key={`${behavior.id}-${this.state.updateId}`}
                option={behavior.parameterOption}
                value={behavior.parameter}
                i18n={(name, language) => behavior.getTerms(name, language)}
                title={"Panel.Info.Behavior.Details.Behavior.Props"}
                titleOption={{
                    behavior: behavior.getTerms(behavior.behaviorName, this.props.setting?.language)
                }}
                change={(key, value) => {
                    this.props.status?.changeBehaviorAttrib(
                        behavior.id, key as string, value
                    );
                }}
            />

        </>;
	}

	public render(): ReactNode {
		if (this.props.status && this.props.status.focusBehavior) {
            return this.renderFrom(this.props.status.focusBehavior);
        }
		return <Message i18nKey="Panel.Info.Behavior.Details.Error.Not.Behavior"/>;
	}
}

export { BehaviorDetails };