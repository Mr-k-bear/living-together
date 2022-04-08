import { AllI18nKeys, Localization } from "@Component/Localization/Localization";
import { Callout, DirectionalHint, Icon } from "@fluentui/react";
import { Behavior } from "@Model/Behavior";
import { CtrlObject } from "@Model/CtrlObject";
import { Group } from "@Model/Group";
import { Label } from "@Model/Label";
import { Range } from "@Model/Range";
import { Component, ReactNode, RefObject } from "react";
import "./PickerList.scss";

type IPickerListItem = CtrlObject | Label | Range | Group | Behavior;
interface IDisplayInfo {
    color: string;
    icon: string;
    name: string;
    internal: boolean;
    allLabel: boolean;
};

interface IDisplayItem {
    nameKey: AllI18nKeys;
    key: string;
	mark?: boolean;
}

function getObjectDisplayInfo(item?: IPickerListItem): IDisplayInfo {

    if (!item) {
        return {
            color: "transparent",
            icon: "Label",
            name: "Input.Error.Select",
            internal: true,
            allLabel: false
        }
    }

	let color: number[] | string = [];
	let icon: string = "tag";
	let name: string = "";
    let internal: boolean = false;
    let allLabel: boolean = false;

	if (item instanceof Range) {
		icon = "CubeShape"
	}
	if (item instanceof Group) {
		icon = "WebAppBuilderFragment"
	}
	if (item instanceof CtrlObject) {
        color = [];
		color[0] = Math.round(item.color[0] * 255);
		color[1] = Math.round(item.color[1] * 255);
		color[2] = Math.round(item.color[2] * 255);
		name = item.displayName;
	}
	if (item instanceof Label) {

		if (item.isBuildIn) {
            internal = true;
            allLabel = true;
            color = "transparent";
            if (item.id === "AllRange") {
                icon = "ProductList";
                name = "Build.In.Label.Name.All.Range";
            } else if (item.id === "AllGroup") {
                icon = "SizeLegacy";
                name = "Build.In.Label.Name.All.Group";
            }
        } 
        
        else {
            icon = "tag";
            color = item.color.concat([]);
            name = item.name;
        }
	}

	if (item instanceof Behavior) {
		color = item.color;
		icon = item.iconName;
		name = item.name;
		internal = false;
		allLabel = false;
	}

    if (Array.isArray(color)) {
        color = `rgb(${color[0]},${color[1]},${color[2]})`;
    }

	return {
		color: color,
		icon: icon,
		name: name,
        internal: internal,
        allLabel: allLabel
	}
}

interface IPickerListProps {
    displayItems?: IDisplayItem[];
	objectList?: IPickerListItem[];
	target?: RefObject<any>;
    noData?: AllI18nKeys;
	dismiss?: () => any;
	clickObjectItems?: (item: IPickerListItem) => any;
    clickDisplayItems?: (item: IDisplayItem) => any;
}

class PickerList extends Component<IPickerListProps> {

	private renderItem(item: IPickerListItem) {
		const displayInfo = getObjectDisplayInfo(item);

		return <div
			className="picker-list-item"
			key={item.id}
			onClick={() => {
				if (this.props.clickObjectItems) {
					this.props.clickObjectItems(item)
				}
			}}
		>
			<div className={
                "list-item-color" + (
                    displayInfo.allLabel ? " rainbow-back-ground-color" : ""
                )
            }
				style={{
					backgroundColor: displayInfo.color
				}}
			></div>
			<div className="list-item-icon">
				<Icon iconName={displayInfo.icon}/>
			</div>
			<div className="list-item-name">
				{
                    displayInfo.internal ? 
                        <Localization i18nKey={displayInfo.name}/> :
                        displayInfo.name
                }
			</div>
		</div>;
	}

    private renderString(item: IDisplayItem) {
        return <div
			className="picker-list-item"
			key={item.key}
			onClick={() => {
				if (this.props.clickDisplayItems) {
					this.props.clickDisplayItems(item)
				}
			}}
		>
			<div className="list-item-icon">
				<Icon iconName="CheckMark" style={{
					display: item.mark ? "block" : "none"
				}}/>
			</div>
			<div className="list-item-name">
				<Localization i18nKey={item.nameKey}/>
			</div>
		</div>;
    }

	public render(): ReactNode {
		return <Callout
			onDismiss={this.props.dismiss}
			target={this.props.target}
			directionalHint={DirectionalHint.topCenter}
		>
			<div className="picker-list-root">
				{this.props.objectList ? this.props.objectList.map((item) => {
					return this.renderItem(item);
				}) : null}
                {this.props.displayItems ? this.props.displayItems.map((item) => {
					return this.renderString(item);
				}) : null}
				{
                    !(this.props.objectList || this.props.displayItems) || 
                    !(
                        this.props.objectList && this.props.objectList.length > 0 || 
                        this.props.displayItems && this.props.displayItems.length > 0
                    ) ?
                        <Localization
                            className="picker-list-nodata"
                            i18nKey={this.props.noData ?? "Common.No.Data"}
                        />
                        : null
				}
			</div>
		</Callout>
	}
}

export { PickerList, IDisplayItem, IDisplayInfo, getObjectDisplayInfo }