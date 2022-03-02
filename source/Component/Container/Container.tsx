import { Localization } from "@Component/Localization/Localization";
import { Theme, BackgroundLevel, FontLevel } from "@Component/Theme/Theme";
import { Themes } from "@Context/Setting";
import { DirectionalHint } from "@fluentui/react";
import { ILayout, LayoutDirection } from "@Model/Layout";
import { Component, ReactNode, MouseEvent } from "react";
import { getPanelById, getPanelInfoById } from "../../Panel/Panel";
import { LocalizationTooltipHost } from "../Localization/LocalizationTooltipHost";
import "./Container.scss";

interface IContainerProps extends ILayout {
	showBar?: boolean;
	isRoot?: boolean;
	theme?: Themes;
	focusId?: string;
	onScaleChange?: (id: number, scale: number) => any;
	onFocusTab?: (id: string) => any;
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

	/**
	 * 渲染此 Tab 下的 ELE
	 */
	private renderPanel(panles: string[], showBar: boolean, focus?: string) {

		const classList: string[] = [];
		const theme: Themes = this.props.theme ?? Themes.dark;
		const showPanelId = focus ?? panles[0];
		const showPanelInfo = getPanelInfoById(showPanelId as any);

		classList.push(theme === Themes.light ? "light" : "dark");
		classList.push(`background-${BackgroundLevel.Level3}`);
		classList.push(`font-${FontLevel.Level3}`);
		classList.push("app-tab-header");

		const hasActivePanel = panles.some((id) => id === this.props.focusId);

		return <>
			{showBar ? 
				<div className={classList.join(" ")} onClick={() => {
					this.props.onFocusTab ? this.props.onFocusTab("") : undefined
				}}>{
					panles.map((panelId: string) => {

						const classList: string[] = ["app-tab-header-item"];
						if (panelId === this.props.focusId) classList.push("active");
						if (panelId === showPanelId) classList.push("tab");
						const panelInfo = getPanelInfoById(panelId as any);

						return <LocalizationTooltipHost
							i18nKey={panelInfo ? panelInfo.introKay as any : "Panel.Info.Notfound"}
							options={{id: panelId}}
							directionalHint={DirectionalHint.topAutoEdge}
							delay={2}
							key={panelId}
						>
							<div	
								className={classList.join(" ")}
								onClick={(e) => {
									e.stopPropagation();
									this.props.onFocusTab ? this.props.onFocusTab(panelId) : undefined;
								}}
							>
								<div className="border-view"></div>
								<div className="title-view">
									{
										panelInfo ?
											<Localization i18nKey={panelInfo.nameKey as any}/>:
											<Localization i18nKey="Panel.Title.Notfound" options={{id: panelId}}/>
									}
									
								</div>
							</div>
						</LocalizationTooltipHost>
					})
				}</div> : null
			}
			<div
				onClick={() => this.props.onFocusTab ? this.props.onFocusTab(showPanelId) : undefined}
				className={[
					"app-panel",
					hasActivePanel ? "active" : "",
					showPanelInfo?.hidePadding ? "" : "has-padding",
					showPanelInfo?.hideScrollBar ? "hide-scrollbar" : ""
				].filter(x => !!x).join(" ")}
				draggable={false}
			>
				{getPanelById(showPanelId as any)}
			</div>
		</>
	}

	/**
	 * 处理鼠标移动数据
	 */
	private handelMouseMove = (e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {

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
	}

	/**
	 * 处理鼠标按下事件
	 * 记录鼠标数据
	 */
	private handelMouseDown = (props: ILayout, e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
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
	}

	/**
	 * 递归渲染全部容器
	 */
	private renderContainer (
		props: IContainerProps, selfScale: number = 50,
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
		const focusPanel: string | undefined = props.focusPanel;

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
			onMouseMove={isRoot ? this.handelMouseMove : undefined}
			onMouseUp={isRoot ? () => this.focusEdgeId = undefined : undefined}
		>
			{/* 渲染 Panel */}
			{panles.length > 0 && !items ? this.renderPanel(panles, showBar, focusPanel) : null}

			{/* 渲染第一部分 */}
			{items && items[0] ? this.renderContainer(items[0], scale, layout) : null}

			{/* 渲染拖拽条 */}
			{items && items[1] ? 
				<div className="drag-bar" style={{
					width: layout === LayoutDirection.Y ? "100%" : 0,
					height: layout === LayoutDirection.X ? "100%" : 0
				}}>
					<div
						style={{ cursor: layout === LayoutDirection.Y ? "n-resize" : "e-resize" }}
						onMouseDown={ this.handelMouseDown.bind(this, props) }
						onMouseUp={() => this.focusEdgeId = undefined }
					/>
				</div> : null
			}

			{/* 渲染第二部分 */}
			{items && items[1] ? this.renderContainer(items[1], 100 - scale, layout) : null}
		</div>
	}

	public render(): ReactNode {
		return this.renderContainer(this.props);
	}
}

export { Container };