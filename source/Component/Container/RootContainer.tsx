import { Component, ReactNode } from "react";
import { useSetting, IMixinSettingProps, Themes } from "@Context/Setting";
import { Container } from "./Container";

@useSetting
class RootContainer extends Component<IMixinSettingProps> {

	private handelChange = () => {
		this.forceUpdate();
	}

	public componentDidMount() {
		if (this.props.setting) {
			this.props.setting.layout.on("layoutChange", this.handelChange);
			this.props.setting.layout.on("scaleChange", this.handelChange);
			this.props.setting.layout.on("switchTab", this.handelChange);
			this.props.setting.on("themes", this.handelChange);
		}
	}

	public componentWillUnmount() {
		if (this.props.setting) {
			this.props.setting.layout.off("layoutChange", this.handelChange);
			this.props.setting.layout.off("scaleChange", this.handelChange);
			this.props.setting.layout.off("switchTab", this.handelChange);
			this.props.setting.off("themes", this.handelChange);
		}
	}

	public render(): ReactNode {
		const layoutData = this.props.setting ? this.props.setting.layout.getData() : {};
		const theme = this.props.setting?.themes ?? Themes.dark;
		const focusId = this.props.setting?.layout.focusId ?? "";
		return <Container
			scale={layoutData.scale}
			items={layoutData.items}
			layout={layoutData.layout}
			theme={theme}
			isRoot={true}
			onScaleChange={this.props.setting?.layout.setScale}
			onFocusTab={this.props.setting?.layout.focus}
			id={layoutData.id}
			focusId={focusId}
		/>
	}
}

export { RootContainer }