import { Component, ReactNode, createRef } from "react";
import { useStatus, IMixinStatusProps } from "@Context/Status";
import { useSetting, IMixinSettingProps, Themes } from "@Context/Setting";
import { ClassicRenderer } from "@GLRender/ClassicRenderer";
import "./RenderView.scss";

@useSetting
@useStatus
class RenderView extends Component<IMixinStatusProps & IMixinSettingProps> {

	private rootEle = createRef<HTMLDivElement>();

	public render(): ReactNode {
		const theme = this.props.setting?.themes ?? Themes.dark;
		const classList: string[] = ["render-view", "background-lvl5"];
		if (theme === Themes.light) classList.push("light");
		if (theme === Themes.dark) classList.push("dark");

		if (this.props.status) {
			(this.props.status.renderer as ClassicRenderer).cleanColor = 
			(theme === Themes.dark) ?
				[27 / 255, 26 / 255, 25 / 255, 1] :
				[190 / 255, 187 / 255, 184 / 255, 1]
		}

		return <div ref={this.rootEle} className={classList.join(" ")}/>;
	}

	public componentDidMount() {
		let div = this.rootEle.current;
		console.log(div, div?.childNodes, this.props.status, this.props.status?.renderer.dom)
		if (div && (!div.childNodes || div.childNodes.length <= 0) && this.props.status) {	
			div.appendChild(this.props.status.renderer.dom);
		}
	}
}

export { RenderView }