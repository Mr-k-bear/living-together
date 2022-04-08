import { AllI18nKeys, Localization } from "@Component/Localization/Localization";
import { Callout, DirectionalHint, Icon } from "@fluentui/react";
import { Component, ReactNode, RefObject } from "react";
import "./ComboList.scss";

interface IDisplayItem {
	i18nOption?: Record<string, string>;
    i18n: AllI18nKeys;
    key: string;
}

interface IComboListProps {
	target?: RefObject<any>;
    item: IDisplayItem[];
	focus?: IDisplayItem;
    noData?: AllI18nKeys;
	dismiss?: () => any;
	click?: (item: IDisplayItem) => any;
}

class ComboList extends Component<IComboListProps> {

    private renderString(item: IDisplayItem) {

		const isFocus = item.key === this.props.focus?.key;

        return <div
			className="picker-list-item"
			key={item.key}
			onClick={() => {
				if (this.props.click) {
					this.props.click(item)
				}
			}}
		>
			<div className="list-item-icon">
				<Icon
					iconName="CheckMark"
					style={{
						display: isFocus ? "block" : "none"
					}}
				/>
			</div>
			<div className="list-item-name">
				<Localization i18nKey={item.i18n} options={item.i18nOption}/>
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
                { this.props.item.map((item) => this.renderString(item)) }
				{
                    this.props.item.length <= 0 ?
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

export { ComboList, IDisplayItem }