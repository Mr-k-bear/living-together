import { Component, ReactNode, DetailedHTMLProps, HTMLAttributes } from "react";
import { useSetting, IMixinSettingProps, Language } from "@Context/Setting";
import "./Localization.scss";

import EN_US from "@Localization/EN-US";
import ZH_CN from "@Localization/ZH-CN";

const LanguageDataBase = {
    EN_US, ZH_CN
}

type AllI18nKeys = (keyof typeof EN_US) | string;

interface ILocalizationProps {
    className?: string;
    i18nKey: AllI18nKeys;
    options?: Record<string, string>;
}

function I18N(language: Language | IMixinSettingProps, key: AllI18nKeys, values?: Record<string, string>) {
    let lang: Language;
    if (typeof language === "string") {
        lang = language;
    } else {
        lang = language.setting?.language ?? "EN_US";
    }
    let languageDataBase = LanguageDataBase[lang];
    if (!languageDataBase) languageDataBase = LanguageDataBase["EN_US"];
    let i18nValue = languageDataBase[key as keyof typeof EN_US];
    if (!i18nValue) i18nValue = key;
    if (values) {
        for (let valueKey in values) {
            i18nValue = i18nValue.replaceAll(new RegExp(`\\{\\s*${valueKey}\\s*\\}`, "g"), values[valueKey]);
        }
    }
    return i18nValue;
}

/**
 * 本地化组件
 */
@useSetting
class Localization extends Component<ILocalizationProps & IMixinSettingProps & 
    DetailedHTMLProps<
        HTMLAttributes<HTMLSpanElement>, HTMLSpanElement
    >
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
        return <span {...safeProps} className={classNameList.join(" ")}>
            {I18N(language, this.props.i18nKey, this.props.options)}
        </span>
    }
}

export { Localization, I18N, LanguageDataBase, AllI18nKeys };