import { Component, ReactNode } from "react";
import { Popup } from "@Context/Popups";
import { Theme } from "@Component/Theme/Theme";
import { Localization } from "@Component/Localization/Localization";
import "./SettingPopup.scss";

interface ISettingPopupProps {

}

class SettingPopup extends Popup<ISettingPopupProps> {

	public minWidth: number = 400;
	public minHeight: number = 300;
	public width: number = 600;
	public height: number = 450;

	public onRenderHeader(): ReactNode {
		return <Localization i18nKey="Popup.Setting.Title"/>
	}

	public render(): ReactNode {
		return <SettingPopupComponent {...this.props}/>
	}
}

class SettingPopupComponent extends Component<ISettingPopupProps> {

	public render(): ReactNode {
		return <Theme className="setting-popup"></Theme>
	}
}

export { SettingPopup };