import { AllI18nKeys, I18N } from "@Component/Localization/Localization";
import { useStatusWithEvent, IMixinSettingProps, Themes, Language } from "@Context/Setting";
import { FunctionComponent } from "react";
import "./Message.scss";

interface IMessageProps {
    i18nKey: AllI18nKeys;
    options?: Record<string, string>;
    className?: string;
    isTitle?: boolean;
    first?: boolean;
}

const MessageView: FunctionComponent<IMessageProps & IMixinSettingProps> = (props) => {

    let theme = props.setting ? props.setting.themes : Themes.dark;
    let language: Language = props.setting ? props.setting.language : "EN_US";
    let classList: string[] = [
        "panel-error-message",
        theme === Themes.dark ? "dark" : "light",
    ];

    if (props.first) {
        classList.push("first");
    }

    if (props.isTitle) {
        classList.push("title");
        classList.push("font-lvl3");
    }

    if (props.className) {
        classList.push(props.className);
    }

    return <div className={classList.join(" ")}>
        <span className={language}>{I18N(language, props.i18nKey, props.options)}</span>
    </div>
}

const Message = useStatusWithEvent("language", "themes")(MessageView);
export { Message };