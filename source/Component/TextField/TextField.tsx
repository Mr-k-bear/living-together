import { Component, ReactNode, RefObject } from "react";
import { FontLevel, Theme } from "@Component/Theme/Theme";
import { AllI18nKeys, Localization } from "@Component/Localization/Localization";
import "./TextField.scss";

interface ITextFieldProps {
    className?: string;
    keyI18n: AllI18nKeys;
    infoI18n?: AllI18nKeys;
    disableI18n?: AllI18nKeys;
    disableI18nOption?: Record<string, string>;
    errorI18n?: AllI18nKeys;
    errorI18nOption?: Record<string, string>;
    targetRef?: RefObject<HTMLDivElement>;
    customStyle?: boolean;
    customHoverStyle?: boolean;
    onClick?: () => any;
}

class TextField extends Component<ITextFieldProps> {

    private renderInput() {

        const classList: string[] = ["text-field-content"];
        if (this.props.className) {
            classList.push(this.props.className);
        }
        if (!this.props.customStyle) {
            classList.push("text-field-content-styled");
        }
        if (!this.props.customHoverStyle) {
            classList.push("text-field-content-hover-styled");
        }
        if (this.props.errorI18n) {
            classList.push("text-field-content-error");
        }

        return <div
            className={classList.join(" ")}
            ref={this.props.targetRef}
            style={{ cursor: "pointer" }}
            onClick={this.props.onClick}
        >
            { this.props.children }
        </div>
    }

    private renderDisable() {
        return <div
            className={
                `${
                    "text-field-content"
                } ${
                    "text-field-content-styled"
                } ${
                    "text-field-content-hover-styled"
                } ${
                    "text-field-content-disable"
                }`
            }
            ref={this.props.targetRef}
            style={{ cursor: "not-allowed" }}
            onClick={this.props.onClick}
        >
            <Localization
                i18nKey={this.props.disableI18n ?? "Common.No.Unknown.Error"}
                options={this.props.disableI18nOption}
            />
        </div>
    }

    private renderError() {
        return <div className="text-field-error-message">
            <Localization
                i18nKey={this.props.errorI18n ?? "Common.No.Unknown.Error"}
                options={this.props.errorI18nOption}
            />
        </div>
    }

    public render(): ReactNode {
        return <>
            <Theme className="text-field-root" fontLevel={FontLevel.normal}>
                <div className="text-field-intro">
                    <Localization i18nKey={this.props.keyI18n}/>
                </div>
                <div className="text-field-container">
                    {
                        this.props.disableI18n ? 
                            this.renderDisable() :
                            this.renderInput()
                    }
                    {
                        this.props.errorI18n ?
                            this.renderError() :
                            undefined
                    }
                </div>
            </Theme>
        </>
    }
}

export { TextField, ITextFieldProps };