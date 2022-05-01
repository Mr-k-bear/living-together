import { Component, ReactNode } from "react";
import { ClipList } from "@Component/ClipList/ClipList";
import { useStatusWithEvent, IMixinStatusProps } from "@Context/Status";
import { BackgroundLevel, FontLevel, Theme } from "@Component/Theme/Theme";
import { Message } from "@Input/Message/Message";
import { Clip } from "@Model/Clip";
import { ActuatorModel } from "@Model/Actuator";
import { ConfirmPopup } from "@Component/ConfirmPopup/ConfirmPopup";
import "./ClipPlayer.scss";

@useStatusWithEvent("clipChange", "focusClipChange", "actuatorStartChange")
class ClipPlayer extends Component<IMixinStatusProps> {

	private isInnerClick: boolean = false;

	private renderMessage(): ReactNode {
		return <Message i18nKey="Panel.Info.Clip.List.Error.Nodata"/>;
	}

	private isClipListDisable() {
		return !this.props.status?.focusClip && 
		(
			this.props.status?.actuator.mod === ActuatorModel.Record ||
			this.props.status?.actuator.mod === ActuatorModel.Offline
		);
	}

	private renderClipList(clipList: Clip[]): ReactNode {

		return <ClipList
			focus={this.props.status?.focusClip}
			clips={clipList}
			disable={this.isClipListDisable()}
			delete={(clip) => {
				this.isInnerClick = true;
				const status = this.props.status;
				if (status) {
					status.popup.showPopup(ConfirmPopup, {
						infoI18n: "Popup.Delete.Clip.Confirm",
						titleI18N: "Popup.Action.Objects.Confirm.Title",
						yesI18n: "Popup.Action.Objects.Confirm.Delete",
						red: "yes",
						yes: () => {
							status.setClipObject();
							this.props.status?.actuator.endPlay();
							status.model.deleteClip(clip.id);
						}
					});
				}
			}}
			add={() => {
				this.isInnerClick = true;
			}}
			click={(clip) => {
				this.isInnerClick = true;
				this.props.status?.setClipObject(clip);
				this.props.status?.actuator.startPlay(clip);
			}}
		/>;
	}

	public render(): ReactNode {
		const clipList = this.props.status?.model.clipPool ?? [];

		return <Theme
			className="Clip-player-clip-list-root"
			fontLevel={FontLevel.normal}
			backgroundLevel={BackgroundLevel.Level4}
			onClick={()=>{
				
				// 拦截禁用状态的事件
				if (this.isClipListDisable()) {
					return;
				}
				
				if (this.isInnerClick) {
					this.isInnerClick = false;
				}

				else {
					this.props.status?.setClipObject();
					this.props.status?.actuator.endPlay();
				}
			}}
		>
			{ clipList.length > 0 ? null : this.renderMessage() }
			{ this.renderClipList(clipList) }
		</Theme>;
	}
}

export { ClipPlayer };