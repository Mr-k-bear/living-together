import { Component, ReactNode } from "react";
import { TooltipHost, ITooltipHostProps } from "@fluentui/react";
import { useSetting, IMixinSettingProps, Language } from "@Context/Setting";
import { I18N, AllI18nKeys } from "./Localization";
import "./Localization.scss";

interface ILocalizationTooltipHostProps {
    className?: string;
    i18nKey: AllI18nKeys;
    options?: Record<string, string>;
}

/**
 * 本地化组件
 */
@useSetting
class LocalizationTooltipHost extends Component<ILocalizationTooltipHostProps & IMixinSettingProps & 
	ITooltipHostProps
> {

    private handelLanguageChange = () => {
        this.forceUpdate();
    }

    public componentDidMount() {
        if (this.props.setting) {
            this.props.setting.on("language", this.handelLanguageChange);
        }
    }

    public componentWillUnmount() {
        if (this.props.setting) {
            this.props.setting.off("language", this.handelLanguageChange);
        }
    }

    public render(): ReactNode {
        let language: Language = this.props.setting ? this.props.setting.language : "EN_US";
        let classNameList: string[] = [];
        if (this.props.className) classNameList.push(this.props.className);
        classNameList.push(language);
        let safeProps = {...this.props};
        delete safeProps.className;
        delete safeProps.setting;
        delete (safeProps as any).i18nKey;
        delete safeProps.options;
        return <TooltipHost 
			{...safeProps}
			className={classNameList.join(" ")}
			content={I18N(language, this.props.i18nKey, this.props.options)}
		>
            {this.props.children}
        </TooltipHost>
    }
}

export { LocalizationTooltipHost };