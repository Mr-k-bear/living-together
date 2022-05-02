import { Component, ReactNode } from "react";
import { useStatusWithEvent, IMixinStatusProps } from "@Context/Status";
import { TogglesInput } from "@Input/TogglesInput/TogglesInput";
import { ConfirmPopup } from "@Component/ConfirmPopup/ConfirmPopup";
import { AttrInput } from "@Input/AttrInput/AttrInput";
import { Message } from "@Input/Message/Message";
import { Clip } from "@Model/Clip";
import "./ClipDetails.scss";

@useStatusWithEvent("focusClipChange", "clipAttrChange")
class ClipDetails extends Component<IMixinStatusProps> {

    private renderFrom(clip: Clip) {
        return <>

            <Message i18nKey="Common.Attr.Title.Basic" isTitle first/>
            
            <AttrInput
                keyI18n="Common.Attr.Key.Display.Name"
                maxLength={15}
                value={clip.name}
                valueChange={(value) => {
                    if (this.props.status) {
                        this.props.status.changeClipAttrib(clip.id, "name", value);
                    }
                }}
            />

            <TogglesInput
                keyI18n="Common.Attr.Key.Delete" onIconName="delete" red
                offIconName="delete" valueChange={() => {
                    const status = this.props.status;
                    if (status) {
                        status.popup.showPopup(ConfirmPopup, {
                            infoI18n: "Popup.Delete.Clip.Confirm",
                            titleI18N: "Popup.Action.Objects.Confirm.Title",
                            yesI18n: "Popup.Action.Objects.Confirm.Delete",
                            red: "yes",
                            yes: () => {
                                status.setClipObject();
                                this.props.status?.actuator.endPlay();
                                status.model.deleteClip(clip.id);
                            }
                        });
                    }
                }}
            />

		</>;
    }

	public render(): ReactNode {
        if (this.props.status && this.props.status.focusClip) {
            return this.renderFrom(this.props.status.focusClip);
        }
		return <Message i18nKey="Panel.Info.Clip.Details.Error.Nodata"/>;
	}
}

export { ClipDetails };