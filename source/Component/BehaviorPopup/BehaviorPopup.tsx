import { Component, ReactNode } from "react";
import { Popup } from "@Context/Popups";
import { Localization } from "@Component/Localization/Localization";
import { SearchBox } from "@Component/SearchBox/SearchBox";
import { ConfirmContent } from "@Component/ConfirmPopup/ConfirmPopup";
import "./BehaviorPopup.scss";

interface IBehaviorPopupProps {

}

interface IBehaviorPopupState {
	searchValue: string;
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

class BehaviorPopupComponent extends Component<IBehaviorPopupProps, IBehaviorPopupState> {

	state: Readonly<IBehaviorPopupState> = {
		searchValue: ""
	};

	private renderHeader = () => {
		return <div className="behavior-popup-search-box">
			<SearchBox
				valueChange={(value) => {
					this.setState({
						searchValue: value
					});
				}}
				value={this.state.searchValue}
			/>
		</div>;
	}

	public render(): ReactNode {
		return <ConfirmContent
			className="behavior-popup"
			actions={[{
				i18nKey: "Popup.Add.Behavior.Action.Add"
			}]}
			header={this.renderHeader}
			headerHeight={36}
		>
			
		</ConfirmContent>
	}
}

export { BehaviorPopup };