import { Popup } from "@Context/Popups";
import { Component, ReactNode } from "react";
import { Message } from "@Component/Message/Message";
import { Theme } from "@Component/Theme/Theme";
import { AllI18nKeys, Localization } from "@Component/Localization/Localization";
import "./ConfirmPopup.scss";

interface IConfirmPopupProps {
	titleI18N?: AllI18nKeys;
	titleI18NOption?: Record<string, string>;
	infoI18n?: AllI18nKeys;
	yesI18n?: AllI18nKeys;
	noI18n?: AllI18nKeys;
    renderInfo?: () => ReactNode;
	red?: "yes" | "no";
	yes?: () => any;
	no?: () => any;
}
class ConfirmPopup extends Popup<IConfirmPopupProps> {

	public minWidth: number = 300;
	public minHeight: number = 180;
	public width: number = 300;
	public height: number = 180;

	public onRenderHeader(): ReactNode {
		return <Localization
			i18nKey={this.props.titleI18N ?? "Popup.Title.Confirm"}
			options={this.props.titleI18NOption}
		/>
	}

	private genActionClickFunction(fn?: () => any): () => any {
		return () => {
			if (fn) fn();
			this.close();
		};
	}

	public render(): ReactNode {

		const actionList: IActionButtonProps[] = [];

		if (this.props.yesI18n || this.props.yes) {
			actionList.push({
				i18nKey: this.props.yesI18n ?? "Popup.Action.Yes",
				onClick: this.genActionClickFunction(this.props.yes),
				color: this.props.red === "yes" ? "red" : undefined
			});
		}

		if (this.props.noI18n || this.props.no) {
			actionList.push({
				i18nKey: this.props.noI18n ?? "Popup.Action.Yes",
				onClick: this.genActionClickFunction(this.props.no),
				color: this.props.red === "no" ? "red" : undefined
			});
		}

		return <ConfirmContent
			actions={actionList}
		>
			{
                this.props.renderInfo ?
                    this.props.renderInfo() :
                        this.props.infoI18n ?
                            <Message i18nKey={this.props.infoI18n}/> :
                            null
            }
		</ConfirmContent>
	}
}

interface IConfirmContentProps {
	hidePadding?: boolean;
	className?: string;
	actions: IActionButtonProps[];
	customFooter?: () => ReactNode;
	header?: () => ReactNode;
	headerHeight?: number;
}

interface IActionButtonProps {
	className?: string;
	disable?: boolean;
	color?: "red" | "blue";
	i18nKey: AllI18nKeys;
	i18nOption?: Record<string, string>;
	onClick?: () => void;
}

class ConfirmContent extends Component<IConfirmContentProps> {

	public renderActionButton(props: IActionButtonProps, key: number): ReactNode {

		const classList = ["action-button"];
		if (props.className) {
			classList.push(props.className);
		}

		if (props.color === "red") {
			classList.push("red");
		}

		if (props.color === "blue") {
			classList.push("blue");
		}

		if (props.disable) {
			classList.push("disable");
		}

		return <div
			className={classList.join(" ")}
			onClick={props.disable ? undefined : props.onClick}
			key={key}
		>
			<Localization i18nKey={props.i18nKey} options={props.i18nOption}/>
		</div>
	}

	private getHeaderHeight(): number {
		return this.props.headerHeight ?? 0;
	}

	private renderHeader() {
		return <div
			className="header-view"
			style={{
				maxHeight: this.getHeaderHeight(),
				minHeight: this.getHeaderHeight(),
				height: this.getHeaderHeight()
			}}
		>
			{this.props.header ? this.props.header() : null}
		</div>
	}
	
	public render(): ReactNode {

		const contentClassNameList: string[] = ["content-views"];

		if (this.props.className) {
			contentClassNameList.push(this.props.className);
		}

		if (!this.props.hidePadding) {
			contentClassNameList.push("has-padding");
		}

		return <Theme className="confirm-root">

			{this.props.header ? this.renderHeader() : null}

			<div
				className={contentClassNameList.join(" ")}
				style={{
					height: `calc( 100% - ${this.getHeaderHeight() + 46}px )`
				}}
			>
				{this.props.children}
			</div>
			
			<div className="action-view">
				<div className="action-right-view">
					{this.props.customFooter ? this.props.customFooter() : null}
				</div>
				{
					this.props.actions ? 
						this.props.actions.map((prop, index) => {
							return this.renderActionButton(prop, index);
						}) : null
				}
			</div>
		</Theme>;
	}
}

export { ConfirmPopup, ConfirmContent }