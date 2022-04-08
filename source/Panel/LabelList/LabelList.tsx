import { Component } from "react";
import { LabelList as LabelListComponent } from "@Component/LabelList/LabelList";
import { useStatusWithEvent, IMixinStatusProps } from "@Context/Status";
import { useSetting, IMixinSettingProps } from "@Context/Setting";
import { ConfirmPopup } from "@Component/ConfirmPopup/ConfirmPopup";
import { Message } from "@Input/Message/Message";
import { Label } from "@Model/Label";
import "./LabelList.scss";

interface ILabelListProps {

}

@useSetting
@useStatusWithEvent("labelChange", "focusLabelChange", "labelAttrChange")
class LabelList extends Component<ILabelListProps & IMixinStatusProps & IMixinSettingProps> {
    
    private labelInnerClick: boolean = false;

    public render() {
        let labels: Label[] = [];
        if (this.props.status) {
            labels = this.props.status.model.labelPool.concat([]);
        }
        return <div
            className="label-list-panel-root"
            onClick={() => {
                if (this.props.status && !this.labelInnerClick) {
                    this.props.status.setLabelObject();
                }
                this.labelInnerClick = false;
            }}
        >
            {labels.length <=0 ? 
                <Message i18nKey="Panel.Info.Label.List.Error.Nodata"/> : null
            }
            <LabelListComponent
                labels={labels}
                focusLabel={this.props.status ? this.props.status.focusLabel : undefined}
                clickLabel={(label) => {
                    if (this.props.status) {
                        this.props.status.setLabelObject(label);
                    }
                    if (this.props.setting) {
                        this.props.setting.layout.focus("LabelDetails");
                    }
                    this.labelInnerClick = true;
                }}
                deleteLabel={(label) => {
                    if (this.props.status) {
                        const status = this.props.status;
                        status.popup.showPopup(ConfirmPopup, {
                            infoI18n: "Popup.Delete.Objects.Confirm",
                            titleI18N: "Popup.Action.Objects.Confirm.Title",
                            yesI18n: "Popup.Action.Objects.Confirm.Delete",
                            red: "yes",
                            yes: () => {
                                status.model.deleteLabel(label);
                                status.setLabelObject();
                            }
                        })
                    }
                    this.labelInnerClick = true;
                }}
                minHeight={26}
                addLabel={() => {
                    this.props.status ? this.props.status.newLabel() : undefined;
                }}
            />
        </div>;
    }
}

export { LabelList };