import { Component, ReactNode } from "react";
import { Popup } from "@Context/Popups";
import { useStatusWithEvent, IMixinStatusProps } from "@Context/Status";
import { Localization } from "@Component/Localization/Localization";
import { AttrInput } from "@Input/AttrInput/AttrInput";
import { Message } from "@Input/Message/Message";
import { ConfirmContent } from "@Component/ConfirmPopup/ConfirmPopup";
import { ProcessPopup } from "@Component/ProcessPopup/ProcessPopup";
import { Emitter } from "@Model/Emitter";
import "./OfflineRender.scss";

interface IOfflineRenderProps {
	close?: () => any;
}

interface IOfflineRenderState {
	time: number;
	fps: number;
	name: string;
}

class OfflineRender extends Popup<IOfflineRenderProps> {

	public minWidth: number = 250;
	public minHeight: number = 150;
	public width: number = 400;
	public height: number = 300;

	public maskForSelf: boolean = true;

	public onRenderHeader(): ReactNode {
		return <Localization i18nKey="Popup.Offline.Render.Title"/>
	}

	public render(): ReactNode {
		return <OfflineRenderComponent {...this.props} close={() => {
			this.close();
		}}/>
	}
}

@useStatusWithEvent()
class OfflineRenderComponent extends Component<IOfflineRenderProps & IMixinStatusProps, IOfflineRenderState> {

	public constructor(props: IOfflineRenderProps & IMixinStatusProps) {
		super(props);
		this.state = {
			name: this.props.status?.getNewClipName() ?? "",
			time: 10,
			fps: 60
		}
	}

	public render(): ReactNode {
		return <ConfirmContent
			className="offline-render-popup"
			actions={[{
				i18nKey: "Popup.Offline.Render.Input.Start",
				onClick: () => {

					// 获取新实例
					let newClip = this.props.status?.newClip();

					if (newClip) {
						newClip.name = this.state.name;
						this.props.status?.actuator.offlineRender(newClip, this.state.time, this.state.fps);

						// 开启进度条弹窗
						this.props.status?.popup.showPopup(ProcessPopup, {});
					}

					// 关闭这个弹窗
					this.props.close && this.props.close();
				}
			}]}
		>

			<Message i18nKey="Popup.Offline.Render.Message" isTitle first/>

			<AttrInput
                id={"Render-Name"}
				value={this.state.name}
				keyI18n="Popup.Offline.Render.Input.Name"
				maxLength={15}
                valueChange={(val) => {
                    this.setState({
						name: val
					});
                }}
            />

			<AttrInput
				isNumber
                id={"Render-Time"}
				value={this.state.time}
				keyI18n="Popup.Offline.Render.Input.Time"
				max={3600}
				min={1}
                valueChange={(val) => {
                    this.setState({
						time: parseFloat(val)
					});
                }}
            />

			<AttrInput
				isNumber
                id={"Render-FPS"}
				max={1000}
				min={1}
				value={this.state.fps}
				keyI18n="Popup.Offline.Render.Input.Fps"
                valueChange={(val) => {
                    this.setState({
						fps: parseFloat(val)
					});
                }}
            />

		</ConfirmContent>
	}
}

export { OfflineRender };