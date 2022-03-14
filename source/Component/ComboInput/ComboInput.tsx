import { Component, createRef, ReactNode } from "react";
import { FontLevel, Theme } from "@Component/Theme/Theme";
import { PickerList, IDisplayItem } from "../PickerList/PickerList";
import { AllI18nKeys, Localization } from "@Component/Localization/Localization";
import { Icon } from "@fluentui/react";
import "./ComboInput.scss";

interface IComboInputProps {
    keyI18n: AllI18nKeys;
    infoI18n?: AllI18nKeys;
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
            <Theme className="combo-input-root" fontLevel={FontLevel.normal}>
                <div className="input-intro">
                    <Localization i18nKey={this.props.keyI18n}/>
                </div>
                <div
                    className="root-content"
                    ref={this.pickerTarget}
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
                </div>
            </Theme>

            {this.state.isPickerVisible ?  this.renderPicker(): null}
        </>
    }
}

export { ComboInput, IDisplayItem };