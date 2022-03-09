import { Theme } from "@Component/Theme/Theme";
import { LabelList as LabelListComponent } from "@Component/LabelList/LabelList";
import { Component } from "react";
import { useStatusWithEvent, IMixinStatusProps } from "@Context/Status";
import { Label } from "@Model/Label";
import "./LabelList.scss";

interface ILabelListProps {

}

@useStatusWithEvent("labelChange")
class LabelList extends Component<ILabelListProps & IMixinStatusProps> {
    
    public render() {
        let labels: Label[] = [];
        if (this.props.status) {
            labels = this.props.status.model.labelPool.concat([]);
        }
        return <LabelListComponent labels={labels} canDelete/>
    }
}

export { LabelList };