import { Localization } from "@Component/Localization/Localization";
import { FontLevel, Theme } from "@Component/Theme/Theme";
import { Icon } from "@fluentui/react";
import { Component, ReactNode } from "react";
import "./LoadFile.scss";

interface ILoadFileState {
	show: boolean;
}

class LoadFile extends Component<{}, ILoadFileState> {

	public state: Readonly<ILoadFileState> = {
		show: false
	};

	private renderMask() {
		return <Theme
			className="load-file-layer-root"
			fontLevel={FontLevel.normal}
			onDragEnter={this.handleWindowsDragOnFiles}
			onDragLeave={this.handleWindowsDragOffFiles}
		>
			<div className="load-file-layer">
				<div className="drag-icon">
					<Icon iconName="KnowledgeArticle"/>
				</div>
				<div className="drag-title">
					<Localization i18nKey="Info.Hint.Load.File.Title"/>
				</div>
				<div className="drag-intro">
					<Localization i18nKey="Info.Hint.Load.File.Intro"/>
				</div>
			</div>
		</Theme>;
	}

	private offDragTimer: NodeJS.Timeout | undefined;

	private handleWindowsDragOnFiles = () => {
		clearTimeout(this.offDragTimer as number | undefined);
		this.setState({
			show: true
		});
	}

	private handleWindowsDragOffFiles = () => {
		clearTimeout(this.offDragTimer as number | undefined);
		this.offDragTimer = setTimeout(() => {
			this.setState({
				show: false
			});
		});
	}

	public componentDidMount() {
		window.addEventListener("dragenter", this.handleWindowsDragOnFiles);
	}

	public componentWillUnmount() {
		window.removeEventListener("dragenter", this.handleWindowsDragOnFiles);
	}

	public render(): ReactNode {
		return this.state.show ? this.renderMask() : null;
	}
}

export { LoadFile };