import { Localization } from "@Component/Localization/Localization";
import { Callout, DirectionalHint, Icon } from "@fluentui/react";
import { CtrlObject } from "@Model/CtrlObject";
import { Group } from "@Model/Group";
import { Label } from "@Model/Label";
import { Range } from "@Model/Range";
import { Component, ReactNode, RefObject } from "react";
import "./PickerList.scss";

type IPickerListItem = CtrlObject | Label;

interface IPickerListProps {
	objectList?: IPickerListItem[];
	target?: RefObject<any>;
	dismiss?: () => any;
	click?: (item: IPickerListItem) => any;
}

class PickerList extends Component<IPickerListProps> {

	private renderItem(item: IPickerListItem) {

		let color: number[] = [];
		let icon: string = "tag";
		let name: string = "";

		if (item instanceof Range) {
			icon = "CubeShape"
		}
		if (item instanceof Group) {
			icon = "WebAppBuilderFragment"
		}
		if (item instanceof CtrlObject) {
			color[0] = Math.round(item.color[0] * 255);
			color[1] = Math.round(item.color[1] * 255);
			color[2] = Math.round(item.color[2] * 255);
			name = item.displayName;
		}
		if (item instanceof Label) {
			icon = "tag";
			color = item.color.concat([]);
			name = item.name;
		}

		return <div
			className="picker-list-item"
			key={item.id}
			onClick={() => {
				if (this.props.click) {
					this.props.click(item)
				}
			}}
		>
			<div className="list-item-color"
				style={{
					backgroundColor: `rgb(${color[0]},${color[1]},${color[2]})`
				}}
			></div>
			<div className="list-item-icon">
				<Icon iconName={icon}/>
			</div>
			<div className="list-item-name">
				{name}
			</div>
		</div>;
	}

	public render(): ReactNode {
		return <Callout
			onDismiss={this.props.dismiss}
			target={this.props.target}
			directionalHint={DirectionalHint.topAutoEdge}
		>
			<div className="picker-list-root">
				{this.props.objectList ? this.props.objectList.map((item) => {
					return this.renderItem(item);
				}) : null}
				{!this.props.objectList || (this.props.objectList && this.props.objectList.length <= 0) ?
					<Localization className="picker-list-nodata" i18nKey="Common.Attr.Key.Label.Picker.Nodata"/>
					: null
				}
			</div>
		</Callout>
	}
}

export { PickerList }