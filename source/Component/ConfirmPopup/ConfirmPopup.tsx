import { Popup } from "@Context/Popups";
import { ReactNode } from "react";
import { Message } from "@Component/Message/Message";
import { Theme } from "@Component/Theme/Theme";
import { AllI18nKeys, Localization } from "@Component/Localization/Localization";
import "./ConfirmPopup.scss";

interface IConfirmPopupProps {
	titleI18N?: AllI18nKeys;
	infoI18n: AllI18nKeys;
	yesI18n?: AllI18nKeys;
	noI18n?: AllI18nKeys;
	yes?: () => any;
	no?: () => any;
	red?: "yes" | "no";
}
class ConfirmPopup extends Popup<IConfirmPopupProps> {

	public width: number = 300;

	public height: number = 180;

	public onRenderHeader(): ReactNode {
		return <Localization i18nKey={this.props.titleI18N ?? "Popup.Title.Confirm"}/>
	}

	public render(): ReactNode {

		const yesClassList: string[] = ["action-button", "yes-button"];
		const noClassList: string[] = ["action-button", "no-button"];
		if (this.props.red === "no") {
			noClassList.push("red");
		}
		if (this.props.red === "yes") {
			yesClassList.push("red");
		}

		return <Theme className="confirm-root">
			<div className="content-views">
				<Message i18nKey={this.props.infoI18n}/>
			</div>
			<div className="action-view">
				<div className={yesClassList.join(" ")} onClick={() => {
					this.props.yes ? this.props.yes() : null;
					this.close();
				}}>
					<Localization i18nKey={this.props.yesI18n ?? "Popup.Action.Yes"}/>
				</div>
				<div className={noClassList.join(" ")} onClick={() => {
					this.props.no ? this.props.no() : null;
					this.close();
				}}>
					<Localization i18nKey={this.props.noI18n ?? "Popup.Action.No"}/>
				</div>
			</div>
		</Theme>;
	}
}

export { ConfirmPopup }