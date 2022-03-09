import { AllI18nKeys, Localization } from "@Component/Localization/Localization";
import { FunctionComponent } from "react";
import "./ErrorMessage.scss";

interface IErrorMessageProps {
    i18nKey: AllI18nKeys;
    options?: Record<string, string>;
}

const ErrorMessage: FunctionComponent<IErrorMessageProps> = (props) => {
    return <div className="panel-error-message">
        <Localization i18nKey={props.i18nKey} options={props.options}/>
    </div>
}

export { ErrorMessage };