import { Component, createRef, ReactNode } from "react";
import { TextField, ITextFieldProps } from "@Component/TextField/TextField";
import { Callout, ColorPicker, DirectionalHint } from "@fluentui/react";
import "./ColorInput.scss";

interface IColorInputProps extends ITextFieldProps {
    value?: number[];
    normal?: boolean;
    valueChange?: (color: number[]) => any;
}

interface IColorInputState {
    isPickerVisible: boolean;
}

class ColorInput extends Component<IColorInputProps, IColorInputState> {

    public constructor(props: IColorInputProps) {
        super(props);
        this.state = {
            isPickerVisible: false
        }
    }

    private pickerTarget = createRef<HTMLDivElement>();

    private renderPicker() {
        return <Callout
            target={this.pickerTarget}
            directionalHint={DirectionalHint.topAutoEdge}
            onDismiss={() => {
                this.setState({
                    isPickerVisible: false
                })
            }}
        >
            <div className="color-picker-root">
                <ColorPicker
                    color={this.getColorString()}
                    alphaType={"none"}
                    onChange={(_, color) => {
                        if (this.props.valueChange) {
                            if (this.props.normal) {
                                this.props.valueChange([
                                    color.r / 255,
                                    color.g / 255,
                                    color.b / 255,
                                ])
                            } else {
                                this.props.valueChange([
                                    color.r,
                                    color.g,
                                    color.b,
                                ])
                            }
                        }
                    }}
                />
            </div>
        </Callout>
    }

    private renderColorInput() {
        return <>
            <div className="color-view">
                <div className="color-box" style={{
                    backgroundColor: this.getColorString()
                }}/>
            </div>
            <div className="value-view">
                <div className="text-box">{this.getColorString(true)}</div>
            </div>
        </>;
    }

    private getColorString(display?: boolean) {
        let color: number[] = this.props.value?.concat([]) ?? [0, 0, 0];
        if (this.props.normal) {
            color[0] = Math.round(color[0] * 255);
            color[1] = Math.round(color[1] * 255);
            color[2] = Math.round(color[2] * 255);
        }
        if (display) {
            return `rgb ( ${color[0] ?? 0}, ${color[1] ?? 0}, ${color[2] ?? 0} )`;
        } else {
            return `rgb(${color[0] ?? 0},${color[1] ?? 0},${color[2] ?? 0})`;
        }
    }

    public render(): ReactNode {
        return <>
            <TextField
                {...this.props}
                className="color-input"
                keyI18n={this.props.keyI18n}
                targetRef={this.pickerTarget}
                onClick={() => {
                    this.setState({
                        isPickerVisible: !this.props.disableI18n
                    })
                }}
            >
                { this.renderColorInput() }
            </TextField>
            {this.state.isPickerVisible ?  this.renderPicker(): null}
        </>;
    }
}

export { ColorInput };