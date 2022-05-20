import { Component, ReactNode } from "react";
import { Popup } from "@Context/Popups";
import { Theme } from "@Component/Theme/Theme";
import { Localization } from "@Component/Localization/Localization";
import { useSettingWithEvent, IMixinSettingProps, Themes } from "@Context/Setting";
import { ComboInput } from "@Input/ComboInput/ComboInput";
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

@useSettingWithEvent("themes", "language")
class SettingPopupComponent extends Component<ISettingPopupProps & IMixinSettingProps> {

	public render(): ReactNode {
		return <Theme className="setting-popup">

			<ComboInput
				keyI18n="Language"
				allOption={[
					{ key: "EN_US", i18n: "EN_US" },
					{ key: "ZH_CN", i18n: "ZH_CN" }
				]}
				value={{
					key: this.props.setting?.language ?? "EN_US",
					i18n: this.props.setting?.language ?? "EN_US"
				}}
				valueChange={(data) => {
					this.props.setting?.setProps("language", data.key as any);
				}}
			/>

			<ComboInput
				keyI18n="Themes"
				allOption={[
					{ key: Themes.dark as any, i18n: "Themes.Dark" },
					{ key: Themes.light as any, i18n: "Themes.Light" }
				]}
				value={{
					key: this.props.setting?.themes ?? Themes.dark as any,
					i18n: this.props.setting?.themes === Themes.dark ? "Themes.Dark" : "Themes.Light"
				}}
				valueChange={(data) => {
					this.props.setting?.setProps("themes", parseInt(data.key));
				}}
			/>
		</Theme>
	}
}

export { SettingPopup };