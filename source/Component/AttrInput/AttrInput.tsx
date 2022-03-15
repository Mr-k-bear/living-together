import { Component, ReactNode } from "react";
import { Icon } from "@fluentui/react";
import { Localization, AllI18nKeys } from "@Component/Localization/Localization";
import { ObjectID } from "@Model/Renderer";
import { TextField, ITextFieldProps } from "../TextField/TextField";
import "./AttrInput.scss";

interface IAttrInputProps extends ITextFieldProps {
    id?: ObjectID;
    value?: number | string;
	isNumber?: boolean;
    maxLength?: number;
    minLength?: number;
    max?: number;
    min?: number;
    step?: number;
    valueChange?: (value: this["isNumber"] extends true ? number : string) => any;
}

class AttrInput extends Component<IAttrInputProps> {

    private value: string = "";
    private error?: AllI18nKeys;
    private errorOption?: Record<string, string>;
    private numberTestReg = [/\.0*$/, /\.\d*[1-9]+0+$/];

    private numberTester(value: string) {
        return isNaN((value as any) / 1) ||
            this.numberTestReg[0].test(value) ||
            this.numberTestReg[1].test(value);
    } 

    private check(value: string): AllI18nKeys | undefined {

        // 长度校验
        const maxLength = this.props.maxLength ?? 32;
        if (value.length > maxLength) {
            this.error = "Input.Error.Length";
            this.errorOption = { num: maxLength.toString() };
            return this.error;
        }

        const minLength = this.props.minLength ?? 1;
        if (value.length < minLength) {
            this.error = "Input.Error.Length.Less";
            this.errorOption = { num: minLength.toString() };
            return this.error;
        }

        if (this.props.isNumber) {
            const praseNumber = (value as any) / 1;

            // 数字校验
            if (this.numberTester(value)) {
                this.error = "Input.Error.Not.Number";
                return this.error;
            }

            // 最大值校验
            if (this.props.max !== undefined && praseNumber > this.props.max) {
                this.error = "Input.Error.Max";
                this.errorOption = { num: this.props.max.toString() };
                return this.error;
            }

            // 最小值校验
            if (this.props.min !== undefined && praseNumber < this.props.min) {
                this.error = "Input.Error.Min";
                this.errorOption = { num: this.props.min.toString() };
                return this.error;
            }

        }
        return undefined;
    }

    private handelValueChange = () => {
        if (!this.error && this.props.valueChange) {
            if (this.props.isNumber) {
                let numberVal = (this.value as any) * 10000;
                this.value = (Math.round(numberVal) / 10000).toString();
            }
            this.props.valueChange(this.value);
        }
        this.forceUpdate();
    }

    private changeValue = (direction: number) => {
        if (this.error) {
            return;
        } else {
            let newVal = (this.value as any / 1) + (this.props.step ?? 1) * direction;

            // 最大值校验
            if (this.props.max !== undefined && newVal > this.props.max) {
                newVal = this.props.max;
            }

            // 最小值校验
            if (this.props.min !== undefined && newVal < this.props.min) {
                newVal = this.props.min;
            }

            this.value = newVal.toString();
            this.handelValueChange()
        }
    }

    private renderInput() {
        return <>
            {
                this.props.isNumber ? <div
                    className="button-left"
                    onClick={() => this.changeValue(-1)}
                >
                    <Icon iconName="ChevronLeft"></Icon>
                </div> : null
            }
            <input
                className="input"
                value={this.value}
                style={{
                    padding: this.props.isNumber ? "0 3px" : "0 8px"
                }}
                onChange={(e) => {
                    this.value = e.target.value;
                    this.error = this.check(e.target.value);
                    this.handelValueChange();
                }}
            ></input>
            {
                this.props.isNumber ? <div
                    className="button-right"
                    onClick={() => this.changeValue(1)}
                >
                    <Icon iconName="ChevronRight"></Icon>
                </div> : null
            }
        </>
    }

    public shouldComponentUpdate(nextProps: IAttrInputProps) {

        // ID 都为空时更新
        if (!nextProps.id && !this.props.id) {
            this.updateValueFromProps(nextProps.value);
        }

        // ID 变换时更新 State 到最新的 Props
        if (nextProps.id !== this.props.id) {
            this.updateValueFromProps(nextProps.value);
        }
        return true;
    }

    public constructor(props: IAttrInputProps) {
        super(props);
        this.updateValueFromProps(props.value);
    }

    private updateValueFromProps(val: IAttrInputProps["value"]) {
        const value = val ?? (this.props.isNumber ? "0" : "");
        this.value = value.toString();
        this.error = this.check(value.toString());
    }

	public render(): ReactNode {

		return <TextField
            {...this.props}
            className="attr-input-root"
            customHoverStyle
            errorI18n={this.error}
            errorI18nOption={this.errorOption}
        >
            {
                this.renderInput()
            }
        </TextField>;
	}
}

export { AttrInput };