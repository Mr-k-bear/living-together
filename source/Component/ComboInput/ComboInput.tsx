import { Component, createRef, ReactNode } from "react";
import { PickerList, IDisplayItem } from "../PickerList/PickerList";
import { TextField, ITextFieldProps } from "../TextField/TextField";
import { Icon } from "@fluentui/react";
import { Localization } from "@Component/Localization/Localization";
import "./ComboInput.scss";
interface IComboInputProps extends ITextFieldProps {
    allOption?: IDisplayItem[];
    value?: IDisplayItem;
    valueChange?: (value: IDisplayItem) => any;
}

interface IComboInputState {
    isPickerVisible: boolean;
}

class ComboInput extends Component<IComboInputProps, IComboInputState> {

    public constructor(props: IComboInputProps) {
        super(props);
        this.state = {
            isPickerVisible: false
        }
    }

    private pickerTarget = createRef<HTMLDivElement>();

    private renderPicker() {
        return <PickerList
            target={this.pickerTarget}
            displayItems={(this.props.allOption ?? []).map((item) => {
                return item.key === this.props.value?.key ? 
                    {...item, mark: true} : item;
            })}
            clickDisplayItems={((item) => {
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
        return <>
            <TextField
                {...this.props}
                targetRef={this.pickerTarget}
                className="combo-input"
                keyI18n={this.props.keyI18n}
                onClick={() => {
                    this.setState({
                        isPickerVisible: true
                    })
                }}
            >
                <div className="value-view">
                    {
                        this.props.value ? 
                        <Localization i18nKey={this.props.value.nameKey}/> :
                        null
                    }
                </div>
                <div className="list-button">
                    <Icon iconName="ChevronDownMed"/>
                </div>
            </TextField>

            {this.state.isPickerVisible ?  this.renderPicker(): null}
        </>
    }
}

export { ComboInput, IDisplayItem };