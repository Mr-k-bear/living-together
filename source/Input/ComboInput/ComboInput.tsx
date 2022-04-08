import { Component, createRef, ReactNode } from "react";
import { Icon } from "@fluentui/react";
import { ComboList, IDisplayItem } from "@Input/ComboList/ComboList";
import { TextField, ITextFieldProps } from "@Input/TextField/TextField";
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
        return <ComboList
            target={this.pickerTarget}
            item={this.props.allOption ?? []}
            focus={this.props.value}
            click={((item) => {
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
                            <Localization i18nKey={this.props.value.i18n} options={this.props.value.i18nOption}/> :
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