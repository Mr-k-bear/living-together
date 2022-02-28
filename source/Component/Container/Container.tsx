import { Theme, BackgroundLevel, FontLevel } from "@Component/Theme/Theme";
import { ILayout, LayoutDirection } from "@Model/Layout";
import { Component, ReactNode } from "react";
import "./Container.scss";

interface IContainerProps extends ILayout {
	showBar?: boolean;
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
		selfLayout: LayoutDirection = LayoutDirection.Y
	) {

		const items: [IContainerProps, IContainerProps] | undefined = props.items;
		const showBar: boolean = props.showBar ?? true;
		const panles: string[] = props.panles ?? [];
		const layout: LayoutDirection = props.layout ?? LayoutDirection.Y;
		const scale: number = props.scale ?? 50;
		const isRoot: boolean = !!props.isRoot;

		return <Theme
			className={"app-container" + (panles.length > 0 && !items ? " end-containe" : "")}
			backgroundLevel={BackgroundLevel.Level4}
			fontLevel={FontLevel.normal}
			style={{
				flexDirection: layout === LayoutDirection.Y ? "column" : undefined,
				width: isRoot ? "100%" : selfLayout === LayoutDirection.X ? `${selfScale}%` : undefined,
				height: isRoot ? "100%" : selfLayout === LayoutDirection.Y ? `${selfScale}%` : undefined
			}}
		>
			{panles.length > 0 && !items ? this.renderPanel(panles, showBar) : null}
			{items && items[0] ? this.renderContainer(items[0], scale, layout) : null}
			{items && items[1] ? <div className="drag-bar" style={{
				width: layout === LayoutDirection.Y ? "100%" : 0,
				height: layout === LayoutDirection.X ? "100%" : 0
			}}>
				<div style={{
					cursor: layout === LayoutDirection.Y ? "n-resize" : "e-resize"
				}}>
				</div>
			</div> : null}
			{items && items[1] ? this.renderContainer(items[1], 100 - scale, layout) : null}
		</Theme>
	}

	public render(): ReactNode {
		return this.renderContainer(this.props);
	}
}

export { Container };