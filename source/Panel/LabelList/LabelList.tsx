import { LabelList as LabelListComponent } from "@Component/LabelList/LabelList";
import { Component } from "react";
import { useStatusWithEvent, IMixinStatusProps } from "@Context/Status";
import { useSetting, IMixinSettingProps } from "@Context/Setting";
import { Label } from "@Model/Label";
import { ErrorMessage } from "@Component/ErrorMessage/ErrorMessage";
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
                <ErrorMessage
                    className="label-list-pabel-err-msg"
                    i18nKey="Panel.Info.Label.List.Error.Nodata"
                /> : null
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
                        this.props.status.model.deleteLabel(label);
                        this.props.status.setLabelObject();
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