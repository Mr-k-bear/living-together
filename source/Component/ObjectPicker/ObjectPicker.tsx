import { Component, createRef, ReactNode } from "react";
import { Label } from "@Model/Label";
import { Group } from "@Model/Group";
import { Range } from "@Model/Range";
import { TextField, ITextFieldProps } from "../TextField/TextField";
import { useStatusWithEvent, IMixinStatusProps } from "@Context/Status";
import { PickerList, IDisplayItem, getObjectDisplayInfo, IDisplayInfo } from "../PickerList/PickerList";
import { Localization } from "@Component/Localization/Localization";
import { Icon } from "@fluentui/react";
import { CtrlObject } from "@Model/CtrlObject";
import "./ObjectPicker.scss";

type IObjectType = Label | Group | Range | CtrlObject;

interface IObjectPickerProps extends ITextFieldProps {
    type: string;
    value?: IObjectType;
    valueChange?: (value: IObjectType) => any;
    cleanValue?: () => any;
}

interface IObjectPickerState {
    isPickerVisible: boolean;
}

@useStatusWithEvent("objectChange", "labelChange")
class ObjectPicker extends Component<IObjectPickerProps & IMixinStatusProps, IObjectPickerState> {

    private getAllOption() {
        let option: Array<IObjectType> = [];
        if (!this.props.status) return option;

        if (this.props.type.includes("L")) {
            for (let j = 0; j < this.props.status.model.labelPool.length; j++) {
                option.push(this.props.status.model.labelPool[j]);
            }

            if (this.props.type.includes("R")) {
                option.push(this.props.status.model.allRangeLabel);
            }

            if (this.props.type.includes("G")) {
                option.push(this.props.status.model.allGroupLabel);
            }
        }

        if (this.props.type.includes("R")) {
            for (let j = 0; j < this.props.status.model.objectPool.length; j++) {
                if (this.props.status.model.objectPool[j] instanceof Range) {
                    option.push(this.props.status.model.objectPool[j]);
                }
            }
        }

        if (this.props.type.includes("G")) {
            for (let j = 0; j < this.props.status.model.objectPool.length; j++) {
                if (this.props.status.model.objectPool[j] instanceof Group) {
                    option.push(this.props.status.model.objectPool[j]);
                }
            }
        }
        
        return option;
    }

    private isClean: boolean = false;

    public constructor(props: IObjectPickerProps) {
        super(props);
        this.state = {
            isPickerVisible: false
        }
    }

    private pickerTarget = createRef<HTMLDivElement>();

    private renderPicker() {
        return <PickerList
            noData="Object.Picker.List.No.Data"
            target={this.pickerTarget}
            objectList={this.getAllOption()}
            clickObjectItems={((item) => {
                if (this.props.valueChange) {
                    this.props.valueChange(item);
                }
                this.setState({
                    isPickerVisible: false
                })
            })}
            dismiss={() => {
                this.setState({
                    isPickerVisible: false
                })
            }}
        />
    }

    public render(): ReactNode {

        let disPlayInfo: IDisplayInfo = getObjectDisplayInfo(this.props.value);
        let isDelete: boolean = !!this.props.value?.isDeleted();

        return <>
            <TextField
                {...this.props}
                className="object-picker"
                keyI18n={this.props.keyI18n}
                targetRef={this.pickerTarget}
                onClick={() => {
                    if (this.isClean) {
                        this.isClean = false;
                    } else {
                        this.setState({
                            isPickerVisible: true
                        })
                    }
                }}
            >
                <div
                    className={
                        "list-color" + (
                            disPlayInfo.allLabel ? " rainbow-back-ground-color" : ""
                        )
                    }
                    style={{
                        backgroundColor: disPlayInfo.color
                    }}
                />
                <div className="list-button">
                    <Icon iconName={disPlayInfo.icon}/>
                </div>
                <div
                    className="value-view"
                    style={{
                        textDecoration: isDelete ? "line-through" : undefined,
                        opacity: isDelete ? ".6" : undefined
                    }}
                >
                    {   
                        disPlayInfo.internal ? 
                            <Localization i18nKey={disPlayInfo.name as any}/> :
                            <span>{disPlayInfo.name}</span>
                    }
                </div>
                <div
                    className="list-empty"
                    onClick={() => {
                        if (this.props.cleanValue && disPlayInfo.name) {
                            this.isClean = true;
                            this.props.cleanValue();
                        }
                    }}
                >
                    {   
                        disPlayInfo.name ? 
                            <Icon iconName="delete"/> :
                            null
                    }
                </div>
            </TextField>

            {this.state.isPickerVisible ?  this.renderPicker(): null}
        </>
    }
}

export { ObjectPicker, IDisplayItem };