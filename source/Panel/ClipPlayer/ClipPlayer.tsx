import { Component, ReactNode } from "react";
import { ClipList } from "@Component/ClipList/ClipList";
import { useStatusWithEvent, IMixinStatusProps } from "@Context/Status";
import { Theme } from "@Component/Theme/Theme";
import { Message } from "@Input/Message/Message";
import { Clip } from "@Model/Clip";
import { ActuatorModel } from "@Model/Actuator";
import "./ClipPlayer.scss";

@useStatusWithEvent("clipChange", "focusClipChange", "actuatorStartChange")
class ClipPlayer extends Component<IMixinStatusProps> {

	private renderMessage(): ReactNode {
		return <Message i18nKey="Panel.Info.Clip.List.Error.Nodata"/>;
	}

	private renderClipList(clipList: Clip[]): ReactNode {

		const disable =
			!this.props.status?.focusClip && 
			(
				this.props.status?.actuator.mod === ActuatorModel.Record ||
				this.props.status?.actuator.mod === ActuatorModel.Offline
			);

		return <ClipList
			clips={clipList}
			disable={disable}
		/>;
	}

	public render(): ReactNode {
		const clipList = this.props.status?.model.clipPool ?? [];

		return <Theme className="Clip-player-clip-list-root">
			{ clipList.length > 0 ? null : this.renderMessage() }
			{ this.renderClipList(clipList) }
		</Theme>;
	}
}

export { ClipPlayer };