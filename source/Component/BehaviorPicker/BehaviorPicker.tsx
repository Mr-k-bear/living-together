import { DetailsList } from "@Component/DetailsList/DetailsList";
import { Component, ReactNode } from "react";
import { Behavior } from "@Model/Behavior";
import "./BehaviorPicker.scss";

interface IBehaviorPickerProps {
    behavior: Behavior[]
}

class BehaviorPicker extends Component<IBehaviorPickerProps> {

    private getData() {
        let data: Array<{key: string, behavior: Behavior}> = [];
        for (let i = 0; i < this.props.behavior.length; i++) {
            data.push({
                key: this.props.behavior[i].id,
                behavior: this.props.behavior[i]
            })
        }
        return data;
    }

    private renderColor(color: string): ReactNode {
        return <div className="behavior-picker-line-color-view">
            <div style={{ borderLeft: `10px solid ${color}` }}/>
        </div>    
    }

    private renderLine = (behavior: Behavior): ReactNode => {
        return <>
            {this.renderColor(behavior.color)}
        </>;
    }

    public render(): ReactNode {
        return <DetailsList
            hideCheckBox
            className="behavior-picker-list"
            items={this.getData()}
            columns={[{
                className: "behavior-picker-line",
                key: "behavior",
                render: this.renderLine
            }]}
        />
    }
}

export { BehaviorPicker };