import { Component, ReactNode } from "react";
import { Icon } from "@fluentui/react";
import { TextField, ITextFieldProps } from "@Input/TextField/TextField";
import "./TogglesInput.scss";

interface ITogglesInputProps extends ITextFieldProps {
    value?: boolean;
    onIconName?: string;
    offIconName?: string;
    valueChange?: (value: boolean) => any;
    red?: boolean;
}

class TogglesInput extends Component<ITogglesInputProps> {
    public render(): ReactNode {
        return <TextField
            {...this.props}
            className="toggles-input"
            keyI18n={this.props.keyI18n}
            customHoverStyle
            customStyle
        >
            <div
                className={"checkbox" + (this.props.red ? " red" : "")}
                style={{
                    cursor: this.props.disableI18n ? "not-allowed" : "pointer"
                }}
                onClick={(() => {
                    if (this.props.disableI18n) {
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
                />
            </div>  
        </TextField>;
    }
}

export { TogglesInput };