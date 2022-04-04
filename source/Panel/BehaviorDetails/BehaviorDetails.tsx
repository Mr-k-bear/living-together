import { Component, ReactNode} from "react";
import { useStatusWithEvent, IMixinStatusProps } from "@Context/Status";
import { Behavior } from "@Model/Behavior";
import { Message } from "@Component/Message/Message";
import { AttrInput } from "@Component/AttrInput/AttrInput";
import { ColorInput } from "@Component/ColorInput/ColorInput";
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