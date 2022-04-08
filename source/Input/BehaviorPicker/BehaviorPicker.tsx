import { Component, ReactNode, createRef } from "react";
import { Icon } from "@fluentui/react";
import { Behavior } from "@Model/Behavior";
import { useSettingWithEvent, IMixinSettingProps } from "@Context/Setting";
import { useStatusWithEvent, IMixinStatusProps } from "@Context/Status";
import { DetailsList } from "@Component/DetailsList/DetailsList";
import { Localization } from "@Component/Localization/Localization";
import { PickerList } from "@Input/PickerList/PickerList";
import "./BehaviorPicker.scss";

interface IBehaviorPickerProps {
    behavior: Behavior[];
    focusBehavior?: Behavior;
    click?: (behavior: Behavior) => void;
    delete?: (behavior: Behavior) => void;
    action?: (behavior: Behavior) => void;
    add?: (behavior: Behavior) => void;
}

interface IBehaviorPickerState {
    isPickerListOpen: boolean;
}

@useStatusWithEvent("behaviorChange")
@useSettingWithEvent("language")
class BehaviorPicker extends Component<IBehaviorPickerProps & IMixinSettingProps & IMixinStatusProps> {

    public state = {
        isPickerListOpen: false
    }

    private isInnerClick: boolean = false;
    private clickLineRef = createRef<HTMLDivElement>();

    private getData() {
        let data: Array<{select: boolean, key: string, behavior: Behavior | undefined}> = [];
        for (let i = 0; i < this.props.behavior.length; i++) {
            data.push({
                key: this.props.behavior[i].id,
                behavior: this.props.behavior[i],
                select: this.props.behavior[i].id === this.props.focusBehavior?.id
            })
        }
        data.push({
            key: "@@AddButton_List_Key",
            behavior: undefined,
            select: false
        })
        return data;
    }

    private renderLine = (behavior?: Behavior): ReactNode => {
        if (behavior) {

            const titleClassList: string[] = ["behavior-picker-title"];
            if (this.props.setting) {
                titleClassList.push(this.props.setting.language);
            }
            if (behavior.isDeleted()) {
                titleClassList.push("is-deleted");
            }

            return <>
                <div className="behavior-picker-line-color-view">
                    <div style={{ borderLeft: `10px solid rgb(${behavior.color.join(",")})` }}/>
                </div>
                <div
                    className="behavior-picker-line-icon-view"
                    onClick={() => {
                        this.isInnerClick = true;
                        this.props.action && this.props.action(behavior);
                    }}
                >   
                    {
                        behavior.isDeleted() ?
                            <Icon iconName={behavior.iconName}/>:
                            <>
                                <Icon iconName={behavior.iconName} className="behavior-icon"/>
                                <Icon iconName="EditCreate" className="view-icon"/>
                            </>
                    }
                </div>
                <div className={titleClassList.join(" ")}>
                    <div>{behavior.name}</div>
                </div>
                <div
                    className="behavior-picker-line-delete-view"
                    onClick={() => {
                        this.isInnerClick = true;
                        this.props.delete && this.props.delete(behavior);
                    }}
                >
                    <Icon iconName="Delete"/>
                </div>
            </>;
        } else {

            const openPicker = () => {
                this.isInnerClick = true;
                this.setState({
                    isPickerListOpen: true
                });
            }

            return <>
                <div
                    className="behavior-picker-line-icon-view"
                    onClick={openPicker}
                >
                    <Icon iconName="Add" className="add-icon"/>
                </div>
                <div
                    className="behavior-picker-title behavior-add-line"
                    onClick={openPicker}
                    ref={this.clickLineRef}
                >
                    <Localization i18nKey="Behavior.Picker.Add.Button"/>
                </div>
            </>;
        }
    }

    private getAllData = (): Behavior[] => {
        if (this.props.status) {
            let res: Behavior[] = [];
            for (let i = 0; i < this.props.status.model.behaviorPool.length; i++) {

                let isAdded = false;
                for (let j = 0; j < this.props.behavior.length; j++) {
                    if (this.props.status.model.behaviorPool[i].id === this.props.behavior[j].id) {
                        isAdded = true;
                        break;
                    }
                }

                if (!isAdded) {
                    res.push(this.props.status.model.behaviorPool[i]);
                }
            }
            return res;
        } else {
            return [];
        }
    }

    private renderPickerList(): ReactNode {
        return <PickerList
            objectList={this.getAllData()}
            noData="Behavior.Picker.Add.Nodata"
            target={this.clickLineRef}
            clickObjectItems={((item) => {
                if (item instanceof Behavior && this.props.add) {
                    this.props.add(item);
                }
                this.setState({
                    isPickerListOpen: false
                })
            })}
            dismiss={() => {
                this.setState({
                    isPickerListOpen: false
                });
            }}
        />
    }

    public render(): ReactNode {
        return <>
            <DetailsList
                hideCheckBox
                className="behavior-picker-list"
                items={this.getData()}
                clickLine={(item) => {
                    if (!this.isInnerClick && this.props.click && item.behavior) {
                        this.props.click(item.behavior);
                    }
                    this.isInnerClick = false;
                }}
                columns={[{
                    className: "behavior-picker-line",
                    key: "behavior",
                    render: this.renderLine
                }]}
            />
            {this.state.isPickerListOpen ? this.renderPickerList() : null}
        </>
    }
}

export { BehaviorPicker };