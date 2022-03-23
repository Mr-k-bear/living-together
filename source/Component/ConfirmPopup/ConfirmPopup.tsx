import { Popup } from "@Context/Popups";
import { ReactNode } from "react";
import { Message } from "@Component/Message/Message";
import { Theme } from "@Component/Theme/Theme";
import { Localization } from "@Component/Localization/Localization";
import "./ConfirmPopup.scss";

interface IConfirmPopupProps {
	
}
class ConfirmPopup extends Popup<IConfirmPopupProps> {

	public width: number = 300;

	public height: number = 180;

	public render(): ReactNode {
		return <Theme className="confirm-root">
			<div className="content-views">
				<Message i18nKey="ZH_CN"/>
			</div>
			<div className="action-view">
				<div className="yes-button action-button">
					<Localization i18nKey="Panel.Title.Group.Details.View"/>
				</div>
				<div className="no-button action-button">
					<Localization i18nKey="Panel.Title.Group.Details.View"/>
				</div>
			</div>
		</Theme>;
	}
}

export { ConfirmPopup }