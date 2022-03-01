import { Theme, BackgroundLevel, FontLevel } from "@Component/Theme/Theme";
import { Themes } from "@Context/Setting";
import { ILayout, LayoutDirection } from "@Model/Layout";
import { Component, ReactNode } from "react";
import "./Container.scss";

interface IContainerProps extends ILayout {
	showBar?: boolean;
	isRoot?: boolean;
	theme?: Themes;
	focusId?: string;
	onScaleChange?: (id: number, scale: number) => any;
}

function getPanelById(id: string) {
	return <Theme
		className="app-panel" draggable={false}
	>{id}</Theme>
}

class Container extends Component<IContainerProps> {

	private focusEdgeId: number | undefined;
	private readonly edgeInfo = {
		direction: LayoutDirection.Y,
		rootWidth: 0,
		rootHeight: 0,
		edgeWidth: 0,
		edgeHeight: 0,
		mouseX: 0,
		mouseY: 0
	};

	private renderPanel(panles: string[], showBar: boolean) {

		const classList: string[] = [];
		const theme: Themes = this.props.theme ?? Themes.dark;

		classList.push(theme === Themes.light ? "light" : "dark");
		classList.push(`background-${BackgroundLevel.Level3}`);
		classList.push(`font-${FontLevel.Level3}`);
		classList.push("app-tab-header");

		return <>
			{showBar ? 
				<div className={classList.join(" ")} >{
					panles.map((panelId: string) => {
						return <div key={panelId} className="app-tab-header-item">
							<div className="border-view"></div>
							<div className="title-view" >{panelId}</div>
						</div>
					})
				}</div> : null
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
		const classList: string[] = [];
		const theme: Themes = this.props.theme ?? Themes.dark;

		classList.push(theme === Themes.light ? "light" : "dark");
		classList.push(`background-${BackgroundLevel.Level4}`);
		classList.push(`font-${FontLevel.normal}`);
		classList.push("app-container");
		if (panles.length > 0 && !items) classList.push("end-containe");

		return <div
			className={classList.join(" ")}
			draggable={false}
			style={{
				transition: "none",
				flexDirection: layout === LayoutDirection.Y ? "column" : undefined,
				width: isRoot ? "100%" : selfLayout === LayoutDirection.X ? `${selfScale}%` : undefined,
				height: isRoot ? "100%" : selfLayout === LayoutDirection.Y ? `${selfScale}%` : undefined
			}}
			onMouseMove={isRoot ? (e) => {
				if (this.props.onScaleChange && this.focusEdgeId !== undefined) {
					e.preventDefault();
					let mouveDist: number = 0;
					let rootSize: number = 0;
					let edgeSize: number = 0;
					let newSize: number = 0;

					if (this.edgeInfo.direction === LayoutDirection.X) {
						mouveDist = e.clientX - this.edgeInfo.mouseX;
						rootSize = this.edgeInfo.rootWidth;
						edgeSize = this.edgeInfo.edgeWidth;
						newSize = edgeSize + mouveDist;
					}

					if (this.edgeInfo.direction === LayoutDirection.Y) {
						mouveDist = e.clientY - this.edgeInfo.mouseY;
						rootSize = this.edgeInfo.rootHeight;
						edgeSize = this.edgeInfo.edgeHeight
						newSize = edgeSize + mouveDist;	
					}

					if (newSize < 38) { newSize = 38; }
					if ((rootSize - newSize) < 38) { newSize = rootSize - 38; }

					let newScale = newSize / rootSize;
					this.props.onScaleChange(this.focusEdgeId, newScale * 100);
				}
			} : undefined}
			onMouseUp={isRoot ? () => {
				this.focusEdgeId = undefined;
			} : undefined}
		>
			{panles.length > 0 && !items ? this.renderPanel(panles, showBar) : null}
			{items && items[0] ? this.renderContainer(items[0], scale, layout) : null}
			{items && items[1] ? <div className="drag-bar" style={{
				width: layout === LayoutDirection.Y ? "100%" : 0,
				height: layout === LayoutDirection.X ? "100%" : 0
			}}>
				<div
					style={{ cursor: layout === LayoutDirection.Y ? "n-resize" : "e-resize" }}
					onMouseDown={(e) => {
						const targetNode = e.target;
						if (targetNode instanceof HTMLDivElement) {
							let root = targetNode.parentNode?.parentNode;
							let firstDiv = targetNode.parentNode?.parentNode?.childNodes[0];

							if (root instanceof HTMLDivElement && firstDiv instanceof HTMLDivElement) {
								this.edgeInfo.rootWidth = root.offsetWidth;
								this.edgeInfo.rootHeight = root.offsetHeight;
								this.edgeInfo.edgeWidth = firstDiv.offsetWidth;
								this.edgeInfo.edgeHeight = firstDiv.offsetHeight;
							}
						}
						this.edgeInfo.mouseX = e.clientX;
						this.edgeInfo.mouseY = e.clientY;
						this.edgeInfo.direction = props.layout ?? LayoutDirection.Y;
						this.focusEdgeId = props.id ?? 0;
					}}
					onMouseUp={() => { this.focusEdgeId = undefined }}
				>
				</div>
			</div> : null}
			{items && items[1] ? this.renderContainer(items[1], 100 - scale, layout) : null}
		</div>
	}

	public render(): ReactNode {
		return this.renderContainer(this.props);
	}
}

export { Container };