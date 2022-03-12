import { AllI18nKeys, Localization } from "@Component/Localization/Localization";
import { Theme } from "@Component/Theme/Theme";
import { Icon } from "@fluentui/react";
import { Component, ReactNode } from "react";
import "./TogglesInput.scss";

interface ITogglesInputProps {
    keyI18n: AllI18nKeys;
    infoI18n?: AllI18nKeys;
    value?: boolean;
    disable?: boolean;
    onIconName?: string;
    offIconName?: string;
    valueChange?: (value: boolean) => any;
}

class TogglesInput extends Component<ITogglesInputProps> {
    public render(): ReactNode {
        return <Theme className="toggles-input">
            <div className="toggles-intro">
                <Localization i18nKey={this.props.keyI18n}/>
            </div>
            <div className="toggles-content">
                <div
                    className="checkbox"
                    style={{
                        cursor: this.props.disable ? "not-allowed" : "pointer"
                    }}
                    onClick={(() => {
                        if (this.props.disable) {
                            return;
                        }
                        if (this.props.valueChange) {
                            this.props.valueChange(!this.props.value);
                        }
                    })}
                >
                    <Icon
                        iconName={
                            this.props.value ? 
                                this.props.onIconName ?? "CheckMark" :
                                this.props.offIconName ?? undefined
                        }
                        style={{
                            display: this.props.value ? "inline-block" : 
                                this.props.offIconName ? "inline-block" : "none"
                        }}
                    ></Icon>
                </div>    
            </div>
        </Theme>
    }
}

export { TogglesInput };