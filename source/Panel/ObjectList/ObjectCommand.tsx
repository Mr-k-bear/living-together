import { BackgroundLevel, FontLevel, Theme } from "@Component/Theme/Theme";
import { useStatus, IMixinStatusProps } from "../../Context/Status";
import { Icon } from "@fluentui/react";
import { Component, ReactNode } from "react";
import { ObjectID } from "@Model/Renderer";
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
					this.props.status ? this.props.status.model.draw() : undefined;
				}}
			>
				<Icon iconName="WebAppBuilderFragmentCreate"></Icon>
			</div>
			<div
				className="command-item"
				onClick={() => {
					this.props.status ? this.props.status.newRange() : undefined;
					this.props.status ? this.props.status.model.draw() : undefined;
				}}
			>
				<Icon iconName="CubeShape"></Icon>
			</div>
			<div
				className="command-item"
				onClick={() => {
					if (this.props.status) {
						let deleteId: ObjectID[] = [];
						this.props.status.focusObject.forEach((obj) => {
							deleteId.push(obj);
						})
						this.props.status.model.deleteObject(deleteId);
						this.props.status.setFocusObject(new Set<ObjectID>());
						this.props.status.model.draw();
					}
				}}
			>
				<Icon iconName="Delete"></Icon>
			</div>
		</Theme>
	}
}

export { ObjectCommand };