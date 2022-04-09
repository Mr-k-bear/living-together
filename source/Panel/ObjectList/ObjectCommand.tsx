import { Component, ReactNode } from "react";
import { BackgroundLevel, FontLevel, Theme } from "@Component/Theme/Theme";
import { useStatus, IMixinStatusProps } from "@Context/Status";
import { ConfirmPopup } from "@Component/ConfirmPopup/ConfirmPopup";
import { ObjectID } from "@Model/Model";
import { Icon } from "@fluentui/react";
import "./ObjectList.scss";

@useStatus
class ObjectCommand extends Component<IMixinStatusProps> {
	public render(): ReactNode {
		return <Theme
			className="object-list-command-bar"
			backgroundLevel={BackgroundLevel.Level4}
			fontLevel={FontLevel.normal}
		>
			<div
				className="command-item"
				onClick={() => {
					if (this.props.status) {
						let allObjSet = new Set<ObjectID>();
						this.props.status.model.objectPool.forEach((obj) => {
							allObjSet.add(obj.id.toString());
						})
						this.props.status.setFocusObject(allObjSet);
					}
				}}
			>
				<Icon iconName="CheckMark"></Icon>
			</div>
			<div
				className="command-item"
				onClick={() => {
					if (this.props.status) {
						this.props.status.setFocusObject(new Set<ObjectID>());
					}
				}}
			>
				<Icon iconName="CalculatorMultiply"></Icon>
			</div>
			<div
				className="command-item"
				onClick={() => {
					this.props.status ? this.props.status.newGroup() : undefined;
				}}
			>
				<Icon iconName="WebAppBuilderFragmentCreate"></Icon>
			</div>
			<div
				className="command-item"
				onClick={() => {
					this.props.status ? this.props.status.newRange() : undefined;
				}}
			>
				<Icon iconName="ProductVariant"></Icon>
			</div>
			<div
				className="command-item red"
				onClick={() => {
					if (this.props.status && this.props.status.focusObject.size > 0) {
						const status = this.props.status;
						status.popup.showPopup(ConfirmPopup, {
							infoI18n: "Popup.Delete.Objects.Confirm",
							titleI18N: "Popup.Action.Objects.Confirm.Title",
							yesI18n: "Popup.Action.Objects.Confirm.Delete",
							red: "yes",
							yes: () => {
								let deleteId: ObjectID[] = [];
								status.focusObject.forEach((obj) => {
									deleteId.push(obj);
								})
								status.model.deleteObject(deleteId);
								status.setFocusObject(new Set<ObjectID>());
							}
						})
					}
				}}
			>
				<Icon iconName="Delete"></Icon>
			</div>
		</Theme>
	}
}

export { ObjectCommand };