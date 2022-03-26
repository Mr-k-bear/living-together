import { Component, ReactNode } from "react";
import { Popup } from "@Context/Popups";
import { Theme } from "@Component/Theme/Theme";
import { Localization } from "@Component/Localization/Localization";
import "./BehaviorPopup.scss";

interface IBehaviorPopupProps {

}

class BehaviorPopup extends Popup<IBehaviorPopupProps> {

	public minWidth: number = 400;
	public minHeight: number = 300;
	public width: number = 600;
	public height: number = 450;

	public onRenderHeader(): ReactNode {
		return <Localization i18nKey="Popup.Add.Behavior.Title"/>
	}

	public render(): ReactNode {
		return <BehaviorPopupComponent {...this.props}/>
	}
}

class BehaviorPopupComponent extends Component<IBehaviorPopupProps> {

	public render(): ReactNode {
		return <Theme className="behavior-popup"></Theme>
	}
}

export { BehaviorPopup };