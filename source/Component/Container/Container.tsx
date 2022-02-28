import Theme, { BackgroundLevel, FontLevel } from "@Component/Theme/Theme";
import { Component, ReactNode } from "react";
import "./Container.scss";

enum ContaineLayout {
	X = 1,
	Y = 2
}

interface IContainerProps {
	items?: [IContainerProps, IContainerProps];
	showBar?: boolean;
	panles?: string[];
	layout?: ContaineLayout;
	scale?: number;
	isRoot?: boolean;
}

function getPanelById(id: string) {
	return <Theme className="app-panel">{id}</Theme>
}

class Container extends Component<IContainerProps> {

	private renderPanel(panles: string[], showBar: boolean) {
		return <>
			{showBar ? 
				<Theme
					className="app-tab-header"
					backgroundLevel={BackgroundLevel.Level3}
					fontLevel={FontLevel.Level3}
				>{
					panles.map((panelId: string) => {
						return <div key={panelId} className="app-tab-header-item">
							<div className="border-view"></div>
							<div className="title-view" >{panelId}</div>
						</div>
					})
				}</Theme> : null
			}
			{getPanelById(panles[0])}
		</>
	}

	private renderContainer(
		props: IContainerProps, 
		selfScale: number = 50, 
		selfLayout: ContaineLayout = ContaineLayout.Y
	) {

		const items: [IContainerProps, IContainerProps] | undefined = props.items;
		const showBar: boolean = props.showBar ?? true;
		const panles: string[] = props.panles ?? [];
		const layout: ContaineLayout = props.layout ?? ContaineLayout.Y;
		const scale: number = props.scale ?? 50;
		const isRoot: boolean = !!props.isRoot;

		return <Theme
			className={"app-container" + (panles.length > 0 && !items ? " end-containe" : "")}
			backgroundLevel={BackgroundLevel.Level4}
			fontLevel={FontLevel.normal}
			style={{
				flexDirection: layout === ContaineLayout.Y ? "column" : undefined,
				width: isRoot ? "100%" : selfLayout === ContaineLayout.X ? `${selfScale}%` : undefined,
				height: isRoot ? "100%" : selfLayout === ContaineLayout.Y ? `${selfScale}%` : undefined
			}}
		>
			{panles.length > 0 && !items ? this.renderPanel(panles, showBar) : null}
			{items && items[0] ? this.renderContainer(items[0], scale, layout) : null}
			{items && items[1] ? this.renderContainer(items[1], 100 - scale, layout) : null}
		</Theme>
	}

	public render(): ReactNode {
		return this.renderContainer(this.props);
	}
}

export { Container, ContaineLayout };