import { Component, ReactNode } from "react";
import { Icon } from "@fluentui/react";
import { AllI18nKeys, I18N } from "@Component/Localization/Localization";
import { BackgroundLevel, FontLevel, Theme } from "@Component/Theme/Theme";
import { useSettingWithEvent, IMixinSettingProps } from "@Context/Setting";
import "./SearchBox.scss";

interface ISearchBoxProps {
	value?: string;
	valueChange?: (value: string) => void;
	placeholderI18N?: AllI18nKeys;
	className?: string;
}

@useSettingWithEvent("language")
class SearchBox extends Component<ISearchBoxProps & IMixinSettingProps> {

	private renderCleanBox() {
		return <div className="clean-box">
			<div
				className="clean-box-view"
				onClick={() => {
					if (this.props.valueChange) {
						this.props.valueChange("")
					}
				}}
			>
				<Icon iconName="CalculatorMultiply"/>
			</div>
		</div>;
	}

	public render(): ReactNode {
		return <Theme
			className={"search-box-root" + (this.props.className ? ` ${this.props.className}` : "")}
			backgroundLevel={BackgroundLevel.Level3}
			fontLevel={FontLevel.normal}
		>
			<div className="search-icon">
				<Icon iconName="search"/>
			</div>
			<div className="input-box">
				<input
					value={this.props.value}
					placeholder={
						I18N(this.props, this.props.placeholderI18N ?? "Common.Search.Placeholder")
					}
					onInput={(e) => {
						if (e.target instanceof HTMLInputElement && this.props.valueChange) {
							this.props.valueChange(e.target.value)
						}
					}}
				/>
			</div>
			{this.props.value ? this.renderCleanBox() : null}
		</Theme>
	}
}

export { SearchBox };