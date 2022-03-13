import { Component, ReactNode } from "react";
import { AttrInput } from "@Component/AttrInput/AttrInput";
import { useStatusWithEvent, IMixinStatusProps } from "@Context/Status";
import { Message } from "@Component/Message/Message";
import { ColorInput } from "@Component/ColorInput/ColorInput";
import { Label } from "@Model/Label";
import { TogglesInput } from "@Component/TogglesInput/TogglesInput";
import "./LabelDetails.scss";

@useStatusWithEvent("focusLabelChange", "labelAttrChange", "labelChange")
class LabelDetails extends Component<IMixinStatusProps> {

    private renderFrom(label: Label) {
        return <>

            <Message i18nKey="Common.Attr.Title.Basic" isTitle first/>
            
            <AttrInput keyI18n="Common.Attr.Key.Display.Name" maxLength={15} value={label.name} valueChange={(value) => {
                if (this.props.status) {
                    this.props.status.changeLabelAttrib(label, "name", value);
                }
            }}/>

            <ColorInput keyI18n="Common.Attr.Key.Color" value={label.color} valueChange={(color) => {
                if (this.props.status) {
                    this.props.status.changeLabelAttrib(label, "color", color);
                }
            }}/>

            <TogglesInput keyI18n="Common.Attr.Key.Delete" onIconName="delete" offIconName="delete" valueChange={() => {
                if (this.props.status) {
                    this.props.status.model.deleteLabel(label);
                    this.props.status.setLabelObject();
                }
            }}/>

		</>;
    }

	public render(): ReactNode {
        if (this.props.status) {
            if (this.props.status.focusLabel) {
                return this.renderFrom(this.props.status.focusLabel);
            }
        }
		return <Message i18nKey="Panel.Info.Label.Details.Error.Unspecified"/>;
	}
}

export { LabelDetails };