import { Component, createRef, ReactNode } from "react";
import { Label } from "@Model/Label";
import { Group } from "@Model/Group";
import { Range } from "@Model/Range";
import { TextField, ITextFieldProps } from "../TextField/TextField";
import { useStatusWithEvent, IMixinStatusProps } from "@Context/Status";
import { PickerList, IDisplayItem } from "../PickerList/PickerList";
import { Localization } from "@Component/Localization/Localization";
import { Icon } from "@fluentui/react";
import CtrlObject from "@Model/CtrlObject";
import "./ObjectPicker.scss";

type IObjectType = Label | Group | Range | CtrlObject;

interface IObjectPickerProps extends ITextFieldProps {
    type: Array<"L" | "G" | "R">;
    value?: IObjectType;
    valueChange?: (value: IObjectType) => any;
}

interface IObjectPickerState {
    isPickerVisible: boolean;
}

@useStatusWithEvent("objectChange", "labelChange")
class ObjectPicker extends Component<IObjectPickerProps & IMixinStatusProps, IObjectPickerState> {

    private getAllOption() {
        let option: Array<IObjectType> = [];
        if (this.props.status) {

            for (let i = 0; i < this.props.type.length; i++) {

                if (this.props.type[i] === "L") {
                    for (let j = 0; j < this.props.status.model.labelPool.length; j++) {
                        option.push(this.props.status.model.labelPool[j]);
                    }
                }

                if (this.props.type[i] === "R") {
                    for (let j = 0; j < this.props.status.model.objectPool.length; j++) {
                        if (this.props.status.model.objectPool[j] instanceof Range) {
                            option.push(this.props.status.model.objectPool[j]);
                        }
                    }    
                }

                if (this.props.type[i] === "G") {
                    for (let j = 0; j < this.props.status.model.objectPool.length; j++) {
                        if (this.props.status.model.objectPool[j] instanceof Group) {
                            option.push(this.props.status.model.objectPool[j]);
                        }
                    }
                }
            }
        }
        return option;
    }

    public constructor(props: IObjectPickerProps) {
        super(props);
        this.state = {
            isPickerVisible: false
        }
    }

    private pickerTarget = createRef<HTMLDivElement>();

    private renderPicker() {
        return <PickerList
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

        let name = "";
        let icon = "Label";
        if (this.props.value instanceof CtrlObject) {
            name = this.props.value.displayName;

            if (this.props.value instanceof Range) {
                icon = "CubeShape"
            }

            if (this.props.value instanceof Group) {
                icon = "WebAppBuilderFragment"
            }
        }
        if (this.props.value instanceof Label) {
            name = this.props.value.name;
            icon = "tag";
        }

        return <>
            <TextField
                {...this.props}
                className="object-picker"
                keyI18n={this.props.keyI18n}
                targetRef={this.pickerTarget}
                onClick={() => {
                    this.setState({
                        isPickerVisible: true
                    })
                }}
            >
                <div className="list-button">
                    <Icon iconName={icon}/>
                </div>
                <div className="value-view">
                    {   
                        name ? 
                            <span>{name}</span> :
                            <Localization i18nKey="Input.Error.Select"/>
                    }
                </div>
            </TextField>

            {this.state.isPickerVisible ?  this.renderPicker(): null}
        </>
    }
}

export { ObjectPicker, IDisplayItem };