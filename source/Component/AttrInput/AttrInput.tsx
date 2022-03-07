import { Component, ReactNode } from "react";
import { FontLevel, Theme } from "@Component/Theme/Theme";
import "./AttrInput.scss";
import { Icon } from "@fluentui/react";
import { Localization, AllI18nKeys } from "@Component/Localization/Localization";

interface IAttrInputProps {
    keyI18n: AllI18nKeys;
    infoI18n?: AllI18nKeys;
    value?: number | string;
	isNumber?: boolean;
    maxLength?: number;
    max?: number;
    min?: number;
    step?: number;
    disable?: boolean;
    disableI18n?: AllI18nKeys;
    valueChange?: (value: this["isNumber"] extends true ? number : string) => any;
}

class AttrInput extends Component<IAttrInputProps> {

    private value: string = "";
    private error: ReactNode;

    private check(value: string): ReactNode {

        // 长度校验
        const maxLength = this.props.maxLength ?? 32;
        if (value.length > maxLength) {
            return <Localization i18nKey="Input.Error.Length" options={{ num: maxLength.toString() }} />
        }

        if (this.props.isNumber) {
            const praseNumber = (value as any) / 1;

            // 数字校验
            if (isNaN(praseNumber)) {
                return <Localization i18nKey="Input.Error.Not.Number" />
            }

            // 最大值校验
            if (this.props.max !== undefined && praseNumber > this.props.max) {
                return <Localization i18nKey="Input.Error.Max" options={{ num: this.props.max.toString() }} />
            }

            // 最小值校验
            if (this.props.min !== undefined && praseNumber < this.props.min) {
                return <Localization i18nKey="Input.Error.Min" options={{ num: this.props.min.toString() }} />
            }

        }
        return undefined;
    }

    private handelValueChange = () => {
        if (!this.error && this.props.valueChange) {
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
            <div className={"input-content" + (this.error ? ` error` : "")}>
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
            </div>
            { 
                this.error ? 
                    <div className="err-message">
                        {this.error}
                    </div> : null
            }
        </>
    }

	public render(): ReactNode {

        if (!this.error) {
            const value = this.props.value ?? (this.props.isNumber ? "0" : "");
            this.value = value.toString();
            this.error = this.check(value.toString());
        }

		return <Theme
            className="attr-input"
            fontLevel={FontLevel.normal}
        >
            <div className="input-intro">
                <Localization i18nKey={this.props.keyI18n}/>
            </div>
            <div className="root-content">
                {
                    this.props.disable ? 
                        this.props.disableI18n ? 
                            <Localization i18nKey={this.props.disableI18n}/> :
                            <div>{this.props.value}</div> :
                        this.renderInput()
                }
            </div>
        </Theme>
	}
}

export { AttrInput };