import { Localization } from "@Component/Localization/Localization";
import { FontLevel, Theme } from "@Component/Theme/Theme";
import { Icon } from "@fluentui/react";
import { Component, ReactNode } from "react";
import "./LoadFile.scss";

class LoadFile extends Component {

	private renderMask() {
		return <Theme
			className="load-file-layer-root"
			fontLevel={FontLevel.normal}
		>
			<div className="drag-icon">
				<Icon iconName="KnowledgeArticle"/>
			</div>
			<div className="drag-title">
				<Localization i18nKey="Info.Hint.Load.File.Title"/>
			</div>
			<div className="drag-intro">
				<Localization i18nKey="Info.Hint.Load.File.Intro"/>
			</div>
		</Theme>;
	}

	public render(): ReactNode {
		return <></>;
	}
}

export { LoadFile };