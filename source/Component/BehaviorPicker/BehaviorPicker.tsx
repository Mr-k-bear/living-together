import { DetailsList } from "@Component/DetailsList/DetailsList";
import { Component, ReactNode } from "react";
import { Behavior } from "@Model/Behavior";
import { Icon } from "@fluentui/react";
import { useSettingWithEvent, IMixinSettingProps } from "@Context/Setting";
import { Localization } from "@Component/Localization/Localization";
import "./BehaviorPicker.scss";

interface IBehaviorPickerProps {
    behavior: Behavior[];
    delete?: (behavior: Behavior) => void;
    action?: (behavior: Behavior) => void;
    add?: () => void;
}

@useSettingWithEvent("language")
class BehaviorPicker extends Component<IBehaviorPickerProps & IMixinSettingProps> {

    private getData() {
        let data: Array<{key: string, behavior: Behavior | undefined}> = [];
        for (let i = 0; i < this.props.behavior.length; i++) {
            data.push({
                key: this.props.behavior[i].id,
                behavior: this.props.behavior[i]
            })
        }
        data.push({
            key: "@@AddButton_List_Key",
            behavior: undefined
        })
        return data;
    }

    private renderLine = (behavior?: Behavior): ReactNode => {
        if (behavior) {
            return <>
                <div className="behavior-picker-line-color-view">
                    <div style={{ borderLeft: `10px solid ${behavior.color}` }}/>
                </div>
                <div className="behavior-picker-line-icon-view">
                    <Icon iconName={behavior.iconName} className="behavior-icon"/>
                    <Icon iconName="EditCreate" className="view-icon"/>
                </div>
                <div className={`behavior-picker-title ${this.props.setting?.language}`}>
                    <div>{behavior.name}</div>
                </div>
                <div className="behavior-picker-line-delete-view">
                    <Icon iconName="Delete"/>
                </div>
            </>;
        } else {
            return <>
                <div className="behavior-picker-line-icon-view">
                    <Icon iconName="Add" className="add-icon"/>
                </div>
                <div className={`behavior-picker-title`}>
                    <Localization i18nKey="Behavior.Picker.Add.Button"/>
                </div>
            </>;
        }
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