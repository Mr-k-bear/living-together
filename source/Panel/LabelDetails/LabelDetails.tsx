import { Component, ReactNode } from "react";
import { AttrInput } from "@Component/AttrInput/AttrInput";
import { useStatusWithEvent, IMixinStatusProps } from "@Context/Status";
import { AllI18nKeys } from "@Component/Localization/Localization";
import { ErrorMessage } from "@Component/ErrorMessage/ErrorMessage";
import { ColorInput } from "@Component/ColorInput/ColorInput";
import "./LabelDetails.scss";
import { LabelList } from "@Component/LabelList/LabelList";
import { Label } from "@Model/Label";

@useStatusWithEvent("focusLabelChange")
class LabelDetails extends Component<IMixinStatusProps> {
    
    public readonly AttrI18nKey: AllI18nKeys[] = [
        "Common.Attr.Key.Display.Name",
        "Common.Attr.Key.Color",
    ]

    private renderFrom(label: Label) {
        return <>

            <LabelList
                labels={[label]}
                canDelete
                deleteLabel={() => {
                    if (this.props.status) {
                        this.props.status.model.deleteLabel(label);
                        this.props.status.setLabelObject();
                    }
                }}
            />
            
            <AttrInput keyI18n="Common.Attr.Key.Display.Name" maxLength={15} value={label.name}/>

            <ColorInput keyI18n="Common.Attr.Key.Color" value={label.color} valueChange={(color) => {
                if (this.props.status) {
                    
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
		return <ErrorMessage i18nKey="Panel.Info.Label.Details.Error.Unspecified"/>;
	}
}

export { LabelDetails };