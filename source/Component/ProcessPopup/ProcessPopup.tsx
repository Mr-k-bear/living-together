import { Component, ReactNode } from "react";
import { Popup } from "@Context/Popups";
import { Localization } from "@Component/Localization/Localization";
import { ConfirmContent } from "@Component/ConfirmPopup/ConfirmPopup";
import { useStatusWithEvent, IMixinStatusProps } from "@Context/Status";
import { ProgressIndicator } from "@fluentui/react";
import { ActuatorModel } from "@Model/Actuator";
import "./ProcessPopup.scss";

interface IProcessPopupProps {
	close?: () => void;
}

class ProcessPopup extends Popup<IProcessPopupProps> {

	public minWidth: number = 400;
	public minHeight: number = 150;
	public width: number = 400;
	public height: number = 150;

	public maskForSelf: boolean = true;

	public onClose(): void {}

	public onRenderHeader(): ReactNode {
		return <Localization i18nKey="Popup.Offline.Render.Process.Title"/>
	}

	public render(): ReactNode {
		return <ProcessPopupComponent {...this.props} close={() => this.close()}/>
	}
}

@useStatusWithEvent("offlineLoop", "actuatorStartChange", "recordLoop")
class ProcessPopupComponent extends Component<IProcessPopupProps & IMixinStatusProps> {

	public render(): ReactNode {

		let current = this.props.status?.actuator.offlineCurrentFrame ?? 0;
		let all = this.props.status?.actuator.offlineAllFrame ?? 0;

		const isRendering = this.props.status?.actuator.mod === ActuatorModel.Offline;
		let i18nKey = "";
		let color: undefined | "red";
		let onClick = () => {};

		if (isRendering) {
			i18nKey = "Popup.Offline.Render.Input.End";
			color = "red";
			onClick = () => {
				this.props.status?.actuator.endOfflineRender();
				this.forceUpdate();
			}
		}

		else {
			i18nKey = "Popup.Offline.Render.Input.Finished";
			onClick = () => {
				this.props.close && this.props.close();
			}
		}

		return <ConfirmContent
			className="process-popup"
			actions={[{
				i18nKey: i18nKey,
				color: color,
				onClick: onClick
			}]}
		>

			<ProgressIndicator
				percentComplete={current / all}
				barHeight={3}
			/>

			<Localization
				i18nKey="Popup.Offline.Render.Process"
				options={{
					current: current.toString(),
					all: all.toString()
				}}
			/>

		</ConfirmContent>
	}
}

export { ProcessPopup };