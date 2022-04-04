import { Component, ReactNode} from "react";
import { useStatusWithEvent, IMixinStatusProps } from "@Context/Status";
import { Behavior } from "@Model/Behavior";
import { Message } from "@Component/Message/Message";
import { AttrInput } from "@Component/AttrInput/AttrInput";
import { ColorInput } from "@Component/ColorInput/ColorInput";
import { TogglesInput } from "@Component/TogglesInput/TogglesInput";
import { ConfirmPopup } from "@Component/ConfirmPopup/ConfirmPopup";
import "./BehaviorDetails.scss";

interface IBehaviorDetailsProps {}

@useStatusWithEvent("focusBehaviorChange", "behaviorAttrChange")
class BehaviorDetails extends Component<IBehaviorDetailsProps & IMixinStatusProps> {

	private renderFrom(behavior: Behavior): ReactNode {
		return <>
        
            <Message i18nKey="Common.Attr.Title.Basic" isTitle first/>

            <AttrInput
                id={behavior.id} keyI18n="Common.Attr.Key.Display.Name" value={behavior.name}
                valueChange={(val) => {
                    this.props.status?.changeBehaviorAttrib(behavior.id, "name", val);
                }}
            />

            <ColorInput
                keyI18n="Common.Attr.Key.Color"
                value={behavior.color}
                valueChange={(color) => {
                    this.props.status?.changeBehaviorAttrib(behavior.id, "color", color);
                }}
            />

            <TogglesInput
				keyI18n="Common.Attr.Key.Delete" red
				onIconName="delete" offIconName="delete"
				valueChange={() => {
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
				}}
			/>

            <Message
                isTitle
                i18nKey="Panel.Info.Behavior.Details.Behavior.Props"
                options={{
                    behavior: behavior.getTerms(behavior.behaviorName)
                }}
            />

        </>;
	}

	public render(): ReactNode {
		if (this.props.status) {
            if (this.props.status.focusBehavior) {
                return this.renderFrom(this.props.status.focusBehavior);
            }
        }
		return <Message i18nKey="Panel.Info.Behavior.Details.Error.Not.Behavior"/>;
	}
}

export { BehaviorDetails };